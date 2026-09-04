from django.conf import settings
from django.db import models
from core.models import BaseModel


class Campaign(BaseModel):
    class Channel(models.TextChoices):
        TELEGRAM = 'telegram', 'Telegram'
        INSTAGRAM = 'instagram', 'Instagram'
        FACEBOOK = 'facebook', 'Facebook'
        FACULTY = 'faculty', 'Fakultet'
        EVENT = 'event', 'Tadbir'
        QR = 'qr', 'QR'
        MENTOR = 'mentor', 'Mentor'
        REFERRAL = 'referral', 'Referral'
        OTHER = 'other', 'Boshqa'

    class Destination(models.TextChoices):
        APPLY = 'apply', 'Ariza sahifasi'
        TELEGRAM = 'telegram', 'Telegram bot'

    code = models.SlugField(unique=True, max_length=32)
    name = models.CharField(max_length=160)
    channel = models.CharField(max_length=20, choices=Channel.choices, default=Channel.OTHER)
    destination = models.CharField(max_length=20, choices=Destination.choices, default=Destination.APPLY)
    faculty = models.ForeignKey(
        'cms.Faculty', null=True, blank=True, on_delete=models.SET_NULL, related_name='campaigns'
    )
    note = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    clicks = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name='campaigns_created'
    )

    class Meta:
        db_table = 'ops_campaigns'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.code})'


class CampaignHit(BaseModel):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='hits')
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='campaign_hits'
    )

    class Meta:
        db_table = 'ops_campaign_hits'


class Lead(BaseModel):
    class Status(models.TextChoices):
        NEW = 'new', 'Yangi'
        CONTACTED = 'contacted', 'Bog‘lanildi'
        NURTURING = 'nurturing', 'Yetaklanmoqda'
        QUALIFIED = 'qualified', 'Mos'
        CONVERTED = 'converted', 'Arizaga o‘tdi'
        LOST = 'lost', 'Yo‘qotildi'
        NEXT_SEASON = 'next_season', 'Keyingi mavsum'

    class Source(models.TextChoices):
        SITE = 'site', 'Sayt'
        TELEGRAM = 'telegram', 'Telegram'
        INSTAGRAM = 'instagram', 'Instagram'
        FACEBOOK = 'facebook', 'Facebook'
        FACULTY = 'faculty', 'Fakultet'
        EVENT = 'event', 'Tadbir'
        MENTOR = 'mentor', 'Mentor'
        QR = 'qr', 'QR'
        REFERRAL = 'referral', 'Referral'
        INGEST = 'ingest', 'Tizim'
        ADMIN = 'admin', 'Admin'
        OTHER = 'other', 'Boshqa'

    email = models.EmailField()
    name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    idea = models.CharField(max_length=280, blank=True)
    notes = models.TextField(blank=True)
    affiliation = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    source = models.CharField(max_length=20, choices=Source.choices, default=Source.ADMIN)
    faculty = models.ForeignKey(
        'cms.Faculty', null=True, blank=True, on_delete=models.SET_NULL, related_name='leads'
    )
    campaign = models.ForeignKey(
        Campaign, null=True, blank=True, on_delete=models.SET_NULL, related_name='leads'
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='owned_leads'
    )
    converted_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='source_leads'
    )
    next_contact_at = models.DateTimeField(null=True, blank=True)
    converted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'ops_leads'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['email']),
            models.Index(fields=['source']),
        ]

    def __str__(self):
        return self.email


class OpsTask(BaseModel):
    class Status(models.TextChoices):
        TODO = 'todo', 'Navbat'
        DOING = 'doing', 'Jarayon'
        DONE = 'done', 'Tayyor'

    class Area(models.TextChoices):
        CONTENT = 'content', 'Kontent'
        EVENT = 'event', 'Tadbir'
        FACULTY = 'faculty', 'Dekanat'
        MENTOR = 'mentor', 'Mentor'
        TECH = 'tech', 'Texnik'
        DEMO = 'demo', 'Demo Day'
        OTHER = 'other', 'Boshqa'

    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.TODO)
    area = models.CharField(max_length=20, choices=Area.choices, default=Area.OTHER)
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='ops_tasks'
    )
    due_at = models.DateTimeField(null=True, blank=True)
    team = models.ForeignKey('teams.Team', null=True, blank=True, on_delete=models.SET_NULL, related_name='ops_tasks')
    season = models.ForeignKey(
        'cohorts.Season', null=True, blank=True, on_delete=models.SET_NULL, related_name='ops_tasks'
    )

    class Meta:
        db_table = 'ops_tasks'


class ProgramWeek(BaseModel):
    season = models.ForeignKey('cohorts.Season', on_delete=models.CASCADE, related_name='ops_weeks')
    week = models.PositiveSmallIntegerField()
    slug = models.SlugField(max_length=64, blank=True)
    title_uz = models.CharField(max_length=160)
    title_en = models.CharField(max_length=160, blank=True)
    outcome_uz = models.TextField(blank=True)
    starts_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'ops_program_weeks'
        ordering = ['week']
        constraints = [
            models.UniqueConstraint(fields=['season', 'week'], name='uq_ops_week_season'),
        ]


