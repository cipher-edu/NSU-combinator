from django.conf import settings
from django.db import models
from core.models import BaseModel


class Notification(BaseModel):
    class Channel(models.TextChoices):
        EMAIL = 'email'
        TELEGRAM = 'telegram'
        INAPP = 'inapp'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE, related_name='notifications'
    )
    email = models.EmailField(blank=True)
    channel = models.CharField(max_length=10, choices=Channel.choices)
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    error = models.TextField(blank=True)
    broadcast = models.ForeignKey(
        'Broadcast', null=True, blank=True, on_delete=models.SET_NULL, related_name='items'
    )

    class Meta:
        db_table = 'notifications'


class Broadcast(BaseModel):
    class Audience(models.TextChoices):
        ALL_LINKED = 'all_linked', 'Telegram ulanganlar'
        APPLICANTS = 'applicants', 'Arizachilar'
        ACCEPTED = 'accepted', 'Qabul qilingan jamoalar'
        STAFF = 'staff', 'Admin/reviewer'

    title = models.CharField(max_length=200)
    body = models.TextField()
    audience = models.CharField(max_length=20, choices=Audience.choices, default=Audience.ALL_LINKED)
    channels = models.JSONField(default=list)  # ['telegram'] or ['telegram','email']
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='broadcasts'
    )
    sent_at = models.DateTimeField(null=True, blank=True)
    total = models.PositiveIntegerField(default=0)
    sent_ok = models.PositiveIntegerField(default=0)
    sent_fail = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'broadcasts'
        ordering = ['-created_at']
