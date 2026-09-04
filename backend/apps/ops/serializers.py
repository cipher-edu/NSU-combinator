from rest_framework import serializers
from apps.applications.models import Application
from apps.applications.schema import STEPS, step_progress
from apps.applications.serializers import ApplicationEventSerializer
from apps.applications.state_machine import TRANSITIONS
from apps.cms.models import Faculty, News, Partner, StaffMember, Page, Investor, GalleryImage
from apps.cohorts.models import Season, Track
from apps.portfolio.models import StartupPortfolio
from apps.reviews.models import ReviewAssignment, ReviewScore, InterviewEvent
from apps.teams.models import Team, TeamMembership
from apps.users.models import User
from .models import (
    Campaign, CampaignHit, Lead, OpsTask, ProgramWeek, Deliverable, Attendance,
    TeamWeeklyUpdate, MentorAssignment, OfficeHour, DemoDaySlot, InvestorInterest,
    KnowledgeArticle, SurveyResponse,
)
from .services import unique_code, unique_slug


class CampaignSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source='faculty.name_uz', read_only=True, allow_null=True)
    leads_count = serializers.IntegerField(read_only=True)
    unique_hits = serializers.IntegerField(read_only=True)
    apply_url = serializers.SerializerMethodField()
    telegram_url = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = (
            'id', 'code', 'name', 'channel', 'destination', 'faculty', 'faculty_name',
            'note', 'is_active', 'clicks', 'leads_count', 'unique_hits',
            'apply_url', 'telegram_url', 'created_at',
        )
        read_only_fields = ('id', 'clicks', 'created_at')

    def get_apply_url(self, obj):
        return f'/r/{obj.code}'

    def get_telegram_url(self, obj):
        from django.conf import settings
        bot = (settings.TELEGRAM_BOT_USERNAME or '').lstrip('@')
        if not bot:
            return ''
        return f'https://t.me/{bot}?start=c_{obj.code}'

    def create(self, validated):
        if not validated.get('code'):
            validated['code'] = unique_code(validated.get('name') or 'c')
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated['created_by'] = request.user
        return super().create(validated)


class LeadSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source='faculty.name_uz', read_only=True, allow_null=True)
    campaign_code = serializers.CharField(source='campaign.code', read_only=True, allow_null=True)
    owner_name = serializers.CharField(source='owner.name', read_only=True, allow_null=True)
    converted_email = serializers.CharField(source='converted_user.email', read_only=True, allow_null=True)

    class Meta:
        model = Lead
        fields = (
            'id', 'email', 'name', 'phone', 'idea', 'notes', 'affiliation', 'status', 'source',
            'faculty', 'faculty_name', 'campaign', 'campaign_code', 'owner', 'owner_name',
            'converted_user', 'converted_email', 'next_contact_at', 'converted_at',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'converted_user', 'converted_at', 'created_at', 'updated_at')


class OpsTaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assignee.name', read_only=True, allow_null=True)
    team_name = serializers.CharField(source='team.name', read_only=True, allow_null=True)

    class Meta:
        model = OpsTask
        fields = (
            'id', 'title', 'body', 'status', 'area', 'assignee', 'assignee_name',
            'due_at', 'team', 'team_name', 'season', 'created_at', 'updated_at',
        )


class ProgramWeekSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramWeek
        fields = (
            'id', 'season', 'week', 'slug', 'title_uz', 'title_en', 'outcome_uz',
            'starts_at', 'created_at',
        )


class DeliverableSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    week_n = serializers.IntegerField(source='week.week', read_only=True)

    class Meta:
        model = Deliverable
        fields = (
            'id', 'week', 'week_n', 'team', 'team_name', 'status', 'url', 'notes',
            'submitted_at', 'created_at',
        )


class AttendanceSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = Attendance
        fields = ('id', 'week', 'team', 'team_name', 'present', 'notes', 'created_at')


class TeamWeeklyUpdateSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = TeamWeeklyUpdate
        fields = ('id', 'week', 'team', 'team_name', 'body', 'url', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated['created_by'] = request.user
        return super().create(validated)


class MentorAssignmentSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)
    mentor_email = serializers.EmailField(source='mentor.email', read_only=True)

    class Meta:
        model = MentorAssignment
        fields = (
            'id', 'team', 'team_name', 'mentor', 'mentor_name', 'mentor_email',
            'kind', 'notes', 'created_at',
        )


class OfficeHourSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source='mentor.name', read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True, allow_null=True)

    class Meta:
        model = OfficeHour
        fields = (
            'id', 'mentor', 'mentor_name', 'team', 'team_name', 'starts_at', 'ends_at',
            'notes', 'summary', 'status', 'created_at',
        )


class DemoDaySlotSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = DemoDaySlot
        fields = (
            'id', 'season', 'team', 'team_name', 'order', 'speaker', 'duration_sec',
            'deck_ok', 'demo_ok', 'video_ok', 'tech_checked', 'notes', 'created_at',
        )


class InvestorInterestSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    investor_title = serializers.CharField(source='investor.name', read_only=True, allow_null=True)

    class Meta:
        model = InvestorInterest
        fields = (
            'id', 'investor', 'investor_title', 'investor_name', 'team', 'team_name',
            'status', 'notes', 'created_at',
        )


class KnowledgeArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeArticle
        fields = ('id', 'slug', 'title_uz', 'body_uz', 'audience', 'is_published', 'created_at', 'updated_at')
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def create(self, validated):
        if not validated.get('slug'):
            validated['slug'] = unique_slug(KnowledgeArticle, validated.get('title_uz') or 'maqola')
        return super().create(validated)


class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = ('id', 'season', 'week', 'kind', 'score', 'comment', 'created_at')


class AdminUserSerializer(serializers.ModelSerializer):
    capabilities = serializers.SerializerMethodField()
    faculty_name = serializers.CharField(source='faculty.name_uz', read_only=True, allow_null=True)
    telegram_linked = serializers.BooleanField(read_only=True)
    profile_complete = serializers.BooleanField(read_only=True)
    has_password = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'email', 'name', 'bio', 'phone', 'photo', 'role', 'email_kind',
            'affiliation', 'student_id', 'faculty', 'faculty_name', 'is_student_verified',
            'is_active', 'locale', 'capabilities', 'telegram_linked', 'telegram_username',
            'profile_complete', 'has_password', 'created_at',
        )
        read_only_fields = (
            'id', 'email_kind', 'telegram_linked', 'telegram_username',
            'profile_complete', 'has_password', 'created_at',
        )

    def get_capabilities(self, obj):
        return list(obj.capabilities.values_list('capability', flat=True))

    def get_has_password(self, obj):
        return obj.has_usable_password()


class AdminMembershipSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True)

    class Meta:
        model = TeamMembership
        fields = ('id', 'user_id', 'email', 'name', 'role', 'left_at')


class AdminTeamSerializer(serializers.ModelSerializer):
    memberships = serializers.SerializerMethodField()
    season_slug = serializers.CharField(source='season.slug', read_only=True)
    season_name = serializers.CharField(source='season.name_uz', read_only=True)

    class Meta:
        model = Team
        fields = (
            'id', 'name', 'slug', 'one_liner_uz', 'one_liner_en', 'logo',
            'status', 'season', 'season_slug', 'season_name', 'memberships', 'created_at',
        )
        read_only_fields = ('id', 'slug', 'created_at')

    def get_memberships(self, obj):
        qs = obj.memberships.filter(left_at__isnull=True).select_related('user')
        return AdminMembershipSerializer(qs, many=True).data


class AdminTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ('id', 'season', 'slug', 'name_uz', 'name_en', 'is_active')


class AdminSeasonSerializer(serializers.ModelSerializer):
    tracks = AdminTrackSerializer(many=True, read_only=True)

    class Meta:
        model = Season
        fields = (
            'id', 'slug', 'name_uz', 'name_en', 'status', 'is_current', 'is_alumni_published',
            'program_weeks', 'min_scores', 'scoring_weights', 'apply_opens_at', 'apply_closes_at',
            'program_starts_at', 'demo_day_at', 'stats_override', 'curriculum', 'tracks',
            'created_at', 'updated_at',
        )


class AdminApplicationSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    team_slug = serializers.CharField(source='team.slug', read_only=True)
    one_liner = serializers.CharField(source='team.one_liner_uz', read_only=True)
    track_slug = serializers.CharField(source='track.slug', read_only=True)
    track_name = serializers.CharField(source='track.name_uz', read_only=True)
    season_slug = serializers.CharField(source='season.slug', read_only=True)
    season_name = serializers.CharField(source='season.name_uz', read_only=True)
    faculty_name = serializers.CharField(source='faculty.name_uz', read_only=True, allow_null=True)
    has_deck = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()
    current_step = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    events = ApplicationEventSerializer(many=True, read_only=True)
    lead_email = serializers.SerializerMethodField()
    lead_name = serializers.SerializerMethodField()
    lead_phone = serializers.SerializerMethodField()
    score_count = serializers.SerializerMethodField()
    score_avg = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    assignments = serializers.SerializerMethodField()
    interviews = serializers.SerializerMethodField()
    allowed_to = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            'id', 'season', 'season_slug', 'season_name', 'team', 'team_name', 'team_slug', 'one_liner',
            'track', 'track_slug', 'track_name',
            'faculty', 'faculty_name', 'status', 'submitted_at',
            'problem', 'solution', 'stage', 'why_us', 'faculty_endorsement_name',
            'demo_url', 'video_url', 'has_deck', 'extra', 'answers', 'current_step',
            'progress', 'events', 'lead_email', 'lead_name', 'lead_phone',
            'score_count', 'score_avg', 'members', 'assignments', 'interviews', 'allowed_to',
            'created_at', 'updated_at',
        )
        read_only_fields = (
            'id', 'season', 'team', 'status', 'submitted_at', 'created_at', 'updated_at',
        )

    def get_has_deck(self, obj):
        return bool(obj.pitch_deck)

    def _extra(self, obj):
        return obj.extra if isinstance(obj.extra, dict) else {}

    def get_answers(self, obj):
        return self._extra(obj).get('answers') or {}

    def get_current_step(self, obj):
        return int(self._extra(obj).get('current_step') or 1)

    def get_progress(self, obj):
        return step_progress(self.get_answers(obj))

    def _lead(self, obj):
        for m in obj.team.memberships.all():
            if m.left_at is None and m.role == 'lead':
                return m
        return None

    def get_lead_email(self, obj):
        m = self._lead(obj)
        return m.user.email if m else ''

    def get_lead_name(self, obj):
        m = self._lead(obj)
        return m.user.name if m else ''

    def get_score_count(self, obj):
        if hasattr(obj, '_score_count'):
            return obj._score_count
        return obj.scores.filter(submitted_at__isnull=False).count()

    def get_lead_phone(self, obj):
        m = self._lead(obj)
        return m.user.phone if m else ''

    def get_score_avg(self, obj):
        scores = [s for s in obj.scores.all() if s.submitted_at]
        if not scores:
            return None
        weights = obj.season.scoring_weights or {}
        return round(sum(s.weighted(weights) for s in scores) / len(scores), 3)

    def get_members(self, obj):
        rows = []
        for m in obj.team.memberships.all():
            if m.left_at:
                continue
            rows.append({
                'id': str(m.user_id),
                'name': m.user.name,
                'email': m.user.email,
                'phone': m.user.phone,
                'role': m.role,
            })
        return rows

    def get_assignments(self, obj):
        rows = []
        for a in obj.assignments.all():
            submitted = False
            try:
                submitted = bool(a.score.submitted_at)
            except Exception:
                submitted = False
            rows.append({
                'id': str(a.id),
                'reviewer_id': str(a.reviewer_id),
                'reviewer_name': a.reviewer.name,
                'reviewer_email': a.reviewer.email,
                'submitted': submitted,
                'due_at': a.due_at,
            })
        return rows

    def get_interviews(self, obj):
        return [
            {
                'id': str(i.id),
                'starts_at': i.starts_at,
                'location': i.location,
                'notes': i.notes,
                'cancelled_at': i.cancelled_at,
            }
            for i in obj.interviews.all()
        ]

    def get_allowed_to(self, obj):
        return list(TRANSITIONS.get(obj.status, {}).keys())

    def update(self, instance, validated_data):
        incoming = validated_data.pop('extra', None)
        if incoming is not None:
            extra = instance.extra if isinstance(instance.extra, dict) else {}
            answers = extra.get('answers') or {}
            if isinstance(incoming.get('answers'), dict):
                answers = {**answers, **incoming['answers']}
            if 'current_step' in incoming:
                extra['current_step'] = incoming['current_step']
            extra['answers'] = answers
            instance.extra = extra
            a = answers
            if a.get('problem'):
                instance.problem = a['problem']
            if a.get('solution'):
                instance.solution = a['solution']
            if a.get('why_us'):
                instance.why_us = a['why_us']
            if a.get('product_stage'):
                instance.stage = a['product_stage']
            demo = str(a.get('demo_url') or '').strip()
            if demo.startswith('http://') or demo.startswith('https://'):
                instance.demo_url = demo
            video = str(a.get('video_url') or '').strip()
            if video.startswith('http://') or video.startswith('https://'):
                instance.video_url = video
            if a.get('endorsement'):
                instance.faculty_endorsement_name = str(a['endorsement'])[:150]
            if a.get('track'):
                instance.track_id = a['track']
        return super().update(instance, validated_data)


class AdminFacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ('id', 'slug', 'name_uz', 'name_en', 'is_active', 'created_at')
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def create(self, validated):
        if not validated.get('slug'):
            validated['slug'] = unique_slug(Faculty, validated.get('name_uz') or 'fakultet')
        return super().create(validated)


class AdminNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = (
            'id', 'slug', 'title_uz', 'title_en', 'body_uz', 'body_en', 'cover',
            'youtube_url', 'published_at', 'is_published', 'created_at',
        )
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def create(self, validated):
        if not validated.get('slug'):
            validated['slug'] = unique_slug(News, validated.get('title_uz') or 'yangilik')
        return super().create(validated)


class AdminPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ('id', 'slug', 'name', 'logo', 'url', 'is_published', 'order', 'created_at')
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def create(self, validated):
        if not validated.get('slug'):
            validated['slug'] = unique_slug(Partner, validated.get('name') or 'hamkor')
        return super().create(validated)


class AdminStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffMember
        fields = (
            'id', 'slug', 'name', 'title_uz', 'title_en', 'photo', 'linkedin',
            'order', 'is_published', 'created_at',
        )
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def create(self, validated):
        if not validated.get('slug'):
            validated['slug'] = unique_slug(StaffMember, validated.get('name') or 'xodim')
        return super().create(validated)


class AdminInvestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investor
        fields = (
            'id', 'slug', 'name', 'title_uz', 'title_en', 'org', 'photo',
            'order', 'is_published', 'created_at',
        )
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def create(self, validated):
        if not validated.get('slug'):
            validated['slug'] = unique_slug(Investor, validated.get('name') or 'investor')
        return super().create(validated)


class AdminGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = (
            'id', 'slug', 'image', 'caption_uz', 'caption_en', 'placement',
            'show_in_gallery', 'is_published', 'order', 'created_at',
        )
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def create(self, validated):
        if not validated.get('slug'):
            validated['slug'] = unique_slug(GalleryImage, validated.get('caption_uz') or 'rasm')
        return super().create(validated)


class AdminPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ('id', 'slug', 'title_uz', 'title_en', 'body_uz', 'body_en', 'is_published', 'created_at')
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def create(self, validated):
        if not validated.get('slug'):
            validated['slug'] = unique_slug(Page, validated.get('title_uz') or 'sahifa')
        return super().create(validated)


class AdminPortfolioSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    season_slug = serializers.CharField(source='season.slug', read_only=True)
    track_slug = serializers.CharField(source='track.slug', read_only=True)

    class Meta:
        model = StartupPortfolio
        fields = (
            'id', 'team', 'team_name', 'season', 'season_slug', 'track', 'track_slug',
            'slug', 'is_published', 'summary_uz', 'summary_en', 'website',
            'traction_public', 'created_at',
        )

    def create(self, validated):
        if not validated.get('slug'):
            team = validated.get('team')
            validated['slug'] = unique_slug(StartupPortfolio, getattr(team, 'slug', None) or 'startup')
        return super().create(validated)


class InterviewOpsSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='application.team.name', read_only=True)
    application_status = serializers.CharField(source='application.status', read_only=True)

    class Meta:
        model = InterviewEvent
        fields = (
            'id', 'application', 'team_name', 'application_status', 'starts_at',
            'location', 'notes', 'cancelled_at', 'created_at',
        )
        read_only_fields = ('id', 'cancelled_at', 'created_at')
        extra_kwargs = {'application': {'required': False}}


class ReviewBoardSerializer(serializers.Serializer):
    # assembled in the view
    pass


FORM_STEPS = STEPS
