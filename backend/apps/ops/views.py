from datetime import timedelta

import django_filters
from django.db.models import Count, Prefetch, Q
from django.utils import timezone
from django.utils.text import slugify
from rest_framework import mixins, permissions, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.exceptions import ApiError
from core.permissions import IsAdminOps, IsSuperadmin


class OpsModelViewSet(viewsets.ModelViewSet):
    """Destroy 204 Next.js rewrite ni sindiradi — 200 JSON qaytaramiz."""

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'ok': True})

from apps.applications.models import Application, ApplicationEvent
from apps.applications.schema import STEPS
from apps.applications.state_machine import TRANSITIONS, transition_application
from apps.cms.models import Faculty, News, Partner, StaffMember, Page, Investor, GalleryImage
from apps.cohorts.models import Season, Track
from apps.cohorts.state_machine import TRANSITIONS as SEASON_TRANSITIONS, transition_season
from apps.notifications.models import Broadcast, Notification
from apps.notifications.tasks import deliver_notification, run_broadcast
from apps.portfolio.models import StartupPortfolio
from apps.reviews.models import ReviewAssignment, ReviewScore, InterviewEvent
from apps.reviews.serializers import ReviewAssignmentSerializer, ReviewScoreSerializer
from apps.teams.models import Team, TeamMembership
from apps.users.models import User, UserCapability
from .models import (
    Campaign, Lead, OpsTask, ProgramWeek, Deliverable, Attendance, TeamWeeklyUpdate,
    MentorAssignment, OfficeHour, DemoDaySlot, InvestorInterest, KnowledgeArticle, SurveyResponse,
)
from .serializers import (
    CampaignSerializer, LeadSerializer, OpsTaskSerializer, ProgramWeekSerializer,
    DeliverableSerializer, AttendanceSerializer, TeamWeeklyUpdateSerializer,
    MentorAssignmentSerializer, OfficeHourSerializer, DemoDaySlotSerializer,
    InvestorInterestSerializer, KnowledgeArticleSerializer, SurveyResponseSerializer,
    AdminUserSerializer, AdminTeamSerializer, AdminSeasonSerializer, AdminTrackSerializer,
    AdminApplicationSerializer, AdminFacultySerializer, AdminNewsSerializer,
    AdminPartnerSerializer, AdminStaffSerializer, AdminInvestorSerializer,
    AdminGallerySerializer, AdminPageSerializer, AdminPortfolioSerializer,
    InterviewOpsSerializer,
)
from .services import (
    campaign_redirect, convert_lead, ingest_leads, record_hit, unique_code,
)


class PublicCampaignGoView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, code):
        campaign = Campaign.objects.filter(code=code, is_active=True).first()
        if not campaign:
            raise ApiError('NOT_FOUND', 'Kampaniya topilmadi', status_code=404)
        record_hit(campaign, request)
        return Response({
            'code': campaign.code,
            'name': campaign.name,
            'channel': campaign.channel,
            'redirect': campaign_redirect(campaign),
        })


