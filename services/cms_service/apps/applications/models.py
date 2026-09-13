from django.db import models

class Application(models.Model):
    STATUS_CHOICES = [
        ('Kutilmoqda', '🟡 Kutilmoqda (Yangi)'),
        ('Ko‘rib chiqilmoqda', '🔵 Hakamlar ko‘rib chiqmoqda'),
        ('Intervyuga chaqirildi', '🟣 Suhbatga taklif qilindi'),
        ('Qabul qilindi', '🟢 Qabul qilindi (3-Mavsum Rezidenti)'),
        ('Rad etildi', '🔴 Rad etildi'),
    ]

    STAGE_CHOICES = [
        ('Idea', 'G‘oya (Idea)'),
        ('MVP', 'Prototip (MVP)'),
        ('Traction', 'Dastlabki Mijozlar (Traction)'),
        ('Scaling', 'Kengayish (Scaling)'),
    ]

    id = models.CharField(max_length=50, primary_key=True, verbose_name="Ariza ID (Kodi)")
    
    # Asoschi va jamoa
    founder_name = models.CharField(max_length=200, verbose_name="F.I.Sh. (Asoschi)")
    phone = models.CharField(max_length=30, verbose_name="Telefon Raqami")
    email = models.EmailField(verbose_name="Email Manzili")
    telegram_username = models.CharField(max_length=100, verbose_name="Telegram Profili (@username)")
    telegram_chat_id = models.BigIntegerField(null=True, blank=True, verbose_name="Telegram Chat ID")
    faculty = models.CharField(max_length=150, verbose_name="Fakultet")
    course = models.CharField(max_length=50, verbose_name="Kurs")
    team_size = models.PositiveIntegerField(default=1, verbose_name="Jamoa A’zolari Soni")

    # Startap loyiha
    project_name = models.CharField(max_length=200, verbose_name="Startap Nomi")
    category = models.CharField(max_length=100, verbose_name="Yo‘nalishi / Kategoriya")
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='MVP', verbose_name="Rivojlanish Bosqichi")
    problem = models.TextField(verbose_name="Hal Qilinayotgan Muammo")
    solution = models.TextField(verbose_name="Taklif Qilinayotgan Yechim")
    target_market = models.CharField(max_length=255, verbose_name="Maqsadli Bozor Hajmi")
    deck_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Pitch Deck Havolasi (Google Drive / Canva / PDF)")

    # Tizim va xavfsizlik
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Kutilmoqda', verbose_name="Ariza Holati")
    feedback = models.TextField(blank=True, null=True, verbose_name="Ekspert / Rektorat Rasmiy Xulosasi (Talabaga)")
    otp_code = models.CharField(max_length=10, blank=True, verbose_name="Bir Martalik OTP Kodi")
    is_verified = models.BooleanField(default=False, verbose_name="Telegram orqali tasdiqlanganmi?")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Topshirilgan Vaqti")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Oxirgi O‘zgarish")

    class Meta:
        verbose_name = "Akseleratsiya Arizasi"
        verbose_name_plural = "1. 45 Kunlik Dastur Arizalari"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.id} — {self.project_name} ({self.founder_name})"


class ApplicationEvaluation(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='evaluations', verbose_name="Ariza")
    evaluator_name = models.CharField(max_length=150, verbose_name="Ekspert / Mentor F.I.Sh")
    idea_score = models.PositiveSmallIntegerField(verbose_name="G‘oya dolzarbligi (1-10)", default=5)
    team_score = models.PositiveSmallIntegerField(verbose_name="Jamoa salohiyati (1-10)", default=5)
    market_score = models.PositiveSmallIntegerField(verbose_name="Bozor hajmi (1-10)", default=5)
    comments = models.TextField(verbose_name="Ekspert Izohi va Tavsiyasi", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Hakam Bahosi"
        verbose_name_plural = "2. Hakamlar Baholash Varaqalari"

    def total_score(self):
        return self.idea_score + self.team_score + self.market_score
