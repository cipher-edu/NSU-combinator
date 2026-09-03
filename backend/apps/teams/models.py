import hashlib
import secrets
from datetime import timedelta
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from core.models import BaseModel


class Team(BaseModel):
    class Status(models.TextChoices):
        FORMING = 'forming'
        ACTIVE = 'active'
        ACCEPTED = 'accepted'
        ALUMNI = 'alumni'
        DISBANDED = 'disbanded'

    season = models.ForeignKey('cohorts.Season', on_delete=models.PROTECT, related_name='teams')
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    one_liner_uz = models.CharField(max_length=200, blank=True)
    one_liner_en = models.CharField(max_length=200, blank=True)
    logo = models.ImageField(upload_to='public/teams/logos/%Y/%m/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.FORMING)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='teams_created'
    )

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name) or 'jamoa'
            slug = base
            i = 1
            while Team.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                i += 1
                slug = f'{base}-{i}'
            self.slug = slug
        super().save(*args, **kwargs)

    def active_members(self):
        return self.memberships.filter(left_at__isnull=True)


class TeamMembership(BaseModel):
    class Role(models.TextChoices):
        LEAD = 'lead'
        MEMBER = 'member'

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='memberships'
    )
    season = models.ForeignKey('cohorts.Season', on_delete=models.PROTECT)
    role = models.CharField(max_length=10, choices=Role.choices)
    left_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'team_memberships'
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'user'],
                condition=models.Q(left_at__isnull=True),
                name='uq_active_membership',
            ),
            models.UniqueConstraint(
                fields=['user', 'season'],
                condition=models.Q(left_at__isnull=True),
                name='uq_user_one_team_per_season',
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.season_id:
            self.season_id = self.team.season_id
        super().save(*args, **kwargs)


class TeamInvite(BaseModel):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='invites')
    email = models.EmailField()
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    token_hash = models.CharField(max_length=64)
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'team_invites'
        constraints = [
            models.UniqueConstraint(
                fields=['team', 'email'],
                condition=models.Q(accepted_at__isnull=True),
                name='uq_pending_invite_team_email',
            ),
        ]

    @staticmethod
    def hash_token(raw: str) -> str:
        return hashlib.sha256(raw.encode()).hexdigest()

    @classmethod
    def issue(cls, team, email, invited_by):
        raw = secrets.token_urlsafe(32)
        obj = cls.objects.create(
            team=team,
            email=email.lower(),
            invited_by=invited_by,
            token_hash=cls.hash_token(raw),
            expires_at=timezone.now() + timedelta(days=7),
        )
        return obj, raw
