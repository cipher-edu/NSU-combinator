from django.db import models
from .utils import generate_unique_slug

class HeroSlide(models.Model):
    CTA_ACTIONS = [
        ('apply', 'Akseleratsiyaga ariza topshirish'),
        ('events', 'Hakatonlar & Tadbirlar kalendari'),
        ('team', 'Talent Pool & Jamoa qidirish'),
        ('portfolio', 'Startaplar portfelini ko‘rish'),
    ]

    badge = models.CharField(max_length=100, verbose_name="Kichik Badge", default="Navoiy Davlat Universiteti")
    title = models.CharField(max_length=200, verbose_name="Asosiy Sarlavha", help_text="Masalan: Inkubatsiya va Akseleratsiya")
    title_accent = models.CharField(max_length=100, verbose_name="Rangli Urg‘u So‘z", help_text="Masalan: Markazi")
    subtitle = models.CharField(max_length=255, verbose_name="Kichik Sarlavha", default="G‘oyadan Investitsiyagacha • 45 Kunlik Dastur")
    description = models.TextField(verbose_name="Batafsil Tavsif")
    image_url = models.URLField(max_length=500, verbose_name="Fon Rasmi URL manzili")
    
    highlights = models.JSONField(
        default=list, 
        verbose_name="Muhim Nuqtalar (Highlights)", 
        help_text='JSON massiv ko‘rinishida: ["100+ o‘rinli Kovorking", "3D Prototyping", "$5,000 grantlar"]'
    )
    
    cta_text = models.CharField(max_length=100, verbose_name="Bosh Tugma Matni", default="Akseleratsiyaga ariza topshirish")
    secondary_cta_text = models.CharField(max_length=100, verbose_name="Ikkinchi Tugma Matni", default="Dastur haqida batafsil")
    cta_action = models.CharField(max_length=50, choices=CTA_ACTIONS, default='apply', verbose_name="Tugma Amal Yo‘nalishi")
    
    order = models.PositiveIntegerField(default=0, verbose_name="Ko‘rsatilish Tartibi")
    is_active = models.BooleanField(default=True, verbose_name="Faolmi?")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Bosh Slayd"
        verbose_name_plural = "1. Bosh Sahifa Slaydlari"
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.order}. {self.title} {self.title_accent}"


class SectionConfig(models.Model):
    SECTION_CHOICES = [
        ('hero_slider', 'Bosh Slayder'),
        ('program_stages', 'Dastur Bosqichlari (45 kun)'),
        ('portfolio_section', 'Startaplar Katalogi & Leaderboard'),
        ('demo_day_section', 'Demo Day Natijalari'),
        ('news_section', 'Yangiliklar & Matbuot'),
        ('events_section', 'Hakatonlar & Tadbirlar'),
        ('talent_pool_section', 'Talent Pool & Hammuassislar'),
        ('playbook_section', 'Startup Playbook'),
        ('partners_marquee', 'Hamkorlar Marquee Aylanishi'),
    ]

    section_key = models.CharField(max_length=50, choices=SECTION_CHOICES, unique=True, verbose_name="Bo‘lim Turi")
    custom_title = models.CharField(max_length=150, verbose_name="Admin Uchun Nomi")
    is_visible = models.BooleanField(default=True, verbose_name="Saytda Ko‘rinsinmi?")
    order = models.PositiveIntegerField(default=0, verbose_name="Ko‘rsatilish Tartibi")

    class Meta:
        verbose_name = "Bo‘lim Tartibi va Ko‘rinishi"
        verbose_name_plural = "2. Sayt Bo‘limlarini Boshqarish"
        ordering = ['order']

    def __str__(self):
        return f"{self.order}. {self.get_section_key_display()} ({'Ko‘rinmoqda' if self.is_visible else 'Yashirilgan'})"


