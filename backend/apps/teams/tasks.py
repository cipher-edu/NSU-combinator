from celery import shared_task
from django.utils import timezone
from .models import TeamInvite


@shared_task(name='teams.tasks.expire_team_invites')
def expire_team_invites():
    return TeamInvite.objects.filter(accepted_at__isnull=True, expires_at__lt=timezone.now()).count()
