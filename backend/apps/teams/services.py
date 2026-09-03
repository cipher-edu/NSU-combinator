from django.conf import settings
from django.db import transaction
from django.utils import timezone
from core.exceptions import ApiError
from apps.cohorts.models import Season
from .models import Team, TeamMembership


def current_season_for_apply():
    season = Season.objects.filter(is_current=True).first()
    if not season:
        raise ApiError('NO_CURRENT_SEASON', 'Joriy mavsum yo‘q', status_code=404)
    if season.status not in (Season.Status.DRAFT, Season.Status.APPLICATIONS_OPEN):
        raise ApiError('SEASON_NOT_OPEN', 'Hozir jamoa yaratib bo‘lmaydi', status_code=403)
    return season


def recompute_team_status(team: Team, season=None):
    season = season or team.season
    if team.status == Team.Status.DISBANDED:
        return team
    app = team.applications.filter(season=season).order_by('-created_at').first()
    if season.status == Season.Status.CLOSED and app and app.status == 'accepted':
        team.status = Team.Status.ALUMNI
    elif not app or app.status == 'draft':
        team.status = Team.Status.FORMING
    elif app.status == 'accepted':
        team.status = Team.Status.ACCEPTED
    elif app.status in ('withdrawn', 'rejected'):
        team.status = Team.Status.FORMING
    else:
        team.status = Team.Status.ACTIVE
    team.save(update_fields=['status', 'updated_at'])
    return team


def assert_lead(team, user):
    if not team.memberships.filter(user=user, role='lead', left_at__isnull=True).exists():
        raise ApiError('NOT_LEAD', 'Faqat jamoa rahbari', status_code=403)


def assert_member(team, user):
    if not team.memberships.filter(user=user, left_at__isnull=True).exists():
        raise ApiError('NOT_MEMBER', 'Jamoa a’zosi emassiz', status_code=403)


@transaction.atomic
def create_team(user, name, **extra):
    user = type(user).objects.select_for_update().get(pk=user.pk)
    if not user.telegram_linked:
        raise ApiError('TELEGRAM_REQUIRED', 'Avval Telegram botni ulang', status_code=403)
    if not user.profile_complete:
        raise ApiError('PROFILE_INCOMPLETE', 'Avval profilni to‘ldiring', status_code=403)
    season = current_season_for_apply()
    if TeamMembership.objects.filter(user=user, season=season, left_at__isnull=True).exists():
        raise ApiError('ALREADY_ON_TEAM_THIS_SEASON', 'Bu mavsumda allaqachon jamoadasiz')
    team = Team.objects.create(season=season, name=name, created_by=user, **extra)
    TeamMembership.objects.create(team=team, user=user, season=season, role='lead')
    return team


@transaction.atomic
def accept_invite(user, invite):
    user = type(user).objects.select_for_update().get(pk=user.pk)
    if user.email.lower() != invite.email.lower():
        raise ApiError('INVITE_EMAIL_MISMATCH', 'Invite boshqa emailga berilgan', status_code=403)
    if invite.accepted_at:
        raise ApiError('INVITE_ALREADY_ACCEPTED', 'Invite allaqachon qabul qilingan', status_code=409)
    if invite.expires_at < timezone.now():
        raise ApiError('INVITE_EXPIRED', 'Invite muddati o‘tgan', status_code=410)
    team = invite.team
    if team.status == Team.Status.DISBANDED:
        raise ApiError('TEAM_DISBANDED', 'Jamoa tarqatilgan', status_code=409)
    if team.active_members().count() >= settings.MAX_TEAM_SIZE:
        raise ApiError('TEAM_FULL', f'Maksimal {settings.MAX_TEAM_SIZE} a’zo')
    if TeamMembership.objects.filter(user=user, season=team.season, left_at__isnull=True).exists():
        raise ApiError('ALREADY_ON_TEAM_THIS_SEASON', 'Bu mavsumda allaqachon jamoadasiz')
    TeamMembership.objects.create(
        team=team, user=user, season=team.season, role=TeamMembership.Role.MEMBER
    )
    invite.accepted_at = timezone.now()
    invite.save(update_fields=['accepted_at'])
    return team


@transaction.atomic
def disband_team(team, user):
    assert_lead(team, user)
    app = team.applications.filter(season=team.season).first()
    if app and app.status == 'accepted':
        raise ApiError('TEAM_ACCEPTED', 'Qabul qilingan jamoani tarqatib bo‘lmaydi', status_code=409)
    if app and app.status not in ('rejected', 'withdrawn'):
        from apps.applications.state_machine import transition_application
        transition_application(app, 'withdrawn', actor=user)
    team.status = Team.Status.DISBANDED
    team.save(update_fields=['status', 'updated_at'])
    team.active_members().update(left_at=timezone.now())
    return team