class TopTicker(models.Model):
    badge_text = models.CharField(max_length=50, default="NavDU 3-Mavsum", verbose_name="Badge Yozuvi")
    message = models.CharField(max_length=255, verbose_name="E’lon Matni")
    action_text = models.CharField(max_length=50, default="Ariza topshirish →", verbose_name="Tugma Matni")
    action_url = models.CharField(max_length=100, default="#apply", verbose_name="Havola yoki Amal")
    is_active = models.BooleanField(default=True, verbose_name="Faolmi?")

    class Meta:
        verbose_name = "Tepa E’lon Banneri"
        verbose_name_plural = "3. Tepa Mikro-Ticker Banneri"

    def __str__(self):
        return f"{self.badge_text}: {self.message[:40]}..."


class PlatformMetric(models.Model):
    label = models.CharField(max_length=100, verbose_name="Ko‘rsatkich Nomi", help_text="Masalan: Jami Jalb Qilingan")
    value = models.CharField(max_length=50, verbose_name="Qiymat / Raqam", help_text="Masalan: $975,000 yoki 32+")
    subtitle = models.CharField(max_length=150, verbose_name="Qo‘shimcha Izoh", blank=True)
    order = models.PositiveIntegerField(default=0, verbose_name="Tartibi")

    class Meta:
        verbose_name = "Platforma Statistikasi"
        verbose_name_plural = "4. Bosh Sahifa Metrikalari"
        ordering = ['order']

    def __str__(self):
        return f"{self.label}: {self.value}"


class PartnerLogo(models.Model):
    name = models.CharField(max_length=100, verbose_name="Hamkor Nomi")
    logo_svg_key = models.CharField(max_length=50, blank=True, verbose_name="SVG Ikonka Kaliti", help_text="SvgLogoNKMK, SvgLogoITPark...")
    custom_logo_url = models.URLField(max_length=500, blank=True, verbose_name="Yoki Rasm URL havolasi")
    website_url = models.URLField(max_length=500, blank=True, verbose_name="Hamkor Vebsayti")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartibi")
    is_active = models.BooleanField(default=True, verbose_name="Faolmi?")

    class Meta:
        verbose_name = "Hamkor Logotipi"
        verbose_name_plural = "5. Hamkorlar Logotiplari (Marquee)"
        ordering = ['order']

    def __str__(self):
        return self.name


class Startup(models.Model):
    name = models.CharField(max_length=200, verbose_name="Startap Nomi")
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name="Slug (URL manzili)")
    tagline = models.CharField(max_length=300, verbose_name="Shior / Qisqa Ta‘rif")
    category = models.CharField(max_length=100, verbose_name="Kategoriya", default="AI & EdTech")
    stage = models.CharField(max_length=50, verbose_name="Bosqich", default="MVP")
    batch = models.CharField(max_length=100, verbose_name="Mavsum", default="3-Mavsum (2026)")
    upvotes = models.PositiveIntegerField(default=0, verbose_name="Ovozlar Soni")
    raised_amount = models.CharField(max_length=50, default="$0", verbose_name="Jalb Qilingan Investitsiya")
    problem = models.TextField(verbose_name="Muammo", blank=True)
    solution = models.TextField(verbose_name="Yechim", blank=True)
    full_description = models.TextField(verbose_name="To‘liq Tavsif", blank=True)
    logo = models.CharField(max_length=20, default="🚀", verbose_name="Logo (Emoji)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Rezident Startap"
        verbose_name_plural = "6. Rezident Startaplar Katalogi"
        ordering = ['-upvotes', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.stage})"