class StatsView(views.APIView):
    permission_classes = [IsAdminOps]

    def get(self, request):
        season = Season.objects.filter(is_current=True).prefetch_related('tracks').first()
        app_qs = Application.objects.all()
        if season:
            app_qs = app_qs.filter(season=season)

        funnel_apps = {k: 0 for k, _ in Application.Status.choices}
        for row in app_qs.values('status').annotate(n=Count('id')):
            funnel_apps[row['status']] = row['n']

        funnel_leads = {k: 0 for k, _ in Lead.Status.choices}
        for row in Lead.objects.values('status').annotate(n=Count('id')):
            funnel_leads[row['status']] = row['n']

        now = timezone.now()
        upcoming = InterviewEvent.objects.filter(
            cancelled_at__isnull=True, starts_at__gte=now
        ).count()
        pending_reviews = ReviewAssignment.objects.filter(
            Q(score__isnull=True) | Q(score__submitted_at__isnull=True)
        ).count()
        open_tasks = OpsTask.objects.exclude(status='done').count()

        at_risk = 0
        if season:
            cutoff = now - timedelta(days=7)
            accepted = Team.objects.filter(season=season, status='accepted')
            recent = TeamWeeklyUpdate.objects.filter(created_at__gte=cutoff).values_list('team_id', flat=True)
            at_risk = accepted.exclude(id__in=recent).count() if accepted.exists() else 0

        league = []
        faculties = Faculty.objects.filter(is_active=True)
        lead_map = dict(Lead.objects.values('faculty_id').annotate(n=Count('id')).values_list('faculty_id', 'n'))
        app_map = dict(
            app_qs.exclude(faculty_id=None).values('faculty_id').annotate(n=Count('id')).values_list('faculty_id', 'n')
        )
        for f in faculties:
            league.append({
                'id': str(f.id),
                'name': f.name_uz,
                'slug': f.slug,
                'leads': lead_map.get(f.id, 0),
                'applications': app_map.get(f.id, 0),
            })
        league.sort(key=lambda x: (x['applications'], x['leads']), reverse=True)

        events = ApplicationEvent.objects.select_related('application__team').order_by('-created_at')[:12]
        recent = [
            {
                'id': str(e.id),
                'team': e.application.team.name,
                'from_status': e.from_status,
                'to_status': e.to_status,
                'note': e.note,
                'created_at': e.created_at,
            }
            for e in events
        ]

        campaigns = Campaign.objects.annotate(leads_count=Count('leads')).order_by('-clicks')[:6]
        top_campaigns = [
            {
                'id': str(c.id),
                'name': c.name,
                'code': c.code,
                'channel': c.channel,
                'clicks': c.clicks,
                'leads': c.leads_count,
            }
            for c in campaigns
        ]

        season_data = None
        if season:
            season_data = {
                'id': str(season.id),
                'slug': season.slug,
                'name_uz': season.name_uz,
                'status': season.status,
                'is_current': season.is_current,
                'apply_opens_at': season.apply_opens_at,
                'apply_closes_at': season.apply_closes_at,
                'program_starts_at': season.program_starts_at,
                'demo_day_at': season.demo_day_at,
                'program_weeks': season.program_weeks,
            }

        return Response({
            'season': season_data,
            'funnel_apps': funnel_apps,
            'funnel_leads': funnel_leads,
            'counts': {
                'users': User.objects.filter(is_active=True).count(),
                'teams': Team.objects.exclude(status='disbanded').count(),
                'leads': Lead.objects.exclude(status__in=['converted', 'lost']).count(),
                'interviews_upcoming': upcoming,
                'reviews_pending': pending_reviews,
                'tasks_open': open_tasks,
                'at_risk': at_risk,
            },
            'faculty_league': league,
            'recent_events': recent,
            'campaigns': top_campaigns,
        })


class CampaignViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = CampaignSerializer
    search_fields = ['name', 'code']
    filterset_fields = ['channel', 'faculty', 'is_active']
    queryset = Campaign.objects.select_related('faculty').annotate(
        leads_count=Count('leads', distinct=True),
        unique_hits=Count('hits__ip', distinct=True),
    )


class LeadViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = LeadSerializer
    search_fields = ['email', 'name', 'phone', 'idea']
    filterset_fields = ['status', 'source', 'faculty', 'campaign', 'owner']
    queryset = Lead.objects.select_related('faculty', 'campaign', 'owner', 'converted_user')

    @action(detail=True, methods=['post'])
    def convert(self, request, pk=None):
        lead = self.get_object()
        if lead.status == Lead.Status.CONVERTED:
            raise ApiError('ALREADY', 'Allaqachon konvertatsiya qilingan')
        lead, user = convert_lead(lead, actor=request.user)
        return Response({'lead': LeadSerializer(lead).data, 'user_id': str(user.id)})

    @action(detail=False, methods=['post'])
    def ingest(self, request):
        n = ingest_leads()
        return Response({'created': n})


class OpsTaskViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = OpsTaskSerializer
    search_fields = ['title', 'body']
    filterset_fields = ['status', 'area', 'assignee', 'season']
    queryset = OpsTask.objects.select_related('assignee', 'team', 'season')


class ProgramWeekViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = ProgramWeekSerializer
    filterset_fields = ['season']
    queryset = ProgramWeek.objects.select_related('season')

    @action(detail=False, methods=['post'])
    def sync(self, request):
        season_id = request.data.get('season')
        season = Season.objects.filter(pk=season_id).first() if season_id else Season.objects.filter(is_current=True).first()
        if not season:
            raise ApiError('NO_SEASON', 'Mavsum topilmadi', status_code=404)
        created = 0
        curriculum = season.curriculum if isinstance(season.curriculum, list) else []
        if not curriculum:
            for i in range(1, (season.program_weeks or 10) + 1):
                _, is_new = ProgramWeek.objects.update_or_create(
                    season=season, week=i,
                    defaults={'title_uz': f'{i}-hafta', 'slug': f'week-{i}'},
                )
                created += int(is_new)
        else:
            for item in curriculum:
                week = int(item.get('week') or 0)
                if not week:
                    continue
                _, is_new = ProgramWeek.objects.update_or_create(
                    season=season, week=week,
                    defaults={
                        'slug': item.get('slug') or f'week-{week}',
                        'title_uz': item.get('title_uz') or f'{week}-hafta',
                        'title_en': item.get('title_en') or '',
                        'outcome_uz': item.get('outcome_uz') or '',
                    },
                )
                created += int(is_new)
        qs = ProgramWeek.objects.filter(season=season).order_by('week')
        return Response({'created': created, 'weeks': ProgramWeekSerializer(qs, many=True).data})


class DeliverableViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = DeliverableSerializer
    filterset_fields = ['week', 'team', 'status']
    queryset = Deliverable.objects.select_related('week', 'team')


class AttendanceViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AttendanceSerializer
    filterset_fields = ['week', 'team', 'present']
    queryset = Attendance.objects.select_related('week', 'team')


class TeamWeeklyUpdateViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = TeamWeeklyUpdateSerializer
    filterset_fields = ['week', 'team']
    queryset = TeamWeeklyUpdate.objects.select_related('week', 'team')


class MentorAssignmentViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = MentorAssignmentSerializer
    filterset_fields = ['team', 'mentor', 'kind']
    queryset = MentorAssignment.objects.select_related('team', 'mentor')


class OfficeHourViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = OfficeHourSerializer
    filterset_fields = ['mentor', 'team', 'status']
    queryset = OfficeHour.objects.select_related('mentor', 'team')


class DemoDaySlotViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = DemoDaySlotSerializer
    filterset_fields = ['season', 'team']
    queryset = DemoDaySlot.objects.select_related('season', 'team')


class InvestorInterestViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = InvestorInterestSerializer
    filterset_fields = ['team', 'status', 'investor']
    queryset = InvestorInterest.objects.select_related('investor', 'team')


class KnowledgeArticleViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = KnowledgeArticleSerializer
    search_fields = ['title_uz', 'slug', 'body_uz']
    filterset_fields = ['audience', 'is_published']
    queryset = KnowledgeArticle.objects.all()


class SurveyResponseViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = SurveyResponseSerializer
    filterset_fields = ['season', 'week', 'kind']
    queryset = SurveyResponse.objects.select_related('season', 'week')


class AdminUserViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminUserSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
    search_fields = ['email', 'name', 'phone', 'student_id']
    filterset_fields = ['role', 'faculty', 'is_active', 'is_student_verified', 'affiliation']
    queryset = User.objects.select_related('faculty').prefetch_related('capabilities')

    def create(self, request, *args, **kwargs):
        if request.user.role != 'superadmin':
            raise ApiError('FORBIDDEN_ACTOR', 'Xodim yaratish — superadmin', status_code=403)
        email = (request.data.get('email') or '').strip().lower()
        password = request.data.get('password') or ''
        name = (request.data.get('name') or '').strip() or email.split('@')[0]
        role = request.data.get('role') or User.Role.ADMIN
        if not email or len(password) < 8:
            raise ApiError('VALIDATION_ERROR', 'Email va kamida 8 belgilik parol majburiy')
        if User.objects.filter(email=email).exists():
            raise ApiError('EXISTS', 'Bu email band', status_code=409)
        if role not in (User.Role.ADMIN, User.Role.SUPERADMIN, User.Role.INVESTOR):
            role = User.Role.ADMIN
        user = User.objects.create_user(email=email, password=password, name=name, role=role)
        caps = request.data.get('capabilities') or []
        for cap in caps:
            UserCapability.objects.get_or_create(user=user, capability=cap)
        return Response(AdminUserSerializer(user).data, status=201)

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        user = self.get_object()
        user.is_student_verified = True
        try:
            user.save(update_fields=['is_student_verified'])
        except Exception:
            raise ApiError('STUDENT_ID_TAKEN', 'Bu student_id allaqachon tasdiqlangan')
        return Response(AdminUserSerializer(user).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSuperadmin])
    def roles(self, request, pk=None):
        user = self.get_object()
        role = request.data.get('role')
        caps = request.data.get('capabilities') or []
        if role:
            user.role = role
            user.save()
        UserCapability.objects.filter(user=user).delete()
        for cap in caps:
            UserCapability.objects.create(user=user, capability=cap)
        return Response(AdminUserSerializer(user).data)

    @action(detail=True, methods=['post'], permission_classes=[IsSuperadmin])
    def set_password(self, request, pk=None):
        user = self.get_object()
        password = request.data.get('password') or ''
        if len(password) < 8:
            raise ApiError('WEAK_PASSWORD', 'Parol kamida 8 belgi')
        user.set_password(password)
        user.save(update_fields=['password'])
        return Response({'ok': True})


class AdminTeamViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminTeamSerializer
    search_fields = ['name', 'slug', 'one_liner_uz']
    filterset_fields = ['status', 'season']
    queryset = Team.objects.select_related('season').prefetch_related('memberships__user')

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = self.get_object()
        user = User.objects.filter(pk=request.data.get('user_id')).first()
        if not user:
            raise ApiError('NOT_FOUND', 'Foydalanuvchi topilmadi', status_code=404)
        role = request.data.get('role') or 'member'
        existing = team.memberships.filter(user=user, left_at__isnull=True).first()
        if existing:
            raise ApiError('EXISTS', 'Allaqachon a’zo', status_code=409)
        TeamMembership.objects.create(team=team, user=user, season=team.season, role=role)
        return Response(AdminTeamSerializer(team).data)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        team = self.get_object()
        m = team.memberships.filter(user_id=request.data.get('user_id'), left_at__isnull=True).first()
        if not m:
            raise ApiError('NOT_MEMBER', 'A’zo topilmadi', status_code=404)
        m.left_at = timezone.now()
        m.save(update_fields=['left_at'])
        return Response(AdminTeamSerializer(team).data)


class AdminSeasonViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminSeasonSerializer
    search_fields = ['slug', 'name_uz']
    filterset_fields = ['status', 'is_current']
    queryset = Season.objects.prefetch_related('tracks')

    def perform_create(self, serializer):
        obj = serializer.save()
        if obj.is_current:
            Season.objects.exclude(pk=obj.pk).filter(is_current=True).update(is_current=False)

    def perform_update(self, serializer):
        obj = serializer.save()
        if obj.is_current:
            Season.objects.exclude(pk=obj.pk).filter(is_current=True).update(is_current=False)

    @action(detail=True, methods=['post'])
    def transition(self, request, pk=None):
        season = self.get_object()
        to_status = request.data.get('to')
        note = request.data.get('note') or ''
        transition_season(season, to_status, actor=request.user, note=note)
        return Response(AdminSeasonSerializer(season).data)

    @action(detail=True, methods=['get'])
    def allowed(self, request, pk=None):
        season = self.get_object()
        return Response({'from': season.status, 'to': SEASON_TRANSITIONS.get(season.status, [])})


class AdminTrackViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminTrackSerializer
    filterset_fields = ['season', 'is_active']
    queryset = Track.objects.select_related('season')

    def perform_create(self, serializer):
        data = serializer.validated_data
        if not data.get('slug'):
            data['slug'] = slugify(data.get('name_uz') or 'track') or 'track'
        serializer.save()


class AdminApplicationFilter(django_filters.FilterSet):
    season_slug = django_filters.CharFilter(field_name='season__slug')
    track_slug = django_filters.CharFilter(field_name='track__slug')
    faculty_slug = django_filters.CharFilter(field_name='faculty__slug')

    class Meta:
        model = Application
        fields = ['status', 'season', 'track', 'faculty', 'season_slug', 'track_slug', 'faculty_slug']


class AdminApplicationViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
                              mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                              viewsets.GenericViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminApplicationSerializer
    filterset_class = AdminApplicationFilter
    search_fields = [
        'team__name', 'problem', 'solution',
        'team__memberships__user__email', 'team__memberships__user__name',
    ]
    ordering_fields = ['submitted_at', 'created_at', 'status']
    ordering = ['-submitted_at', '-created_at']
    queryset = Application.objects.select_related(
        'team', 'track', 'season', 'faculty'
    ).prefetch_related(
        'events', 'scores', 'team__memberships__user',
        'assignments__reviewer', 'assignments__score', 'interviews',
    )

    def perform_destroy(self, instance):
        if instance.status != Application.Status.DRAFT and self.request.user.role != 'superadmin':
            raise ApiError('FORBIDDEN', 'Faqat draft o‘chiriladi', status_code=403)
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'ok': True})

    @action(detail=True, methods=['post'])
    def transition(self, request, pk=None):
        app = self.get_object()
        to_status = request.data.get('to')
        force = bool(request.data.get('force'))
        note = request.data.get('note') or ''
        transition_application(app, to_status, actor=request.user, force=force, note=note)
        app.refresh_from_db()
        return Response(AdminApplicationSerializer(app, context={'request': request}).data)

    @action(detail=True, methods=['get'])
    def allowed(self, request, pk=None):
        app = self.get_object()
        return Response({'from': app.status, 'to': list(TRANSITIONS.get(app.status, {}).keys())})

    @action(detail=False, methods=['get'])
    def form(self, request):
        return Response({'steps': STEPS})

    @action(detail=True, methods=['get', 'post'])
    def interviews(self, request, pk=None):
        app = self.get_object()
        if request.method == 'GET':
            qs = InterviewEvent.objects.filter(application=app)
            return Response(InterviewOpsSerializer(qs, many=True).data)
        ser = InterviewOpsSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save(application=app, created_by=request.user)
        return Response(ser.data, status=201)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        app = self.get_object()
        reviewer = User.objects.filter(pk=request.data.get('reviewer_id')).first()
        if not reviewer:
            raise ApiError('NOT_FOUND', 'Reviewer topilmadi', status_code=404)
        if app.team.memberships.filter(user=reviewer, left_at__isnull=True).exists():
            raise ApiError('COI', 'Reviewer shu jamoa a’zosi')
        if ReviewAssignment.objects.filter(application=app, reviewer=reviewer).exists():
            raise ApiError('EXISTS', 'Allaqachon biriktirilgan', status_code=409)
        obj = ReviewAssignment.objects.create(
            application=app,
            reviewer=reviewer,
            assigned_by=request.user,
            due_at=request.data.get('due_at'),
        )
        return Response(ReviewAssignmentSerializer(obj, context={'request': request}).data, status=201)

    @action(detail=True, methods=['post'])
    def unassign(self, request, pk=None):
        app = self.get_object()
        a = ReviewAssignment.objects.filter(pk=request.data.get('assignment_id'), application=app).first()
        if not a:
            raise ApiError('NOT_FOUND', 'Biriktirish topilmadi', status_code=404)
        if hasattr(a, 'score') and a.score.submitted_at:
            raise ApiError('SCORE_LOCKED', 'Submitted ballni olib tashlab bo‘lmaydi', status_code=409)
        a.delete()
        return Response({'ok': True})

    @action(detail=False, methods=['get'])
    def summary(self, request):
        qs = self.get_queryset()
        season = request.query_params.get('season') or request.query_params.get('season_slug')
        if season:
            if len(season) > 20:
                qs = qs.filter(season_id=season)
            else:
                qs = qs.filter(season__slug=season)
        track = request.query_params.get('track') or request.query_params.get('track_slug')
        if track:
            if len(track) > 20:
                qs = qs.filter(track_id=track)
            else:
                qs = qs.filter(track__slug=track)
        faculty = request.query_params.get('faculty') or request.query_params.get('faculty_slug')
        if faculty:
            if len(faculty) > 20:
                qs = qs.filter(faculty_id=faculty)
            else:
                qs = qs.filter(faculty__slug=faculty)
        by_status = {k: 0 for k, _ in Application.Status.choices}
        for row in qs.values('status').annotate(n=Count('id')):
            by_status[row['status']] = row['n']
        return Response({'by_status': by_status, 'total': qs.count()})

    @action(detail=False, methods=['get'])
    def meta(self, request):
        seasons = [
            {'id': str(s.id), 'slug': s.slug, 'name_uz': s.name_uz, 'is_current': s.is_current}
            for s in Season.objects.order_by('-is_current', '-created_at')
        ]
        tracks = [
            {'id': str(t.id), 'slug': t.slug, 'name_uz': t.name_uz, 'season': str(t.season_id)}
            for t in Track.objects.filter(is_active=True).order_by('name_uz')
        ]
        faculties = [
            {'id': str(f.id), 'slug': f.slug, 'name_uz': f.name_uz}
            for f in Faculty.objects.filter(is_active=True).order_by('name_uz')
        ]
        reviewers = [
            {'id': str(u.id), 'email': u.email, 'name': u.name}
            for u in User.objects.filter(
                Q(role__in=['admin', 'superadmin']) | Q(capabilities__capability='reviewer')
            ).distinct().order_by('name')
        ]
        return Response({
            'seasons': seasons,
            'tracks': tracks,
            'faculties': faculties,
            'reviewers': reviewers,
            'steps': STEPS,
            'transitions': {k: list(v.keys()) for k, v in TRANSITIONS.items()},
        })


class InterviewViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = InterviewOpsSerializer
    filterset_fields = ['application']
    queryset = InterviewEvent.objects.select_related('application__team', 'application')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        obj = self.get_object()
        obj.cancelled_at = timezone.now()
        obj.save(update_fields=['cancelled_at'])
        return Response(InterviewOpsSerializer(obj).data)


class ReviewBoardView(views.APIView):
    permission_classes = [IsAdminOps]

    def get(self, request):
        season = request.query_params.get('season')
        qs = Application.objects.exclude(status='draft').select_related('team', 'track', 'season')
        if season:
            qs = qs.filter(season_id=season)
        else:
            current = Season.objects.filter(is_current=True).first()
            if current:
                qs = qs.filter(season=current)
        qs = qs.prefetch_related('scores', 'assignments__reviewer')
        rows = []
        for app in qs:
            scores = [s for s in app.scores.all() if s.submitted_at]
            weights = app.season.scoring_weights or {}
            avg = round(sum(s.weighted(weights) for s in scores) / len(scores), 3) if scores else None
            rows.append({
                'id': str(app.id),
                'team_name': app.team.name,
                'status': app.status,
                'track': app.track.slug,
                'assignments': [
                    {
                        'id': str(a.id),
                        'reviewer_id': str(a.reviewer_id),
                        'reviewer_email': a.reviewer.email,
                        'has_score': hasattr(a, 'score'),
                        'submitted': bool(getattr(getattr(a, 'score', None), 'submitted_at', None)),
                    }
                    for a in app.assignments.all()
                ],
                'score_count': len(scores),
                'min_scores': app.season.min_scores,
                'score_avg': avg,
            })
        reviewers = User.objects.filter(
            Q(role__in=['admin', 'superadmin']) | Q(capabilities__capability='reviewer')
        ).distinct().values('id', 'email', 'name')
        return Response({
            'results': rows,
            'reviewers': [{'id': str(r['id']), 'email': r['email'], 'name': r['name']} for r in reviewers],
        })


class FacultyViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminFacultySerializer
    search_fields = ['name_uz', 'slug']
    queryset = Faculty.objects.all().order_by('name_uz')
    pagination_class = None


class NewsViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminNewsSerializer
    search_fields = ['title_uz', 'slug']
    filterset_fields = ['is_published']
    queryset = News.objects.all().order_by('-published_at', '-created_at')

    def _stamp_publish(self, obj):
        if obj.is_published and not obj.published_at:
            obj.published_at = timezone.now()
            obj.save(update_fields=['published_at'])

    def perform_create(self, serializer):
        obj = serializer.save()
        self._stamp_publish(obj)

    def perform_update(self, serializer):
        obj = serializer.save()
        self._stamp_publish(obj)


class PartnerViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminPartnerSerializer
    search_fields = ['name', 'slug']
    queryset = Partner.objects.all()


class StaffViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminStaffSerializer
    search_fields = ['name', 'slug']
    queryset = StaffMember.objects.all()


class InvestorViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminInvestorSerializer
    search_fields = ['name', 'org', 'slug']
    queryset = Investor.objects.all()


class GalleryViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminGallerySerializer
    search_fields = ['caption_uz', 'slug']
    filterset_fields = ['is_published', 'placement', 'show_in_gallery']
    queryset = GalleryImage.objects.all()


class PageViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminPageSerializer
    search_fields = ['title_uz', 'slug']
    queryset = Page.objects.all()


