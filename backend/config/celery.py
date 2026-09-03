import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

app = Celery('nsucombinator')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.broker_connection_retry_on_startup = True
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'close-season-if-deadline': {
        'task': 'cohorts.tasks.close_season_if_deadline',
        'schedule': 300,
    },
    'expire-team-invites': {
        'task': 'teams.tasks.expire_team_invites',
        'schedule': 3600,
    },
}