class Deliverable(BaseModel):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Kutilmoqda'
        SUBMITTED = 'submitted', 'Topshirildi'
        LATE = 'late', 'Kechikdi'
        MISSING = 'missing', 'Yo‘q'

    week = models.ForeignKey(ProgramWeek, on_delete=models.CASCADE, related_name='deliverables')
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE, related_name='deliverables')
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    url = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'ops_deliverables'
        constraints = [
            models.UniqueConstraint(fields=['week', 'team'], name='uq_ops_deliverable_week_team'),
        ]


class Attendance(BaseModel):
    week = models.ForeignKey(ProgramWeek, on_delete=models.CASCADE, related_name='attendance')
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE, related_name='attendance')
    present = models.BooleanField(default=True)
    notes = models.CharField(max_length=240, blank=True)

    class Meta:
        db_table = 'ops_attendance'
        constraints = [
            models.UniqueConstraint(fields=['week', 'team'], name='uq_ops_attendance_week_team'),
        ]


class TeamWeeklyUpdate(BaseModel):
    week = models.ForeignKey(ProgramWeek, on_delete=models.CASCADE, related_name='updates')
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE, related_name='weekly_updates')
    body = models.TextField()
    url = models.URLField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name='weekly_updates_written'
    )

    class Meta:
        db_table = 'ops_weekly_updates'


class MentorAssignment(BaseModel):
    class Kind(models.TextChoices):
        PRIMARY = 'primary', 'Asosiy'
        ADVISOR = 'advisor', 'Maslahatchi'

    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE, related_name='mentor_assignments')
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='mentor_assignments'
    )
    kind = models.CharField(max_length=16, choices=Kind.choices, default=Kind.PRIMARY)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'ops_mentor_assignments'
        constraints = [
            models.UniqueConstraint(fields=['team', 'mentor'], name='uq_ops_mentor_team'),
        ]


class OfficeHour(BaseModel):
    class Status(models.TextChoices):
        OPEN = 'open', 'Ochiq'
        BOOKED = 'booked', 'Band'
        DONE = 'done', 'O‘tdi'
        CANCELLED = 'cancelled', 'Bekor'

    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='office_hours'
    )
    team = models.ForeignKey(
        'teams.Team', null=True, blank=True, on_delete=models.SET_NULL, related_name='office_hours'
    )
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.OPEN)

    class Meta:
        db_table = 'ops_office_hours'
        ordering = ['starts_at']


class DemoDaySlot(BaseModel):
    season = models.ForeignKey('cohorts.Season', on_delete=models.CASCADE, related_name='demo_slots')
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE, related_name='demo_slots')
    order = models.PositiveSmallIntegerField(default=0)
    speaker = models.CharField(max_length=150, blank=True)
    duration_sec = models.PositiveSmallIntegerField(default=180)
    deck_ok = models.BooleanField(default=False)
    demo_ok = models.BooleanField(default=False)
    video_ok = models.BooleanField(default=False)
    tech_checked = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'ops_demo_slots'
        ordering = ['order', 'created_at']
        constraints = [
            models.UniqueConstraint(fields=['season', 'team'], name='uq_ops_demo_slot_team'),
        ]


class InvestorInterest(BaseModel):
    class Status(models.TextChoices):
        INVITED = 'invited', 'Taklif'
        ATTENDED = 'attended', 'Keldi'
        INTERESTED = 'interested', 'Qiziqdi'
        INTRO = 'intro', 'Intro berildi'
        PASSED = 'passed', 'O‘tdi'

    investor = models.ForeignKey(
        'cms.Investor', null=True, blank=True, on_delete=models.SET_NULL, related_name='interests'
    )
    investor_name = models.CharField(max_length=150, blank=True)
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE, related_name='investor_interests')
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.INVITED)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'ops_investor_interests'


class KnowledgeArticle(BaseModel):
    class Audience(models.TextChoices):
        FOUNDER = 'founder', 'Jamoa'
        STAFF = 'staff', 'Xodim'

    slug = models.SlugField(unique=True)
    title_uz = models.CharField(max_length=200)
    body_uz = models.TextField(blank=True)
    audience = models.CharField(max_length=16, choices=Audience.choices, default=Audience.FOUNDER)
    is_published = models.BooleanField(default=False)

    class Meta:
        db_table = 'ops_knowledge'
        ordering = ['title_uz']


class SurveyResponse(BaseModel):
    class Kind(models.TextChoices):
        SESSION = 'session', 'Sessiya'
        NPS = 'nps', 'NPS'

    season = models.ForeignKey('cohorts.Season', on_delete=models.CASCADE, related_name='surveys')
    week = models.ForeignKey(
        ProgramWeek, null=True, blank=True, on_delete=models.SET_NULL, related_name='surveys'
    )
    kind = models.CharField(max_length=16, choices=Kind.choices, default=Kind.SESSION)
    score = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)

    class Meta:
        db_table = 'ops_surveys'
