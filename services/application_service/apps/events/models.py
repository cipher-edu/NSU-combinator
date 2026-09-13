from django.db import models
from .utils import generate_unique_slug

class Event(models.Model):
    TYPE_CHOICES = [
        ('Hakaton', '🏆 Hakaton'),
        ('Seminar', '🎤 Seminar / Trening'),
        ('Demo Day', '🚀 Demo Day'),
        ('Meetup', '☕ Meetup'),
        ('Vebinar', '💻 Onlayn Vebinar'),
    ]

    MODE_CHOICES = [
        ('Oflayn', 'Oflayn (Universitet binosida)'),
        ('Onlayn', 'Onlayn (Zoom / Meet)'),
        ('Gibrid', 'Gibrid'),
    ]

    title = models.CharField(max_length=255, verbose_name="Tadbir Nomi")
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name="Slug (URL manzili)")
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='Hakaton', verbose_name="Tadbir Turi")
    date = models.CharField(max_length=100, verbose_name="Sana (masalan: 18-20 Oktyabr, 2026)")
    time = models.CharField(max_length=100, verbose_name="Vaqti (masalan: 09:00 - 18:00)")
    location = models.CharField(max_length=255, verbose_name="O‘tkazilish Joyi", default="NavDU Bosh binosi, Kovorking zali")
    mode = models.CharField(max_length=50, choices=MODE_CHOICES, default='Oflayn', verbose_name="Formati")
    prize = models.CharField(max_length=100, blank=True, verbose_name="Mukofot Jamg‘armasi", help_text="Masalan: 60 000 000 so‘m")
    registration_deadline = models.CharField(max_length=100, verbose_name="Ro‘yxatdan O‘tish Oxirgi Muddati")
    description = models.TextField(verbose_name="Tadbir Tavsifi va Qoidalari")
    is_registration_open = models.BooleanField(default=True, verbose_name="Ro‘yxatdan O‘tish Ochiqmi?")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Tadbir / Hakaton"
        verbose_name_plural = "1. Tadbirlar va Hakatonlar"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.date})"


class Ticket(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets', verbose_name="Tadbir")
    ticket_id = models.CharField(max_length=50, unique=True, verbose_name="Chipta ID (Raqamli kod)")
    participant_name = models.CharField(max_length=200, verbose_name="Qatnashuvchi F.I.Sh")
    phone = models.CharField(max_length=30, verbose_name="Telefon Raqami")
    telegram = models.CharField(max_length=100, verbose_name="Telegram (@username)")
    faculty = models.CharField(max_length=150, verbose_name="Fakultet")
    is_attended = models.BooleanField(default=False, verbose_name="Eshikda Skaner Qilinganmi? (Davomat)")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ro‘yxatdan O‘tgan Vaqti")

    class Meta:
        verbose_name = "Raqamli QR Chipta"
        verbose_name_plural = "2. Ro‘yxatdan O‘tganlar va Chiptalar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ticket_id} — {self.participant_name} ({self.event.title})"