class NewsArticle(models.Model):
    CATEGORY_CHOICES = [
        ('Akseleratsiya', '🚀 Akseleratsiya'),
        ('Grantlar', '💰 Grantlar'),
        ('Hamkorlik', '🤝 Hamkorlik'),
        ('Hakatonlar', '🏆 Hakatonlar'),
        ('Universitet', '🏛️ Universitet'),
        ('Investitsiya', '📈 Investitsiya'),
    ]
    title = models.CharField(max_length=255, verbose_name="Sarlavha")
    slug = models.SlugField(max_length=255, unique=True, blank=True, verbose_name="Slug (URL uchun)")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Akseleratsiya', verbose_name="Kategoriya")
    excerpt = models.TextField(verbose_name="Qisqa Anons (Excerpt)")
    content = models.TextField(verbose_name="Batafsil Matn")
    cover_image = models.URLField(max_length=500, verbose_name="Muqova Rasmi URL")
    author_name = models.CharField(max_length=150, verbose_name="Muallif F.I.Sh", default="NavDU Axborot xizmati")
    author_role = models.CharField(max_length=150, verbose_name="Muallif Lavozimi", default="Matbuot kotibi")
    date_str = models.CharField(max_length=50, verbose_name="Sana (ko‘rinadigan)", default="12 Mart, 2026")
    read_time = models.CharField(max_length=30, verbose_name="O‘qish Vaqti", default="3 daqiqa")
    featured = models.BooleanField(default=False, verbose_name="Asosiy Yangilikmi? (Featured)")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Ko‘rishlar Soni")
    likes_count = models.PositiveIntegerField(default=0, verbose_name="Yoqtirishlar (Likes)")
    tags = models.JSONField(default=list, blank=True, verbose_name="Teglar (JSON massiv)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Yangilik / Press-reliz"
        verbose_name_plural = "7. Yangiliklar va Matbuot"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Mentor(models.Model):
    name = models.CharField(max_length=150, verbose_name="Mentor F.I.Sh")
    title = models.CharField(max_length=200, verbose_name="Lavozimi / Mutaxassisligi")
    organization = models.CharField(max_length=200, verbose_name="Tashkilot / Kompaniya", default="Navoiy davlat universiteti")
    bio = models.TextField(verbose_name="Qisqacha Tarjimai Hol (Bio)")
    avatar = models.URLField(max_length=500, verbose_name="Rasm URL")
    expertise = models.JSONField(default=list, verbose_name="Ixtisoslik Sohalari (JSON massiv)", help_text='["AI & ML", "Pitch Deck"]')
    available_slots = models.JSONField(default=list, verbose_name="Bo‘sh Vaqt Oraliqlari (JSON massiv)", help_text='["Seshanba 15:00", "Payshanba 16:00"]')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0, verbose_name="Reyting (1-5)")
    reviews_count = models.PositiveIntegerField(default=0, verbose_name="Taqrizlar Soni")
    telegram = models.CharField(max_length=100, blank=True, verbose_name="Telegram Profili (@username)")
    is_active = models.BooleanField(default=True, verbose_name="Faolmi?")

    class Meta:
        verbose_name = "Mentor / Ekspert"
        verbose_name_plural = "8. Mentorlar va Ekspertlar"
        ordering = ['-rating', 'name']

    def __str__(self):
        return f"{self.name} ({self.organization})"


class CoFounderVacancy(models.Model):
    COMMITMENT_CHOICES = [
        ('To‘liq stavka', 'To‘liq stavka'),
        ('Erkin grafik', 'Erkin grafik'),
        ('Yarim stavka', 'Yarim stavka'),
        ('Loyiha asosida', 'Loyiha asosida'),
    ]
    startup_name = models.CharField(max_length=150, verbose_name="Startap Nomi")
    startup_logo = models.CharField(max_length=20, default="🚀", verbose_name="Logo (Emoji)")
    category = models.CharField(max_length=100, verbose_name="Soha / Kategoriya", default="AI & EdTech")
    role_title = models.CharField(max_length=150, verbose_name="Qidirilayotgan Mutaxassis / Rol")
    required_skills = models.JSONField(default=list, verbose_name="Kerakli Ko‘nikmalar (JSON massiv)", help_text='["React", "Python", "Figma"]')
    description = models.TextField(verbose_name="Vakansiya / Talablar Tavsifi")
    commitment_type = models.CharField(max_length=50, choices=COMMITMENT_CHOICES, default='Erkin grafik', verbose_name="Ish Grafigi")
    faculty = models.CharField(max_length=150, verbose_name="Tavsiya Qilingan Fakultet", default="IT yoki Fizika-matematika")
    contact_telegram = models.CharField(max_length=100, verbose_name="Aloqa Uchun Telegram (@username)")
    is_open = models.BooleanField(default=True, verbose_name="Vakansiya Ochiqmi?")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Hammuassis Vakansiyasi"
        verbose_name_plural = "9. Hammuassis (Co-Founder) Vakansiyalari"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.role_title} @ {self.startup_name}"


