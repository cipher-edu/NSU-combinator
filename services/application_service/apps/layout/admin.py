from django.contrib import admin
from django.utils.html import format_html
from django.db import models
from ckeditor.widgets import CKEditorWidget
from .models import (
    HeroSlide, SectionConfig, TopTicker, PlatformMetric, PartnerLogo, Startup,
    NewsArticle, Mentor, CoFounderVacancy, Story, PlaybookGuide
)

# Admin Panel Sarlavhasi
admin.site.site_header = "NavDU Inkubatsiya & Akseleratsiya Markazi — Boshqaruv Paneli"
admin.site.site_title = "NavDU Startap Admin"
admin.site.index_title = "Platforma Kontenti va Foydalanuvchilarni Boshqarish"

class RichTextAdmin(admin.ModelAdmin):
    """
    Barcha katta matnli (TextField) maydonlar uchun to'liq funksiyali
    CKEditor WYSIWYG professional tahrirlovchisini ulovchi asosiy admin sinfi.
    """
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget(config_name='default')},
    }
    class Media:
        css = {
            'all': ('admin/css/custom_ckeditor.css',)
        }

@admin.register(HeroSlide)
class HeroSlideAdmin(RichTextAdmin):
    list_display = ['order', 'image_thumb', 'title_display', 'badge_display', 'cta_action', 'status_badge']
    list_display_links = ['title_display']
    list_editable = ['order']
    search_fields = ['title', 'title_accent', 'description']
    list_filter = ['is_active', 'cta_action']
    fieldsets = (
        ("Sarlavhalar va Ko‘rinish", {
            "fields": ("badge", "title", "title_accent", "subtitle", "description", "image_url")
        }),
        ("Muhim Belgilar (Highlights)", {
            "fields": ("highlights",),
            "description": 'JSON massiv formatida kiriting: ["100+ o‘rinli Kovorking", "3D Prototyping", "$5,000 grantlar"]'
        }),
        ("Harakat Tugmalari (CTA Buttons)", {
            "fields": ("cta_text", "cta_action", "secondary_cta_text")
        }),
        ("Boshqaruv Sozlamalari", {
            "fields": ("order", "is_active")
        }),
    )

    def image_thumb(self, obj):
        if obj.image_url:
            return format_html(
                '<img src="{}" style="width:68px; height:40px; object-fit:cover; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.15);" />',
                obj.image_url
            )
        return "—"
    image_thumb.short_description = "Rasm"

    def title_display(self, obj):
        return format_html(
            '<strong>{}</strong> <span style="color:#0284c7; font-weight:700;">{}</span><div style="font-size:11px; color:#64748b;">{}</div>',
            obj.title, obj.title_accent, obj.subtitle[:60]
        )
    title_display.short_description = "Slayder Sarlavhasi"

    def badge_display(self, obj):
        return format_html(
            '<span style="background:#f1f5f9; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:600; color:#334155;">{}</span>',
            obj.badge
        )
    badge_display.short_description = "Badge"

    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:700;">✓ Faol</span>')
        return format_html('<span style="background:#f1f5f9; color:#94a3b8; padding:2px 8px; border-radius:10px; font-size:11px;">O‘chirilgan</span>')
    status_badge.short_description = "Holati"


@admin.register(SectionConfig)
class SectionConfigAdmin(admin.ModelAdmin):
    list_display = ['order', 'section_key_badge', 'custom_title', 'visibility_badge']
    list_display_links = ['custom_title']
    list_editable = ['order']
    search_fields = ['custom_title', 'section_key']
    list_filter = ['is_visible']

    def section_key_badge(self, obj):
        return format_html(
            '<code style="background:#f1f5f9; color:#0f172a; padding:2px 6px; border-radius:4px; font-size:11px;">{}</code>',
            obj.section_key
        )
    section_key_badge.short_description = "Kalit So‘z (Key)"

    def visibility_badge(self, obj):
        if obj.is_visible:
            return format_html('<span style="background:#d1fae5; color:#065f46; padding:3px 9px; border-radius:10px; font-weight:bold; font-size:11px;">👁️ Ko‘rinmoqda</span>')
        return format_html('<span style="background:#fee2e2; color:#991b1b; padding:3px 9px; border-radius:10px; font-weight:bold; font-size:11px;">🚫 Yashirilgan</span>')
    visibility_badge.short_description = "Saytdagi Ko‘rinishi"


