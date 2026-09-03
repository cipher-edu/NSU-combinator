from django.http import FileResponse
from rest_framework import generics, permissions, views
from rest_framework.response import Response

from core.exceptions import ApiError
from core.permissions import IsAdminOps, has_capability
from apps.cohorts.models import Season
from apps.teams.models import Team
from apps.teams.services import assert_lead, assert_member
from .models import Application
from .schema import STEPS
from .serializers import ApplicationSerializer
from .state_machine import transition_application


def _user_teams(user):
    return Team.objects.filter(memberships__user=user, memberships__left_at__isnull=True)


class ApplicationFormSchemaView(views.APIView):
    def get(self, request):
        return Response({'steps': STEPS})


class ApplicationMineView(generics.ListAPIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        qs = Application.objects.filter(team__in=_user_teams(self.request.user))
        season = self.request.query_params.get('season')
        if season:
            qs = qs.filter(season__slug=season)
        return qs.select_related('team', 'track', 'season').prefetch_related('events')


class ApplicationCreateView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer

    def create(self, request, *args, **kwargs):
        team = Team.objects.get(pk=request.data.get('team'))
        assert_lead(team, request.user)
        season = Season.objects.filter(is_current=True).first()
        if not season or season.status != Season.Status.APPLICATIONS_OPEN:
            raise ApiError('SEASON_NOT_OPEN', 'Ariza oynasi yopiq', status_code=403)
        if team.season_id != season.id:
            raise ApiError('WRONG_SEASON', 'Jamoa boshqa mavsumga tegishli')
        extra = request.data.get('extra') if isinstance(request.data.get('extra'), dict) else {}
        extra.setdefault('current_step', 1)
        extra.setdefault('answers', {})
        track_id = request.data.get('track') or extra.get('answers', {}).get('track')
        if not track_id:
            first = season.tracks.order_by('id').first()
            track_id = first.id if first else None
        if not track_id:
            raise ApiError('VALIDATION_ERROR', 'Yo‘nalish tanlang')
        app = Application.objects.create(
            season=season,
            team=team,
            track_id=track_id,
            problem=request.data.get('problem') or '',
            solution=request.data.get('solution') or '',
            stage=request.data.get('stage') or '',
            why_us=request.data.get('why_us') or '',
            extra=extra,
        )
        return Response(ApplicationSerializer(app).data, status=201)


class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ApplicationSerializer
    queryset = Application.objects.select_related('team', 'track', 'season').prefetch_related('events')

    def get_object(self):
        obj = super().get_object()
        assert_member(obj.team, self.request.user)
        return obj

    def perform_update(self, serializer):
        obj = self.get_object()
        assert_lead(obj.team, self.request.user)
        if obj.status != Application.Status.DRAFT:
            raise ApiError('NOT_DRAFT', 'Faqat draft tahrirlanadi')
        serializer.save()


class ApplicationSubmitView(views.APIView):
    def post(self, request, pk):
        app = Application.objects.select_related('team', 'season').get(pk=pk)
        transition_application(app, 'submitted', actor=request.user)
        return Response(ApplicationSerializer(app).data)


class ApplicationWithdrawView(views.APIView):
    def post(self, request, pk):
        app = Application.objects.select_related('team', 'season').get(pk=pk)
        transition_application(app, 'withdrawn', actor=request.user)
        return Response(ApplicationSerializer(app).data)


class ApplicationDeckView(views.APIView):
    def post(self, request, pk):
        app = Application.objects.select_related('team').get(pk=pk)
        assert_lead(app.team, request.user)
        f = request.FILES.get('file')
        if not f:
            raise ApiError('VALIDATION_ERROR', 'file majburiy')
        if f.size > 20 * 1024 * 1024:
            raise ApiError('FILE_TOO_LARGE', 'Maksimal 20 MB')
        app.pitch_deck = f
        app.save(update_fields=['pitch_deck'])
        return Response({'ok': True, 'name': f.name})

    def get(self, request, pk):
        app = Application.objects.select_related('team').get(pk=pk)
        user = request.user
        ok = (
            app.team.memberships.filter(user=user, left_at__isnull=True).exists()
            or user.role in ('admin', 'superadmin')
            or app.assignments.filter(reviewer=user).exists()
        )
        if not ok:
            raise ApiError('FORBIDDEN', 'Faylga ruxsat yo‘q', status_code=403)
        if not app.pitch_deck:
            raise ApiError('NO_DECK', 'Deck yo‘q', status_code=404)
        return FileResponse(app.pitch_deck.open('rb'), as_attachment=True, filename=app.pitch_deck.name.split('/')[-1])


class AdminApplicationTransitionView(views.APIView):
    permission_classes = [IsAdminOps]

    def post(self, request, pk):
        app = Application.objects.select_related('team', 'season').get(pk=pk)
        to_status = request.data.get('to')
        force = bool(request.data.get('force'))
        note = request.data.get('note') or ''
        transition_application(app, to_status, actor=request.user, force=force, note=note)
        return Response(ApplicationSerializer(app).data)
