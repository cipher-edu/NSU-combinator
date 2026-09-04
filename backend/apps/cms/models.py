from django.db import models
from core.models import BaseModel


class Faculty(BaseModel):
    slug = models.SlugField(unique=True)
    name_uz = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'faculties'
        verbose_name = 'Fakultet'
        verbose_name_plural = 'Fakultetlar'

    def __str__(self):
        return self.name_uz


class News(BaseModel):
    slug = models.SlugField(unique=True)
    title_uz = models.CharField(max_length=240)
    title_en = models.CharField(max_length=240, blank=True)
    body_uz = models.TextField(blank=True)
    body_en = models.TextField(blank=True)
    cover = models.ImageField(upload_to='public/cms/news/%Y/%m/', null=True, blank=True)
    youtube_url = models.URLField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=False)

    class Meta:
        db_table = 'news'
        verbose_name = 'Yangilik'
        verbose_name_plural = 'Yangiliklar'
        ordering = ['-published_at', '-created_at']


class Partner(BaseModel):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='public/cms/partners/%Y/%m/', null=True, blank=True)
    url = models.URLField(blank=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'partners'
        ordering = ['order', 'name']


class StaffMember(BaseModel):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=150)
    title_uz = models.CharField(max_length=150, blank=True)
    title_en = models.CharField(max_length=150, blank=True)
    photo = models.ImageField(upload_to='public/cms/staff/%Y/%m/', null=True, blank=True)
    linkedin = models.URLField(blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        db_table = 'staff_members'
        ordering = ['order', 'name']


class Investor(BaseModel):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=150)
    title_uz = models.CharField(max_length=150, blank=True)
    title_en = models.CharField(max_length=150, blank=True)
    org = models.CharField(max_length=150, blank=True)
    photo = models.ImageField(upload_to='public/cms/investors/%Y/%m/', null=True, blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        db_table = 'investors'
        ordering = ['order', 'name']


class Page(BaseModel):
    slug = models.SlugField(unique=True)
    title_uz = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True)
    body_uz = models.TextField(blank=True)
    body_en = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)

    class Meta:
        db_table = 'pages'


class GalleryImage(BaseModel):
    class Placement(models.TextChoices):
        NONE = '', 'Faqat galereya'
        ABOUT = 'about', 'About blok'
        DEMO = 'demo', 'Demo Day'
        APPLY = 'apply', 'Ariza banner'
        OG = 'og', 'Open Graph'

    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='public/cms/gallery/%Y/%m/', blank=True, null=True)
    caption_uz = models.CharField(max_length=200, blank=True)
    caption_en = models.CharField(max_length=200, blank=True)
    placement = models.CharField(
        max_length=20,
        blank=True,
        default='',
        choices=Placement.choices,
    )
    show_in_gallery = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = 'gallery_images'
        verbose_name = 'Galereya rasmi'
        verbose_name_plural = 'Galereya rasmlari'
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.caption_uz or self.slug
