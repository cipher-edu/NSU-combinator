from django.contrib import admin
from .models import Application, ApplicationEvent


class EventInline(admin.TabularInline):
    model = ApplicationEvent
    extra = 0
    readonly_fields = ('from_status', 'to_status', 'actor', 'note', 'created_at')


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('team', 'season', 'track', 'status', 'submitted_at')
    list_filter = ('status', 'season', 'track')
    inlines = [EventInline]
    search_fields = ('team__name',)
