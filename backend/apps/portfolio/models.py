from django.db import models
from core.models import BaseModel


class StartupPortfolio(BaseModel):
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE, related_name='portfolio_entries')
    season = models.ForeignKey('cohorts.Season', on_delete=models.PROTECT, related_name='portfolio')
    track = models.ForeignKey('cohorts.Track', on_delete=models.PROTECT)
    slug = models.SlugField(unique=True)
    is_published = models.BooleanField(default=False)
    summary_uz = models.TextField(blank=True)
    summary_en = models.TextField(blank=True)
    website = models.URLField(blank=True)
    traction_public = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'startup_portfolio'
        constraints = [
            models.UniqueConstraint(fields=['team', 'season'], name='uq_portfolio_team_season'),
        ]
        indexes = [
            models.Index(fields=['season', 'is_published']),
            models.Index(fields=['track', 'is_published']),
        ]

    def __str__(self):
        return self.slug
