from django.utils import timezone
from core.exceptions import ApiError
from .models import Season, SeasonEvent

TRANSITIONS = {
    'draft': ['applications_open', 'cancelled'],
    'applications_open': ['applications_closed', 'cancelled'],
    'applications_closed': ['applications_open', 'interview', 'selection_finalized', 'cancelled'],
    'interview': ['selection_finalized', 'cancelled'],
    'selection_finalized': ['program_running', 'cancelled'],
    'program_running': ['demo_day', 'closed', 'cancelled'],
    'demo_day': ['closed', 'cancelled'],
    'closed': [],
    'cancelled': [],
}

ACTOR_RULES = {
    'applications_open': ['admin', 'superadmin'],
    'applications_closed': ['admin', 'superadmin', 'system'],
    'interview': ['admin', 'superadmin'],
    'selection_finalized': ['admin', 'superadmin'],
    'program_running': ['admin', 'superadmin'],
    'demo_day': ['admin', 'superadmin'],
    'closed': ['admin', 'superadmin'],
    'cancelled': ['superadmin'],
}


def transition_season(season: Season, to_status: str, actor=None, note=''):
    actor_role = 'system' if actor is None else actor.role
    allowed = TRANSITIONS.get(season.status, [])
    if to_status not in allowed:
        raise ApiError('ILLEGAL_TRANSITION', f'{season.status} → {to_status} ruxsat etilmagan')
    if actor_role not in ACTOR_RULES.get(to_status, []):
        raise ApiError('FORBIDDEN_ACTOR', 'Bu o‘tish uchun ruxsat yo‘q', status_code=403)

    if to_status == 'selection_finalized' and season.status == 'applications_closed':
        from apps.applications.models import Application
        if Application.objects.filter(season=season, status='interview_invited').exists():
            raise ApiError('APPS_STILL_IN_INTERVIEW', 'Avval interview_invited arizalarni yoping', status_code=409)

    from_status = season.status
    season.status = to_status
    now = timezone.now()
    if to_status == 'applications_open' and not season.apply_opens_at:
        season.apply_opens_at = now
    if to_status == 'applications_closed' and not season.apply_closes_at:
        season.apply_closes_at = now
    if to_status == 'cancelled':
        season.is_current = False
    season.save()
    SeasonEvent.objects.create(
        season=season,
        from_status=from_status,
        to_status=to_status,
        actor=actor,
        note=note,
    )
    return season
