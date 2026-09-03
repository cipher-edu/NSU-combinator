from django.conf import settings
from django.db import models
from core.models import BaseModel


class Application(BaseModel):
    class Status(models.TextChoices):
        DRAFT = 'draft'
        SUBMITTED = 'submitted'
        SCREENING = 'screening'
        INTERVIEW_INVITED = 'interview_invited'
        INTERVIEWED = 'interviewed'
        ACCEPTED = 'accepted'
        WAITLISTED = 'waitlisted'
        REJECTED = 'rejected'
        WITHDRAWN = 'withdrawn'

    class Stage(models.TextChoices):
        IDEA = 'idea', 'G‘oya'
        MVP = 'mvp', 'MVP'
        TRACTION = 'traction', 'Traction'
        REVENUE = 'revenue', 'Daromad'

    season = models.ForeignKey('cohorts.Season', on_delete=models.PROTECT, related_name='applications')
    team = models.ForeignKey('teams.Team', on_delete=models.PROTECT, related_name='applications')
    track = models.ForeignKey('cohorts.Track', on_delete=models.PROTECT, related_name='applications')
    faculty = models.ForeignKey(
        'cms.Faculty', null=True, blank=True, on_delete=models.SET_NULL, related_name='applications'
    )
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.DRAFT)
    submitted_at = models.DateTimeField(null=True, blank=True)
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name='submitted_apps'
    )
    problem = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    stage = models.CharField(max_length=32, choices=Stage.choices, blank=True)
    why_us = models.TextField(blank=True)
    faculty_endorsement_name = models.CharField(max_length=150, blank=True)
    demo_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    pitch_deck = models.FileField(upload_to='private/applications/decks/%Y/%m/', null=True, blank=True)
    extra = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'applications'
        constraints = [
            models.UniqueConstraint(fields=['season', 'team'], name='uq_app_season_team'),
        ]
        indexes = [
            models.Index(fields=['season', 'status']),
            models.Index(fields=['track', 'status']),
            models.Index(fields=['faculty', 'status']),
            models.Index(fields=['submitted_at']),
        ]

    def __str__(self):
        return f'{self.team.name} / {self.season.slug} [{self.status}]'


class ApplicationEvent(BaseModel):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='events')
    from_status = models.CharField(max_length=24)
    to_status = models.CharField(max_length=24)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    note = models.TextField(blank=True)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'application_events'
        ordering = ['-created_at']
