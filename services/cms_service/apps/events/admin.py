from django.contrib import admin
from django.utils.html import format_html
from django.db import models
from ckeditor.widgets import CKEditorWidget
from .models import Event, Ticket

class RichTextAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget(config_name='default')},
    }
    class Media:
        css = {
            'all': ('admin/css/custom_ckeditor.css',)
        }

class TicketInline(admin.TabularInline):
    model = Ticket
    extra = 0
    readonly_fields = ['ticket_id', 'participant_name', 'phone', 'telegram', 'is_attended', 'created_at']

@admin.register(Event)
class EventAdmin(RichTextAdmin):
    list_display = [
        'title_display',
        'type_badge',
        'mode_badge',
        'location',
        'prize_badge',
        'registration_status',
        'tickets_count_badge'
    ]
    list_filter = ['type', 'mode', 'is_registration_open']
    search_fields = ['title', 'slug', 'location', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [TicketInline]

    def title_display(self, obj):
        slug_display = f'<div style="color:#0284c7; font-family:monospace; font-size:10px;">/{obj.slug}</div>' if obj.slug else ''
        return format_html(
            '<div style="font-weight:700; color:#0f172a; font-size:13px;">{}</div>'
            '<div style="font-size:11px; color:#64748b; margin-top:2px;">📅 {} &bull; ⏰ {}</div>'
            '{}',
            obj.title, obj.date, obj.time, slug_display
        )
    title_display.short_description = "Tadbir / Hakaton Nomi va Slug"

    def type_badge(self, obj):
        colors = {
            'Hakaton': ('#fef3c7', '#b45309'),
            'Seminar': ('#e0e7ff', '#3730a3'),
            'Demo Day': ('#ecfdf5', '#047857'),
            'Meetup': ('#e0f2fe', '#0369a1'),
            'Vebinar': ('#f3e8ff', '#6b21a8'),
        }
        bg, text = colors.get(obj.type, ('#f1f5f9', '#475569'))
        return format_html(
            '<span style="background:{}; color:{}; padding:3px 9px; border-radius:10px; font-weight:700; font-size:11px;">{}</span>',
            bg, text, obj.type
        )
    type_badge.short_description = "Turi"

    def mode_badge(self, obj):
        return format_html(
            '<span style="background:#f1f5f9; color:#334155; padding:2px 7px; border-radius:6px; font-size:11px; font-weight:600;">{}</span>',
            obj.mode
        )
    mode_badge.short_description = "Format"

    def prize_badge(self, obj):
        if obj.prize:
            return format_html(
                '<span style="background:#fffbeb; color:#92400e; padding:3px 8px; border-radius:6px; font-weight:bold; font-size:11px; border:1px solid #fde68a;">🏆 {}</span>',
                obj.prize
            )
        return format_html('<span style="color:#94a3b8; font-size:11px;">—</span>')
    prize_badge.short_description = "Mukofot Jamg‘armasi"

    def registration_status(self, obj):
        if obj.is_registration_open:
            return format_html(
                '<span style="background:#d1fae5; color:#065f46; padding:3px 9px; border-radius:10px; font-weight:700; font-size:11px;">✓ Ochiq</span>'
            )
        return format_html(
            '<span style="background:#fee2e2; color:#991b1b; padding:3px 9px; border-radius:10px; font-weight:700; font-size:11px;">✕ Yopilgan</span>'
        )
    registration_status.short_description = "Qabul Holati"

    def tickets_count_badge(self, obj):
        count = obj.tickets.count()
        return format_html(
            '<span style="background:#e0f2fe; color:#0284c7; font-weight:bold; padding:3px 8px; border-radius:10px; font-size:11px;">🎟️ {} ta</span>',
            count
        )
    tickets_count_badge.short_description = "Chiptalar Soni"


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = [
        'ticket_code_badge',
        'participant_card',
        'event_title_display',
        'faculty',
        'attendance_badge',
        'created_at_display'
    ]
    list_filter = ['is_attended', 'event', 'faculty']
    search_fields = ['ticket_id', 'participant_name', 'phone', 'telegram']

    def ticket_code_badge(self, obj):
        return format_html(
            '<code style="font-family:monospace; background:#f1f5f9; padding:4px 8px; border-radius:5px; font-weight:bold; color:#0f172a; border:1px solid #cbd5e1;">{}</code>',
            obj.ticket_id
        )
    ticket_code_badge.short_description = "Chipta Kodi"

    def participant_card(self, obj):
        clean_tg = obj.telegram.replace('@', '')
        return format_html(
            '<div style="font-weight:600; color:#1e293b;">{}</div>'
            '<div style="font-size:11px;">'
            '<a href="tel:{}" style="color:#2563eb; text-decoration:none; margin-right:6px;">📞 {}</a>'
            '<a href="https://t.me/{}" target="_blank" style="color:#0284c7; text-decoration:none;">💬 @{}</a>'
            '</div>',
            obj.participant_name, obj.phone, obj.phone, clean_tg, clean_tg
        )
    participant_card.short_description = "Qatnashuvchi"

    def event_title_display(self, obj):
        return format_html('<strong>{}</strong>', obj.event.title)
    event_title_display.short_description = "Tadbir"

    def attendance_badge(self, obj):
        if obj.is_attended:
            return format_html(
                '<span style="background:#d1fae5; color:#065f46; padding:3px 8px; border-radius:10px; font-weight:bold; font-size:11px;">✓ Skanerlangan (Kelgan)</span>'
            )
        return format_html(
            '<span style="background:#f1f5f9; color:#64748b; padding:3px 8px; border-radius:10px; font-size:11px;">⏳ Kutilmoqda</span>'
        )
    attendance_badge.short_description = "Davomat (QR Tekshiruv)"

    def created_at_display(self, obj):
        return obj.created_at.strftime('%d.%m.%Y %H:%M')
    created_at_display.short_description = "Ro‘yxatdan O‘tgan Vaqti"