class PortfolioViewSet(OpsModelViewSet):
    permission_classes = [IsAdminOps]
    serializer_class = AdminPortfolioSerializer
    search_fields = ['slug', 'summary_uz', 'team__name']
    filterset_fields = ['is_published', 'season', 'track']
    queryset = StartupPortfolio.objects.select_related('team', 'season', 'track')


class BroadcastViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminOps]

    def list(self, request):
        rows = Broadcast.objects.select_related('created_by').all()[:50]
        return Response([
            {
                'id': str(b.id),
                'title': b.title,
                'body': b.body,
                'audience': b.audience,
                'channels': b.channels,
                'sent_at': b.sent_at,
                'total': b.total,
                'sent_ok': b.sent_ok,
                'sent_fail': b.sent_fail,
                'created_at': b.created_at,
            }
            for b in rows
        ])

    def create(self, request, *args, **kwargs):
        title = (request.data.get('title') or '').strip()
        body = (request.data.get('body') or '').strip()
        audience = request.data.get('audience') or Broadcast.Audience.ALL_LINKED
        channels = request.data.get('channels') or ['telegram', 'email']
        if not title or not body:
            raise ApiError('VALIDATION_ERROR', 'title va body majburiy')
        if audience not in Broadcast.Audience.values:
            raise ApiError('VALIDATION_ERROR', 'Noto‘g‘ri audience')
        b = Broadcast.objects.create(
            title=title, body=body, audience=audience, channels=channels, created_by=request.user,
        )
        run_broadcast.delay(str(b.id))
        return Response({'id': str(b.id), 'queued': True}, status=201)

    @action(detail=False, methods=['post'])
    def send_one(self, request):
        user_id = request.data.get('user_id')
        title = (request.data.get('title') or '').strip()
        body = (request.data.get('body') or '').strip()
        channels = request.data.get('channels') or ['telegram']
        user = User.objects.filter(pk=user_id).first()
        if not user or not title:
            raise ApiError('VALIDATION_ERROR', 'user_id va title majburiy')
        created = []
        for ch in channels:
            if ch == 'telegram' and not user.telegram_user_id:
                continue
            n = Notification.objects.create(
                user=user, email=user.email if ch == 'email' else '',
                channel=ch, title=title, body=body,
            )
            deliver_notification.delay(str(n.id))
            created.append(str(n.id))
        if not created:
            raise ApiError('NO_CHANNEL', 'Telegram ulanmagan yoki kanal yo‘q')
        return Response({'queued': created}, status=201)


class UploadView(views.APIView):
    permission_classes = [IsAdminOps]

    def post(self, request):
        from django.core.files.storage import default_storage
        import uuid as uuidlib

        f = request.FILES.get('file')
        if not f:
            raise ApiError('VALIDATION_ERROR', 'file majburiy')
        if f.size > 25 * 1024 * 1024:
            raise ApiError('FILE_TOO_LARGE', 'Maksimal 25 MB')
        ext = (f.name.rsplit('.', 1)[-1] if '.' in f.name else 'bin').lower()
        images = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'}
        docs = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', 'txt'}
        media = {'mp4', 'webm', 'mp3', 'wav', 'ogg'}
        if ext not in images | docs | media:
            raise ApiError('VALIDATION_ERROR', 'Ruxsat: rasm, pdf, office, zip, mp4, mp3')
        kind = 'image' if ext in images else ('media' if ext in media else 'file')
        name = f'public/cms/editor/{uuidlib.uuid4().hex}.{ext}'
        saved = default_storage.save(name, f)
        url = '/media/' + saved.replace('\\', '/').lstrip('/')
        return Response({'url': url, 'name': f.name, 'kind': kind}, status=201)


class ChoicesView(views.APIView):
    permission_classes = [IsAdminOps]

    def get(self, request):
        return Response({
            'lead_status': Lead.Status.choices,
            'lead_source': Lead.Source.choices,
            'campaign_channel': Campaign.Channel.choices,
            'application_status': Application.Status.choices,
            'season_status': Season.Status.choices,
            'team_status': Team.Status.choices,
            'user_role': User.Role.choices,
            'affiliation': User.Affiliation.choices,
            'task_status': OpsTask.Status.choices,
            'task_area': OpsTask.Area.choices,
        })