@admin.register(TopTicker)
class TopTickerAdmin(admin.ModelAdmin):
    list_display = ['badge_text_display', 'message', 'action_button', 'status_badge']
    list_display_links = ['message']

    def badge_text_display(self, obj):
        return format_html(
            '<span style="background:#fee2e2; color:#991b1b; font-weight:bold; padding:2px 8px; border-radius:4px; font-size:11px;">{}</span>',
            obj.badge_text
        )
    badge_text_display.short_description = "Badge"

    def action_button(self, obj):
        return format_html(
            '<span style="background:#0284c7; color:#fff; padding:2px 8px; border-radius:4px; font-size:11px;">{}</span>',
            obj.action_text
        )
    action_button.short_description = "Tugma"

    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;">✓ Faol</span>')
        return format_html('<span style="background:#f1f5f9; color:#94a3b8; padding:2px 8px; border-radius:10px; font-size:11px;">Nofaol</span>')
    status_badge.short_description = "Holati"


@admin.register(PlatformMetric)
class PlatformMetricAdmin(admin.ModelAdmin):
    list_display = ['order', 'metric_display', 'subtitle']
    list_display_links = ['metric_display']
    list_editable = ['order']

    def metric_display(self, obj):
        return format_html(
            '<span style="font-size:15px; font-weight:bold; color:#0284c7; margin-right:8px;">{}</span> <strong>{}</strong>',
            obj.value, obj.label
        )
    metric_display.short_description = "Ko‘rsatkich va Qiymat"


@admin.register(PartnerLogo)
class PartnerLogoAdmin(admin.ModelAdmin):
    list_display = ['order', 'name', 'logo_display', 'status_badge']
    list_display_links = ['name']
    list_editable = ['order']
    search_fields = ['name']
    list_filter = ['is_active']

    def logo_display(self, obj):
        if obj.logo_svg_key:
            return format_html('<span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-family:monospace; font-size:11px;">SVG: {}</span>', obj.logo_svg_key)
        if obj.custom_logo_url:
            return format_html('<img src="{}" style="height:24px; object-fit:contain;" />', obj.custom_logo_url)
        return "—"
    logo_display.short_description = "Logotip"

    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;">✓ Faol</span>')
        return format_html('<span style="background:#f1f5f9; color:#94a3b8; padding:2px 8px; border-radius:10px; font-size:11px;">Nofaol</span>')
    status_badge.short_description = "Holati"


@admin.register(Startup)
class StartupAdmin(RichTextAdmin):
    list_display = ['startup_card', 'category_badge', 'stage_badge', 'batch', 'upvotes_badge', 'raised_badge']
    list_display_links = ['startup_card']
    search_fields = ['name', 'slug', 'category', 'problem']
    list_filter = ['category', 'stage', 'batch']
    prepopulated_fields = {'slug': ('name',)}

    def startup_card(self, obj):
        slug_display = f'<span style="color:#0284c7; font-family:monospace; font-size:10px;">/{obj.slug}</span>' if obj.slug else ''
        return format_html(
            '<div style="display:flex; align-items:center; gap:8px;">'
            '<span style="font-size:22px;">{}</span>'
            '<div><div style="font-weight:700; color:#0f172a; font-size:13px;">{}</div>'
            '<div style="font-size:11px; color:#64748b;">{}</div>'
            '<div>{}</div></div>'
            '</div>',
            obj.logo, obj.name, obj.tagline[:60], slug_display
        )
    startup_card.short_description = "Startap Nomi, Shiori va Slug"

    def category_badge(self, obj):
        return format_html(
            '<span style="background:#ede9fe; color:#5b21b6; padding:3px 8px; border-radius:6px; font-weight:600; font-size:11px;">{}</span>',
            obj.category
        )
    category_badge.short_description = "Kategoriya"

    def stage_badge(self, obj):
        return format_html(
            '<span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700; font-size:11px;">{}</span>',
            obj.stage
        )
    stage_badge.short_description = "Bosqich"

    def upvotes_badge(self, obj):
        return format_html(
            '<span style="background:#ffedd5; color:#c2410c; padding:3px 10px; border-radius:12px; font-weight:bold; font-size:12px;">🔥 {}</span>',
            obj.upvotes
        )
    upvotes_badge.short_description = "Ovozlar (Upvotes)"

    def raised_badge(self, obj):
        return format_html(
            '<span style="background:#ecfdf5; color:#047857; padding:3px 9px; border-radius:8px; font-weight:bold; font-size:11px;">💰 {}</span>',
            obj.raised_amount
        )
    raised_badge.short_description = "Investitsiya"


