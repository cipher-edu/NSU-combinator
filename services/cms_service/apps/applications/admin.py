from django.contrib import admin
from django.utils.html import format_html
from django.db import models
from ckeditor.widgets import CKEditorWidget
from .models import Application, ApplicationEvaluation

admin.site.site_header = "NavDU Inkubatsiya & Akseleratsiya Markazi — Boshqaruv Paneli"
admin.site.site_title = "NavDU Startap Admin"
admin.site.index_title = "Platforma Kontenti va Foydalanuvchilarni Boshqarish"

class RichTextAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget(config_name='default')},
    }
    class Media:
        css = {
            'all': ('admin/css/custom_ckeditor.css',)
        }

class ApplicationEvaluationInline(admin.TabularInline):
    model = ApplicationEvaluation
    extra = 1

@admin.register(Application)
class ApplicationAdmin(RichTextAdmin):
    list_display = [
        'id_badge',
        'project_info',
        'founder_card',
        'status_badge',
        'verification_status',
        'pitch_deck_button',
        'created_at_display'
    ]
    list_filter = ['status', 'is_verified', 'category', 'stage', 'faculty']
    search_fields = ['id', 'project_name', 'founder_name', 'phone', 'telegram_username']
    readonly_fields = ['id', 'created_at', 'updated_at', 'otp_code']
    inlines = [ApplicationEvaluationInline]

    fieldsets = (
        ("Ariza Holati va Tasdiq", {
            "fields": ("id", "status", "feedback", "is_verified", "otp_code", "created_at")
        }),
        ("Asoschi va Jamoa Ma’lumotlari", {
            "fields": ("founder_name", "phone", "email", "telegram_username", "telegram_chat_id", "faculty", "course", "team_size")
        }),
        ("Startap G‘oyasi va Bozor", {
            "fields": ("project_name", "category", "stage", "problem", "solution", "target_market", "deck_url")
        }),
    )

    actions = ['mark_accepted', 'mark_under_review', 'mark_interview', 'mark_rejected']

    @admin.action(description="Tanlangan arizalarni 'Qabul qilindi' statusiga o‘tkazish")
    def mark_accepted(self, request, queryset):
        queryset.update(status='Qabul qilindi')

    @admin.action(description="Tanlangan arizalarni 'Ko‘rib chiqilmoqda' statusiga o‘tkazish")
    def mark_under_review(self, request, queryset):
        queryset.update(status='Ko‘rib chiqilmoqda')

    @admin.action(description="Tanlangan arizalarni 'Intervyuga chaqirildi' statusiga o‘tkazish")
    def mark_interview(self, request, queryset):
        queryset.update(status='Intervyuga chaqirildi')

    @admin.action(description="Tanlangan arizalarni 'Rad etildi' statusiga o‘tkazish")
    def mark_rejected(self, request, queryset):
        queryset.update(status='Rad etildi')

    def id_badge(self, obj):
        return format_html(
            '<span style="font-family:monospace; font-weight:bold; background:#f1f5f9; padding:3px 7px; border-radius:4px; color:#1e293b; border:1px solid #cbd5e1;">{}</span>',
            obj.id
        )
    id_badge.short_description = "Ariza ID"

    def project_info(self, obj):
        stage_colors = {
            'Idea': '#e0f2fe',
            'MVP': '#dbeafe',
            'Traction': '#dcfce7',
            'Scaling': '#fef3c7'
        }
        stage_bg = stage_colors.get(obj.stage, '#f1f5f9')
        return format_html(
            '<div style="font-weight:700; color:#0f172a; font-size:13px;">{}</div>'
            '<div style="display:flex; gap:4px; margin-top:3px;">'
            '<span style="background:#f1f5f9; color:#475569; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600;">{}</span>'
            '<span style="background:{}; color:#1e293b; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700;">{}</span>'
            '</div>',
            obj.project_name, obj.category, stage_bg, obj.stage
        )
    project_info.short_description = "Startap Loyihasi"

    def founder_card(self, obj):
        clean_tg = obj.telegram_username.replace('@', '')
        return format_html(
            '<div style="font-weight:600; color:#1e293b;">{}</div>'
            '<div style="font-size:11px; margin-top:2px;">'
            '<a href="tel:{}" style="color:#2563eb; text-decoration:none; margin-right:6px;">📞 {}</a>'
            '<a href="https://t.me/{}" target="_blank" style="color:#0284c7; text-decoration:none; font-weight:600;">💬 @{}</a>'
            '</div>',
            obj.founder_name, obj.phone, obj.phone, clean_tg, clean_tg
        )
    founder_card.short_description = "Asoschi / Aloqa"

    def status_badge(self, obj):
        colors = {
            'Kutilmoqda': ('#fef3c7', '#92400e', '🟡'),
            'Ko‘rib chiqilmoqda': ('#dbeafe', '#1e40af', '🔵'),
            'Intervyuga chaqirildi': ('#f3e8ff', '#6b21a8', '🟣'),
            'Qabul qilindi': ('#d1fae5', '#065f46', '🟢'),
            'Rad etildi': ('#fee2e2', '#991b1b', '🔴'),
        }
        bg, text, icon = colors.get(obj.status, ('#f1f5f9', '#475569', '⚪'))
        return format_html(
            '<span style="background:{}; color:{}; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:11px; display:inline-block; white-space:nowrap;">{} {}</span>',
            bg, text, icon, obj.status
        )
    status_badge.short_description = "Holati"

    def verification_status(self, obj):
        if obj.is_verified:
            return format_html(
                '<span style="color:#059669; font-weight:700; font-size:11px; background:#ecfdf5; padding:3px 8px; border-radius:10px; border:1px solid #a7f3d0;">✓ Tasdiqlangan</span>'
            )
        return format_html(
            '<span style="color:#d97706; font-size:11px; background:#fffbeb; padding:3px 8px; border-radius:10px; border:1px solid #fde68a;">⏳ OTP Kutilmoqda</span>'
        )
    verification_status.short_description = "Telegram OTP"

    def pitch_deck_button(self, obj):
        if obj.deck_url:
            return format_html(
                '<a href="{}" target="_blank" style="background:#0284c7; color:#fff; padding:3px 8px; border-radius:6px; font-size:11px; text-decoration:none; font-weight:600; white-space:nowrap; display:inline-block;">📄 Deck ↗</a>',
                obj.deck_url
            )
        return format_html('<span style="color:#94a3b8; font-size:11px;">Mavjud emas</span>')
    pitch_deck_button.short_description = "Pitch Deck"

    def created_at_display(self, obj):
        return obj.created_at.strftime('%d.%m.%Y %H:%M')
    created_at_display.short_description = "Topshirilgan Vaqti"


@admin.register(ApplicationEvaluation)
class ApplicationEvaluationAdmin(RichTextAdmin):
    list_display = ['application_badge', 'evaluator_name', 'scores_display', 'total_score_badge', 'created_at']
    list_filter = ['evaluator_name']
    search_fields = ['application__project_name', 'evaluator_name']

    def application_badge(self, obj):
        return format_html(
            '<strong>{}</strong> <span style="font-size:10px; color:#64748b;">(#{})</span>',
            obj.application.project_name, obj.application.id
        )
    application_badge.short_description = "Ariza"

    def scores_display(self, obj):
        return format_html(
            '<span style="font-size:11px;">G‘oya: <b>{}/10</b> &bull; Jamoa: <b>{}/10</b> &bull; Bozor: <b>{}/10</b></span>',
            obj.idea_score, obj.team_score, obj.market_score
        )
    scores_display.short_description = "Baholar"

    def total_score_badge(self, obj):
        score = obj.total_score()
        return format_html(
            '<span style="background:#fef08a; color:#854d0e; font-weight:bold; padding:3px 9px; border-radius:12px; font-size:12px;">⭐ {} / 30</span>',
            score
        )
    total_score_badge.short_description = "Jami Ball"
