from django.contrib import admin
from .models import Faculty, News, Partner, StaffMember, Page, Investor


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('name_uz', 'slug', 'is_active')
    prepopulated_fields = {'slug': ('name_uz',)}


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title_uz', 'slug', 'is_published', 'published_at')
    list_filter = ('is_published',)
    prepopulated_fields = {'slug': ('title_uz',)}


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_published', 'order')


@admin.register(StaffMember)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('name', 'title_uz', 'is_published', 'order')


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title_uz', 'slug', 'is_published')


@admin.register(Investor)
class InvestorAdmin(admin.ModelAdmin):
    list_display = ('name', 'org', 'title_uz', 'is_published', 'order')