@admin.register(NewsArticle)
class NewsArticleAdmin(RichTextAdmin):
    list_display = ['thumbnail_preview', 'title_card', 'category_badge', 'author_info', 'stats_display', 'featured_badge']
    list_display_links = ['title_card']
    search_fields = ['title', 'slug', 'content', 'excerpt']
    list_filter = ['category', 'featured']
    prepopulated_fields = {'slug': ('title',)}

    def thumbnail_preview(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="width:55px; height:38px; object-fit:cover; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.12);" />',
                obj.cover_image
            )
        return "—"
    thumbnail_preview.short_description = "Rasm"

    def title_card(self, obj):
        slug_display = f'<div style="color:#0284c7; font-family:monospace; font-size:10px;">/{obj.slug}</div>' if obj.slug else ''
        return format_html(
            '<div style="font-weight:700; color:#0f172a; font-size:13px;">{}</div>'
            '<div style="font-size:11px; color:#64748b;">📅 {} &bull; ⏱️ {}</div>'
            '{}',
            obj.title[:65], obj.date_str, obj.read_time, slug_display
        )
    title_card.short_description = "Yangilik Sarlavhasi va Slug"

    def category_badge(self, obj):
        return format_html(
            '<span style="background:#f1f5f9; color:#334155; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:600;">{}</span>',
            obj.category
        )
    category_badge.short_description = "Kategoriya"

    def author_info(self, obj):
        return format_html(
            '<div style="font-weight:600;">{}</div><div style="font-size:10px; color:#64748b;">{}</div>',
            obj.author_name, obj.author_role
        )
    author_info.short_description = "Muallif"

    def stats_display(self, obj):
        return format_html(
            '<span style="font-size:11px; color:#475569;">👁️ {} &bull; ❤️ {}</span>',
            obj.views_count, obj.likes_count
        )
    stats_display.short_description = "Ko‘rish / Layk"

    def featured_badge(self, obj):
        if obj.featured:
            return format_html('<span style="background:#fef08a; color:#854d0e; padding:2px 7px; border-radius:6px; font-weight:bold; font-size:11px;">⭐ Asosiy</span>')
        return format_html('<span style="color:#94a3b8; font-size:11px;">Oddiy</span>')
    featured_badge.short_description = "Muhimlik"


@admin.register(Mentor)
class MentorAdmin(RichTextAdmin):
    list_display = ['avatar_preview', 'mentor_card', 'rating_stars', 'slots_display', 'telegram_link', 'status_badge']
    list_display_links = ['mentor_card']
    search_fields = ['name', 'organization', 'title']
    list_filter = ['is_active']

    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width:38px; height:38px; object-fit:cover; border-radius:50%; border:2px solid #cbd5e1;" />',
                obj.avatar
            )
        return "—"
    avatar_preview.short_description = "Avatar"

    def mentor_card(self, obj):
        return format_html(
            '<div style="font-weight:700; color:#0f172a;">{}</div>'
            '<div style="font-size:11px; color:#64748b;">{} &bull; <span style="color:#0284c7;">{}</span></div>',
            obj.name, obj.title, obj.organization
        )
    mentor_card.short_description = "Mentor F.I.Sh / Tashkilot"

    def rating_stars(self, obj):
        return format_html(
            '<span style="background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:6px; font-weight:bold; font-size:12px;">⭐ {}</span> '
            '<span style="font-size:11px; color:#64748b;">({} taqriz)</span>',
            obj.rating, obj.reviews_count
        )
    rating_stars.short_description = "Reyting"

    def slots_display(self, obj):
        slots_str = ", ".join(obj.available_slots) if obj.available_slots else "Band"
        return format_html('<span style="font-size:11px; color:#475569;">🕒 {}</span>', slots_str)
    slots_display.short_description = "Qabul Vaqtlari"

    def telegram_link(self, obj):
        if obj.telegram:
            clean = obj.telegram.replace('@', '')
            return format_html(
                '<a href="https://t.me/{}" target="_blank" style="color:#0284c7; font-weight:600; text-decoration:none;">💬 @{} ↗</a>',
                clean, clean
            )
        return "—"
    telegram_link.short_description = "Telegram"

    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;">✓ Faol</span>')
        return format_html('<span style="background:#f1f5f9; color:#94a3b8; padding:2px 8px; border-radius:10px; font-size:11px;">Ta’tilda</span>')
    status_badge.short_description = "Holati"


