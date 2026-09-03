from django.contrib import admin
from .models import StartupPortfolio


@admin.register(StartupPortfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('slug', 'team', 'season', 'is_published')
    list_filter = ('is_published', 'season')
    prepopulated_fields = {'slug': ('summary_uz',)}
