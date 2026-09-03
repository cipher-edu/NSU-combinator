from celery import shared_task
from django.utils import timezone
from .models import Season
from .state_machine import transition_season


@shared_task(name='cohorts.tasks.close_season_if_deadline')
def close_season_if_deadline():
    now = timezone.now()
    qs = Season.objects.filter(
        status=Season.Status.APPLICATIONS_OPEN,
        apply_closes_at__isnull=False,
        apply_closes_at__lte=now,
    )
    n = 0
    for season in qs:
        transition_season(season, 'applications_closed', actor=None, note='deadline')
        n += 1
    return n