class Story(models.Model):
    title = models.CharField(max_length=255, verbose_name="Hikoya Sarlavhasi")
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name="Slug (URL manzili)")
    excerpt = models.TextField(verbose_name="Qisqa Anons")
    content = models.TextField(verbose_name="Batafsil Muvaffaqiyat Tarixi")
    author_name = models.CharField(max_length=150, verbose_name="Asoschi F.I.Sh")
    author_role = models.CharField(max_length=150, verbose_name="Lavozimi / Roli")
    author_avatar = models.URLField(max_length=500, verbose_name="Muallif Rasmi URL")
    startup_name = models.CharField(max_length=150, verbose_name="Startap Nomi")
    date_str = models.CharField(max_length=50, verbose_name="Sana (matn)", default="02.03.2026")
    read_time = models.CharField(max_length=30, verbose_name="O‘qish Vaqti", default="4 daqiqa")
    likes = models.PositiveIntegerField(default=0, verbose_name="Layklar Soni")
    comments_count = models.PositiveIntegerField(default=0, verbose_name="Izohlar Soni")
    tags = models.JSONField(default=list, blank=True, verbose_name="Teglar (JSON massiv)")
    cover_image = models.URLField(max_length=500, blank=True, verbose_name="Muqova Rasmi (ixtiyoriy)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Startap Hikoyasi"
        verbose_name_plural = "10. Muvaffaqiyat Hikoyalari (Blog)"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.startup_name}: {self.title[:50]}"


class PlaybookGuide(models.Model):
    CATEGORY_CHOICES = [
        ('G‘oya', '💡 G‘oya (Idea Validation)'),
        ('MVP', '🛠️ MVP (Prototip)'),
        ('Grantlar', '💰 Grantlar va Fondlar'),
        ('Pitch', '🎤 Pitch va Taqdimot'),
        ('Yuridik', '⚖️ Yuridik va Ro‘yxatdan o‘tish'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='G‘oya', verbose_name="Qo‘llanma Bo‘limi")
    title = models.CharField(max_length=255, verbose_name="Qo‘llanma Sarlavhasi")
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name="Slug (URL manzili)")
    read_time = models.CharField(max_length=30, verbose_name="O‘qish Vaqti", default="6 daqiqa")
    summary = models.TextField(verbose_name="Qisqa Mazmuni")
    author = models.CharField(max_length=150, verbose_name="Muallif / Mentor F.I.Sh")
    author_role = models.CharField(max_length=150, verbose_name="Muallif Lavozimi")
    key_takeaway = models.TextField(verbose_name="Asosiy Xulosa (Oltin Qoida)")
    checklist = models.JSONField(default=list, verbose_name="Tekshiruv Ro‘yxati (Checklist, JSON massiv)")
    detailed_content = models.JSONField(default=list, verbose_name="Batafsil Paragraflar (JSON massiv)")
    template_download_url = models.URLField(max_length=500, blank=True, verbose_name="Yuklab Olish Shablon Havolasi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib Raqami")
    is_active = models.BooleanField(default=True, verbose_name="Faolmi?")

    class Meta:
        verbose_name = "Playbook Qo‘llanmasi"
        verbose_name_plural = "11. Startup Playbook Qo‘llanmalari"
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.category}] {self.title}"