@admin.register(CoFounderVacancy)
class CoFounderVacancyAdmin(RichTextAdmin):
    list_display = ['role_card', 'category_badge', 'commitment_badge', 'faculty', 'telegram_link', 'status_badge']
    list_display_links = ['role_card']
    search_fields = ['role_title', 'startup_name', 'description']
    list_filter = ['category', 'commitment_type', 'is_open']

    def role_card(self, obj):
        return format_html(
            '<div style="font-weight:700; color:#0f172a;">{}</div>'
            '<div style="font-size:11px; color:#64748b;">{} <strong>{}</strong></div>',
            obj.role_title, obj.startup_logo, obj.startup_name
        )
    role_card.short_description = "Mutaxassislik / Startap"

    def category_badge(self, obj):
        return format_html(
            '<span style="background:#f1f5f9; color:#334155; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:600;">{}</span>',
            obj.category
        )
    category_badge.short_description = "Kategoriya"

    def commitment_badge(self, obj):
        return format_html(
            '<span style="background:#e0f2fe; color:#0369a1; padding:2px 7px; border-radius:6px; font-size:11px; font-weight:600;">{}</span>',
            obj.commitment_type
        )
    commitment_badge.short_description = "Grafik"

    def telegram_link(self, obj):
        clean = obj.contact_telegram.replace('@', '')
        return format_html(
            '<a href="https://t.me/{}" target="_blank" style="color:#0284c7; font-weight:600; text-decoration:none;">💬 @{} ↗</a>',
            clean, clean
        )
    telegram_link.short_description = "Telegram Aloqa"

    def status_badge(self, obj):
        if obj.is_open:
            return format_html('<span style="background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;">✓ Ochiq</span>')
        return format_html('<span style="background:#fee2e2; color:#991b1b; padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;">✕ Yopilgan</span>')
    status_badge.short_description = "Holati"


@admin.register(Story)
class StoryAdmin(RichTextAdmin):
    list_display = ['author_card', 'title_card', 'likes_badge', 'date_str']
    list_display_links = ['title_card']
    search_fields = ['title', 'slug', 'startup_name', 'author_name', 'content']
    prepopulated_fields = {'slug': ('title',)}

    def author_card(self, obj):
        return format_html(
            '<div style="display:flex; align-items:center; gap:8px;">'
            '<img src="{}" style="width:34px; height:34px; object-fit:cover; border-radius:50%; border:1px solid #cbd5e1;" />'
            '<div><div style="font-weight:600; color:#0f172a;">{}</div>'
            '<div style="font-size:10px; color:#64748b;">{}</div></div>'
            '</div>',
            obj.author_avatar, obj.author_name, obj.startup_name
        )
    author_card.short_description = "Asoschi va Startap"

    def title_card(self, obj):
        slug_display = f'<div style="color:#0284c7; font-family:monospace; font-size:10px;">/{obj.slug}</div>' if obj.slug else ''
        return format_html(
            '<div style="font-weight:700; color:#0f172a; font-size:13px;">{}</div>'
            '<div style="font-size:11px; color:#64748b;">⏱️ {} o‘qish</div>'
            '{}',
            obj.title[:65], obj.read_time, slug_display
        )
    title_card.short_description = "Hikoya Sarlavhasi va Slug"

    def likes_badge(self, obj):
        return format_html(
            '<span style="background:#ffe4e6; color:#be123c; font-weight:bold; padding:2px 8px; border-radius:10px; font-size:11px;">❤️ {}</span>',
            obj.likes
        )
    likes_badge.short_description = "Layklar"


@admin.register(PlaybookGuide)
class PlaybookGuideAdmin(RichTextAdmin):
    list_display = ['order', 'category_badge', 'guide_card', 'read_time', 'status_badge']
    list_display_links = ['guide_card']
    list_editable = ['order']
    search_fields = ['title', 'slug', 'summary', 'key_takeaway']
    list_filter = ['category', 'is_active']
    prepopulated_fields = {'slug': ('title',)}

    def category_badge(self, obj):
        return format_html(
            '<span style="background:#f1f5f9; color:#0f172a; padding:2px 7px; border-radius:4px; font-weight:700; font-size:11px;">{}</span>',
            obj.get_category_display()
        )
    category_badge.short_description = "Bo‘lim"

    def guide_card(self, obj):
        slug_display = f'<div style="color:#0284c7; font-family:monospace; font-size:10px;">/{obj.slug}</div>' if obj.slug else ''
        return format_html(
            '<div style="font-weight:700; color:#0f172a; font-size:13px;">{}</div>'
            '<div style="font-size:11px; color:#64748b;">✍️ {} ({})</div>'
            '{}',
            obj.title, obj.author, obj.author_role, slug_display
        )
    guide_card.short_description = "Qo‘llanma Sarlavhasi / Muallif"

    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="background:#d1fae5; color:#065f46; padding:2px 8px; border-radius:10px; font-weight:700; font-size:11px;">✓ Faol</span>')
        return format_html('<span style="background:#f1f5f9; color:#94a3b8; padding:2px 8px; border-radius:10px; font-size:11px;">Yashirilgan</span>')
    status_badge.short_description = "Holati"
