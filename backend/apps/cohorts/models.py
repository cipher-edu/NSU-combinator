from django.conf import settings
from django.db import models
from core.models import BaseModel

DEFAULT_SCORING_WEIGHTS = {
    'team': 0.30,
    'problem': 0.25,
    'feasibility': 0.20,
    'university_fit': 0.15,
    'traction': 0.10,
}


class Season(BaseModel):
    class Status(models.TextChoices):
        DRAFT = 'draft'
        APPLICATIONS_OPEN = 'applications_open'
        APPLICATIONS_CLOSED = 'applications_closed'
        INTERVIEW = 'interview'
        SELECTION_FINALIZED = 'selection_finalized'
        PROGRAM_RUNNING = 'program_running'
        DEMO_DAY = 'demo_day'
        CLOSED = 'closed'
        CANCELLED = 'cancelled'

    slug = models.SlugField(unique=True)
    name_uz = models.CharField(max_length=120)
    name_en = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.DRAFT)
    is_current = models.BooleanField(default=False)
    is_alumni_published = models.BooleanField(default=False)
    program_weeks = models.PositiveSmallIntegerField(default=10)
    min_scores = models.PositiveSmallIntegerField(default=2)
    scoring_weights = models.JSONField(default=dict, blank=True)
    apply_opens_at = models.DateTimeField(null=True, blank=True)
    apply_closes_at = models.DateTimeField(null=True, blank=True)
    program_starts_at = models.DateTimeField(null=True, blank=True)
    demo_day_at = models.DateTimeField(null=True, blank=True)
    stats_override = models.JSONField(
        default=dict,
        blank=True,
        help_text='Faqat ushbu NavDU mavsumi raqamlari. Tashqi akselerator statistikasi taqiqlangan.',
    )
    curriculum = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = 'seasons'
        verbose_name = 'Mavsum'
        verbose_name_plural = 'Mavsumlar'
        constraints = [
            models.UniqueConstraint(
                fields=['is_current'],
                condition=models.Q(is_current=True),
                name='uq_season_single_current',
            ),
            models.CheckConstraint(
                check=models.Q(min_scores__gte=1) & models.Q(min_scores__lte=10),
                name='ck_season_min_scores_range',
            ),
        ]

    def __str__(self):
        return self.name_uz

    def save(self, *args, **kwargs):
        if not self.scoring_weights:
            self.scoring_weights = DEFAULT_SCORING_WEIGHTS.copy()
        if self.status == self.Status.CANCELLED:
            self.is_current = False
        super().save(*args, **kwargs)


class Track(BaseModel):
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='tracks')
    slug = models.SlugField()
    name_uz = models.CharField(max_length=120)
    name_en = models.CharField(max_length=120, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'tracks'
        constraints = [
            models.UniqueConstraint(fields=['season', 'slug'], name='uq_track_season_slug'),
        ]

    def __str__(self):
        return f'{self.name_uz} ({self.season.slug})'


class SeasonEvent(BaseModel):
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='events')
    from_status = models.CharField(max_length=32)
    to_status = models.CharField(max_length=32)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    note = models.TextField(blank=True)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'season_events'
        ordering = ['-created_at']
