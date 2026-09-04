from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, views
from rest_framework.response import Response

from core.exceptions import ApiError
from apps.notifications.tasks import send_simple_email
from .models import Team, TeamInvite, TeamMembership
from .serializers import TeamSerializer
from .services import (
    accept_invite, assert_lead, assert_member, create_team, disband_team,
)


class TeamMineView(generics.ListAPIView):
    serializer_class = TeamSerializer

    def get_queryset(self):
        return Team.objects.filter(
            memberships__user=self.request.user,
            memberships__left_at__isnull=True,
        ).distinct()


class TeamCreateView(generics.CreateAPIView):
    serializer_class = TeamSerializer

    def create(self, request, *args, **kwargs):
        name = (request.data.get('name') or '').strip()
        if not name:
            raise ApiError('VALIDATION_ERROR', 'Jamoa nomi majburiy')
        team = create_team(
            request.user,
            name,
            one_liner_uz=request.data.get('one_liner_uz') or '',
            one_liner_en=request.data.get('one_liner_en') or '',
        )
        return Response(TeamSerializer(team).data, status=201)


class TeamDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()

    def get_object(self):
        team = super().get_object()
        assert_member(team, self.request.user)
        return team

    def perform_update(self, serializer):
        assert_lead(self.get_object(), self.request.user)
        serializer.save()


class TeamDisbandView(views.APIView):
    def post(self, request, pk):
        team = Team.objects.get(pk=pk)
        disband_team(team, request.user)
        return Response(TeamSerializer(team).data)


class TeamInviteView(views.APIView):
    def post(self, request, pk):
        team = Team.objects.get(pk=pk)
        assert_lead(team, request.user)
        email = (request.data.get('email') or '').strip().lower()
        if not email:
            raise ApiError('VALIDATION_ERROR', 'Email majburiy')
        if team.active_members().count() >= settings.MAX_TEAM_SIZE:
            raise ApiError('TEAM_FULL', 'Jamoa to‘la')
        invite, raw = TeamInvite.issue(team, email, request.user)
        send_simple_email.delay(
            email,
            'NSU startup-club — jamoaga taklif',
            f'Sizni «{team.name}» jamoasiga taklif qilishdi.\nToken: {raw}\n'
            f'Qabul: POST /api/v1/teams/invites/accept/ {{"token": "..."}}',
        )
        data = {'id': str(invite.id), 'email': invite.email, 'expires_at': invite.expires_at}
        if settings.DEBUG:
            data['debug_token'] = raw
        return Response(data, status=201)


class TeamInviteAcceptView(views.APIView):
    def post(self, request):
        token = request.data.get('token') or ''
        invite = TeamInvite.objects.filter(token_hash=TeamInvite.hash_token(token)).first()
        if not invite:
            raise ApiError('INVITE_NOT_FOUND', 'Invite topilmadi', status_code=404)
        team = accept_invite(request.user, invite)
        return Response(TeamSerializer(team).data)


class TeamTransferLeadView(views.APIView):
    def post(self, request, pk):
        team = Team.objects.get(pk=pk)
        assert_lead(team, request.user)
        user_id = request.data.get('user_id')
        target = team.memberships.filter(user_id=user_id, left_at__isnull=True).first()
        if not target:
            raise ApiError('NOT_MEMBER', 'Foydalanuvchi jamoada emas')
        with transaction.atomic():
            team.memberships.filter(role='lead', left_at__isnull=True).update(role='member')
            target.role = 'lead'
            target.save(update_fields=['role'])
        return Response(TeamSerializer(team).data)


class TeamRemoveMemberView(views.APIView):
    def post(self, request, pk, user_id):
        team = Team.objects.get(pk=pk)
        assert_lead(team, request.user)
        m = team.memberships.filter(user_id=user_id, left_at__isnull=True).first()
        if not m:
            raise ApiError('NOT_MEMBER', 'A’zo topilmadi', status_code=404)
        if m.role == 'lead' and team.active_members().filter(role='lead').count() == 1:
            raise ApiError('SOLE_LEAD', 'Yolg‘iz rahbarni olib tashlab bo‘lmaydi')
        m.left_at = timezone.now()
        m.save(update_fields=['left_at'])
        return Response(TeamSerializer(team).data)


class TeamLeaveView(views.APIView):
    def post(self, request, pk):
        team = Team.objects.get(pk=pk)
        m = team.memberships.filter(user=request.user, left_at__isnull=True).first()
        if not m:
            raise ApiError('NOT_MEMBER', 'Jamoada emassiz', status_code=404)
        if m.role == 'lead':
            raise ApiError('LEAD_MUST_TRANSFER', 'Avval rahbarlikni o‘tkazing')
        m.left_at = timezone.now()
        m.save(update_fields=['left_at'])
        return Response({'ok': True})
