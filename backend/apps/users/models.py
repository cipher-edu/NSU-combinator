from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from core.models import BaseModel


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError('Email majburiy')
        email = self.normalize_email(email).lower()
        extra.setdefault('email_kind', User.email_kind_from(email))
        user = self.model(email=email, **extra)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra):
        extra.setdefault('role', User.Role.SUPERADMIN)
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        extra.setdefault('name', extra.get('name') or 'Superadmin')
        return self.create_user(email, password, **extra)


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Role(models.TextChoices):
        APPLICANT = 'applicant', 'Arizachi'
        ADMIN = 'admin', 'Admin'
        SUPERADMIN = 'superadmin', 'Superadmin'
        INVESTOR = 'investor', 'Investor'

    class EmailKind(models.TextChoices):
        UNIVERSITY = 'university', '@nsuni.uz'
        PERSONAL = 'personal', 'Shaxsiy'
        UNKNOWN = 'unknown', "Noma'lum"

    class Affiliation(models.TextChoices):
        STUDENT = 'student', 'Talaba'
        MASTER = 'master', 'Magistrant'
        ALUMNI = 'alumni', 'Bitiruvchi'
        FACULTY = 'faculty', "O'qituvchi"
        OTHER = 'other', 'Boshqa'

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    bio = models.CharField(max_length=500, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='public/avatars/%Y/%m/', null=True, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.APPLICANT)
    email_kind = models.CharField(max_length=20, choices=EmailKind.choices, default=EmailKind.UNKNOWN)
    affiliation = models.CharField(max_length=20, choices=Affiliation.choices, blank=True)
    student_id = models.CharField(max_length=32, blank=True)
    faculty = models.ForeignKey(
        'cms.Faculty', null=True, blank=True, on_delete=models.SET_NULL, related_name='users'
    )
    is_student_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    locale = models.CharField(max_length=5, default='uz')
    consent_pd_at = models.DateTimeField(null=True, blank=True)
    consent_marketing_at = models.DateTimeField(null=True, blank=True)
    telegram_user_id = models.BigIntegerField(null=True, blank=True, unique=True)
    telegram_username = models.CharField(max_length=64, blank=True)
    telegram_linked_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'
        verbose_name = 'Foydalanuvchi'
        verbose_name_plural = 'Foydalanuvchilar'
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
            models.Index(fields=['student_id']),
            models.Index(fields=['email_kind']),
            models.Index(fields=['telegram_user_id']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['student_id'],
                condition=models.Q(is_student_verified=True) & ~models.Q(student_id=''),
                name='uq_users_verified_student_id',
            ),
        ]

    def __str__(self):
        return f'{self.name} <{self.email}>'

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.lower()
            self.email_kind = self.email_kind_from(self.email)
        if self.role == self.Role.SUPERADMIN:
            self.is_staff = True
            self.is_superuser = True
        elif self.role == self.Role.ADMIN:
            self.is_staff = True
        super().save(*args, **kwargs)

    @staticmethod
    def email_kind_from(email: str) -> str:
        domain = (email or '').split('@')[-1].lower()
        if domain == settings.UNIVERSITY_EMAIL_DOMAIN:
            return User.EmailKind.UNIVERSITY
        if domain:
            return User.EmailKind.PERSONAL
        return User.EmailKind.UNKNOWN

    def has_capability(self, cap: str) -> bool:
        if self.role in (self.Role.ADMIN, self.Role.SUPERADMIN):
            return True
        return self.capabilities.filter(capability=cap).exists()

    @property
    def telegram_linked(self) -> bool:
        return bool(self.telegram_user_id)

    @property
    def profile_complete(self) -> bool:
        name_ok = bool(self.name) and self.name != self.email.split('@')[0]
        return bool(name_ok and self.phone and self.affiliation and self.telegram_user_id)


class UserCapability(BaseModel):
    class Cap(models.TextChoices):
        REVIEWER = 'reviewer', 'Reviewer'
        MENTOR = 'mentor', 'Mentor'
        FACULTY = 'faculty', 'Faculty'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='capabilities')
    capability = models.CharField(max_length=20, choices=Cap.choices)

    class Meta:
        db_table = 'user_capabilities'
        constraints = [
            models.UniqueConstraint(fields=['user', 'capability'], name='uq_user_capability'),
        ]


class TelegramLinkToken(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='telegram_link_tokens')
    token_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'telegram_link_tokens'
