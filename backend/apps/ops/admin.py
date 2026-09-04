from django.contrib import admin
from .models import Campaign, Lead, OpsTask, ProgramWeek, KnowledgeArticle


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'channel', 'clicks', 'is_active')
    search_fields = ('name', 'code')


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'status', 'source', 'created_at')
    list_filter = ('status', 'source')
    search_fields = ('email', 'name')


@admin.register(OpsTask)
class OpsTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'area', 'due_at')
    list_filter = ('status', 'area')


@admin.register(ProgramWeek)
class ProgramWeekAdmin(admin.ModelAdmin):
    list_display = ('season', 'week', 'title_uz')


@admin.register(KnowledgeArticle)
class KnowledgeAdmin(admin.ModelAdmin):
    list_display = ('title_uz', 'slug', 'audience', 'is_published')
