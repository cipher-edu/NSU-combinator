import csv
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics, views
from rest_framework.response import Response

from core.exceptions import ApiError
from core.permissions import IsAdminOps, IsReviewer, has_capability
from apps.applications.models import Application
from apps.applications.serializers import ApplicationSerializer
from apps.applications.state_machine import transition_application
from apps.cohorts.models import Season
from .models import ReviewAssignment, ReviewScore, InterviewEvent
from .serializers import (
    ReviewAssignmentSerializer, ReviewScoreSerializer, InterviewEventSerializer,
)


class AdminApplicationListView(generics.ListAPIView):
    permission_classes = [IsReviewer]
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Application.objects.select_related('team', 'track', 'season', 'faculty').prefetch_related('events')
        if user.role not in ('admin', 'superadmin'):
            qs = qs.filter(assignments__reviewer=user)
        if has_capability(user, 'faculty') and user.role == 'applicant':
            qs = qs.filter(faculty=user.faculty)
        for key in ('status', 'season', 'track', 'faculty'):
            val = self.request.query_params.get(key)
            if val:
                if key == 'season':
                    qs = qs.filter(season__slug=val)
                elif key == 'track':
                    qs = qs.filter(track__slug=val)
                elif key == 'faculty':
                    qs = qs.filter(faculty__slug=val)
                else:
                    qs = qs.filter(status=val)
        return qs.distinct()


class AssignmentCreateView(views.APIView):
    permission_classes = [IsAdminOps]

    def post(self, request, pk):
        app = Application.objects.select_related('team').get(pk=pk)
        reviewer_id = request.data.get('reviewer_id')
        from apps.users.models import User
        reviewer = User.objects.get(pk=reviewer_id)
        if app.team.memberships.filter(user=reviewer, left_at__isnull=True).exists():
            raise ApiError('COI', 'Reviewer shu jamoa a’zosi')
        if not reviewer.has_capability('reviewer') and reviewer.role not in ('admin', 'superadmin'):
            raise ApiError('NOT_REVIEWER', 'Foydalanuvchida reviewer capability yo‘q')
        obj = ReviewAssignment.objects.create(
            application=app,
            reviewer=reviewer,
            assigned_by=request.user,
            due_at=request.data.get('due_at'),
        )
        return Response(ReviewAssignmentSerializer(obj, context={'request': request}).data, status=201)


class AssignmentDeleteView(views.APIView):
    permission_classes = [IsAdminOps]

    def delete(self, request, pk, aid):
        a = ReviewAssignment.objects.get(pk=aid, application_id=pk)
        if hasattr(a, 'score') and a.score.submitted_at:
            raise ApiError('SCORE_LOCKED', 'Submitted ballni o‘chirib bo‘lmaydi', status_code=409)
        a.delete()
        return Response({'ok': True})


class ScoreCreateView(views.APIView):
    permission_classes = [IsReviewer]

    def post(self, request, pk):
        assignment = ReviewAssignment.objects.filter(
            application_id=pk, reviewer=request.user
        ).first()
        if not assignment:
            raise ApiError('NOT_ASSIGNED', 'Sizga biriktirilmagan', status_code=403)
        if ReviewScore.objects.filter(assignment=assignment).exists():
            raise ApiError('EXISTS', 'Draft allaqachon bor', status_code=409)
        score = ReviewScore.objects.create(
            assignment=assignment,
            application_id=pk,
            reviewer=request.user,
            team_score=request.data.get('team_score'),
            problem_score=request.data.get('problem_score'),
            feasibility_score=request.data.get('feasibility_score'),
            university_fit_score=request.data.get('university_fit_score'),
            traction_score=request.data.get('traction_score'),
            comment=request.data.get('comment') or '',
        )
        return Response(ReviewScoreSerializer(score).data, status=201)


class ScorePatchView(views.APIView):
    permission_classes = [IsReviewer]

    def patch(self, request, pk, sid):
        score = ReviewScore.objects.get(pk=sid, application_id=pk, reviewer=request.user)
        if score.submitted_at:
            raise ApiError('SCORE_LOCKED', 'Ball qulflangan', status_code=409)
        for f in ('team_score', 'problem_score', 'feasibility_score', 'university_fit_score', 'traction_score', 'comment'):
            if f in request.data:
                setattr(score, f, request.data.get(f))
        score.save()
        return Response(ReviewScoreSerializer(score).data)


