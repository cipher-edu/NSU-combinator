from django.utils import timezone
from core.exceptions import ApiError
from apps.cohorts.models import Season
from apps.teams.services import recompute_team_status
from .models import Application, ApplicationEvent

# from -> to -> allowed season statuses (None = any)
TRANSITIONS = {
    'draft': {
        'submitted': ['applications_open'],
        'withdrawn': None,
    },
    'submitted': {
        'screening': ['applications_open', 'applications_closed', 'interview', 'selection_finalized'],
        'interview_invited': ['applications_closed', 'interview'],
        'waitlisted': ['selection_finalized'],
        'accepted': ['selection_finalized'],
        'rejected': None,
        'withdrawn': None,
    },
    'screening': {
        'interview_invited': ['applications_closed', 'interview'],
        'waitlisted': ['interview', 'applications_closed', 'selection_finalized'],
        'rejected': ['interview', 'applications_closed', 'selection_finalized'],
        'accepted': ['selection_finalized'],
        'withdrawn': None,
    },
    'interview_invited': {
        'interviewed': ['interview', 'selection_finalized'],
        'rejected': None,
        'withdrawn': None,
        'waitlisted': ['interview', 'selection_finalized'],
    },
    'interviewed': {
        'accepted': ['interview', 'selection_finalized'],
        'waitlisted': ['interview', 'selection_finalized'],
        'rejected': ['interview', 'selection_finalized'],
        'withdrawn': None,
    },
    'waitlisted': {
        'accepted': ['interview', 'selection_finalized'],
        'rejected': ['interview', 'selection_finalized'],
        'withdrawn': None,
    },
}

QUORUM_TARGETS = {'accepted'}
LEAD_TARGETS = {'submitted', 'withdrawn'}
ADMIN_ONLY = {
    'screening', 'interview_invited', 'interviewed', 'accepted', 'waitlisted', 'rejected',
}


def _has_quorum(application: Application) -> bool:
    from apps.reviews.models import ReviewScore
    n = ReviewScore.objects.filter(application=application, submitted_at__isnull=False).count()
    return n >= application.season.min_scores


def transition_application(application: Application, to_status: str, actor=None, force=False, note=''):
    from_status = application.status
    allowed_map = TRANSITIONS.get(from_status, {})
    if to_status not in allowed_map:
        raise ApiError('ILLEGAL_TRANSITION', f'{from_status} → {to_status} ruxsat etilmagan')

    season_ok = allowed_map[to_status]
    if season_ok is not None and application.season.status not in season_ok:
        raise ApiError('WRONG_SEASON', f'Mavsum holati {application.season.status} bu o‘tishga mos emas')

    role = getattr(actor, 'role', None)
    is_admin = role in ('admin', 'superadmin')
    is_lead = False
    if actor:
        is_lead = application.team.memberships.filter(
            user=actor, role='lead', left_at__isnull=True
        ).exists()

    if to_status in LEAD_TARGETS and not is_admin and not is_lead:
        raise ApiError('NOT_LEAD', 'Faqat jamoa rahbari', status_code=403)
    if to_status in ADMIN_ONLY and not is_admin:
        raise ApiError('FORBIDDEN_ACTOR', 'Faqat admin', status_code=403)
    if from_status in ('accepted', 'rejected') and to_status == 'withdrawn':
        raise ApiError('ILLEGAL_TRANSITION', 'Terminal holatdan chiqib bo‘lmaydi')

    if to_status in QUORUM_TARGETS and not force:
        if not _has_quorum(application):
            if role == 'superadmin' and force:
                pass
            else:
                raise ApiError('SCORES_REQUIRED', 'Yetarli submitted ball yo‘q (min_scores)')
    if to_status in QUORUM_TARGETS and force and role != 'superadmin':
        raise ApiError('FORBIDDEN_ACTOR', 'force faqat Superadmin', status_code=403)

    if to_status == 'submitted':
        from .schema import missing_required
        extra = application.extra if isinstance(application.extra, dict) else {}
        miss = missing_required(extra.get('answers') or {})
        if miss:
            raise ApiError('INCOMPLETE', f'To‘ldirilmagan majburiy savollar: {", ".join(miss)}')
        if not application.problem or not application.solution:
            raise ApiError('INCOMPLETE', 'G‘oya bosqichida muammo va yechim majburiy')
        if not application.team.one_liner_uz:
            raise ApiError('INCOMPLETE', 'Jamoa one_liner_uz majburiy')
        if application.team.active_members().count() < 1:
            raise ApiError('INCOMPLETE', 'Kamida 1 a’zo kerak')
        application.submitted_at = timezone.now()
        application.submitted_by = actor
        lead = application.team.memberships.filter(role='lead', left_at__isnull=True).select_related('user').first()
        if lead and lead.user.faculty_id:
            application.faculty_id = lead.user.faculty_id

    application.status = to_status
    application.save()
    ApplicationEvent.objects.create(
        application=application,
        from_status=from_status,
        to_status=to_status,
        actor=actor,
        note=note,
        payload={'force': bool(force)},
    )
    recompute_team_status(application.team, application.season)
    if to_status == 'submitted':
        _notify_status(application, 'Ariza topshirildi', f'{application.team.name} arizasi qabul qilindi.')
    elif to_status in ('interview_invited', 'accepted', 'waitlisted', 'rejected'):
        labels = {
            'interview_invited': 'Suhbatga chaqirildingiz',
            'accepted': 'Arizangiz qabul qilindi',
            'waitlisted': 'Kutish ro‘yxatidasiz',
            'rejected': 'Bu mavsumda o‘tmadingiz',
        }
        _notify_status(application, labels[to_status], f'{application.team.name}: {labels[to_status]}.')
    return application


def _notify_status(application: Application, title: str, body: str):
    try:
        from apps.notifications.models import Notification
        from apps.notifications.tasks import deliver_notification

        members = application.team.memberships.filter(left_at__isnull=True).select_related('user')
        for m in members:
            u = m.user
            n = Notification.objects.create(
                user=u, email=u.email, channel=Notification.Channel.EMAIL, title=title, body=body,
            )
            deliver_notification.delay(str(n.id))
            if u.telegram_user_id:
                t = Notification.objects.create(
                    user=u, channel=Notification.Channel.TELEGRAM, title=title, body=body,
                )
                deliver_notification.delay(str(t.id))
    except Exception:
        pass
