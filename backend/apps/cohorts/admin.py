from django.contrib import admin
from .models import Season, Track, SeasonEvent


class TrackInline(admin.TabularInline):
    model = Track
    extra = 0


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ('name_uz', 'slug', 'status', 'is_current', 'apply_closes_at')
    list_filter = ('status', 'is_current')
    inlines = [TrackInline]


@admin.register(SeasonEvent)
class SeasonEventAdmin(admin.ModelAdmin):
    list_display = ('season', 'from_status', 'to_status', 'actor', 'created_at')
    readonly_fields = ('season', 'from_status', 'to_status', 'actor', 'note', 'payload', 'created_at')