class ScoreSubmitView(views.APIView):
    permission_classes = [IsReviewer]

    def post(self, request, pk, sid):
        score = ReviewScore.objects.get(pk=sid, application_id=pk, reviewer=request.user)
        if score.submitted_at:
            raise ApiError('SCORE_LOCKED', 'Allaqachon submitted', status_code=409)
        score.submitted_at = timezone.now()
        score.save(update_fields=['submitted_at'])
        return Response(ReviewScoreSerializer(score).data)


class InterviewListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOps]
    serializer_class = InterviewEventSerializer

    def get_queryset(self):
        return InterviewEvent.objects.filter(application_id=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(application_id=self.kwargs['pk'], created_by=self.request.user)


class BulkShortlistView(views.APIView):
    permission_classes = [IsAdminOps]

    def post(self, request, id):
        season = Season.objects.get(pk=id)
        dry = bool(request.data.get('dry_run'))
        mapping = {
            'interview_invited': request.data.get('interview_ids') or [],
            'waitlisted': request.data.get('waitlist_ids') or [],
            'rejected': request.data.get('reject_ids') or [],
        }
        if request.data.get('accept_ids'):
            raise ApiError('NO_BULK_ACCEPT', 'Bulk accepted taqiqlangan — per-app transition ishlating')
        applied, failed = [], []
        for target, ids in mapping.items():
            for app_id in ids:
                try:
                    app = Application.objects.get(pk=app_id, season=season)
                    if dry:
                        from apps.applications.state_machine import TRANSITIONS
                        allowed = TRANSITIONS.get(app.status, {}).get(target)
                        if allowed is None and target not in TRANSITIONS.get(app.status, {}):
                            failed.append({'id': str(app_id), 'code': 'ILLEGAL_TRANSITION'})
                        elif allowed is not None and season.status not in allowed:
                            failed.append({'id': str(app_id), 'code': 'WRONG_SEASON'})
                        else:
                            applied.append({'id': str(app_id), 'to': target})
                    else:
                        transition_application(app, target, actor=request.user)
                        applied.append({'id': str(app_id), 'to': target})
                except ApiError as e:
                    failed.append({'id': str(app_id), 'code': e.default_code})
                except Application.DoesNotExist:
                    failed.append({'id': str(app_id), 'code': 'NOT_FOUND'})
        return Response({'applied': applied, 'failed': failed, 'dry_run': dry})


class ExportCsvView(views.APIView):
    permission_classes = [IsAdminOps]

    def get(self, request):
        qs = Application.objects.select_related('team', 'track', 'season', 'faculty').exclude(status='draft')
        pii = request.query_params.get('pii') == '1' and request.user.role == 'superadmin'
        resp = HttpResponse(content_type='text/csv')
        resp['Content-Disposition'] = 'attachment; filename="applications.csv"'
        fields = [
            'team_name', 'track_slug', 'status', 'weighted_average', 'score_count',
            'lead_name', 'lead_email', 'faculty_slug', 'submitted_at',
        ]
        if pii:
            fields += ['lead_phone', 'member_emails']
        w = csv.DictWriter(resp, fieldnames=fields)
        w.writeheader()
        for app in qs:
            scores = [s for s in app.scores.all() if s.submitted_at]
            weights = app.season.scoring_weights or {}
            avg = round(sum(s.weighted(weights) for s in scores) / len(scores), 3) if scores else ''
            lead = app.team.memberships.filter(role='lead', left_at__isnull=True).select_related('user').first()
            row = {
                'team_name': app.team.name,
                'track_slug': app.track.slug,
                'status': app.status,
                'weighted_average': avg,
                'score_count': len(scores),
                'lead_name': lead.user.name if lead else '',
                'lead_email': lead.user.email if lead else '',
                'faculty_slug': app.faculty.slug if app.faculty else '',
                'submitted_at': app.submitted_at,
            }
            if pii and lead:
                row['lead_phone'] = lead.user.phone
                row['member_emails'] = ','.join(
                    app.team.active_members().select_related('user').values_list('user__email', flat=True)
                )
            w.writerow(row)
        return resp
