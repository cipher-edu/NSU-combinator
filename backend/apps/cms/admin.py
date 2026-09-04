from django.contrib import admin
from django.utils.html import format_html
from .models import Faculty, News, Partner, StaffMember, Page, Investor, GalleryImage


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


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('thumb', 'slug', 'caption_uz', 'placement', 'show_in_gallery', 'order', 'is_published')
    list_display_links = ('thumb', 'slug')
    list_editable = ('order', 'is_published', 'show_in_gallery')
    list_filter = ('is_published', 'show_in_gallery', 'placement')
    search_fields = ('slug', 'caption_uz', 'caption_en')
    prepopulated_fields = {'slug': ('caption_uz',)}
    readonly_fields = ('thumb',)

    def thumb(self, obj):
        if not obj.image:
            return '—'
        return format_html(
            '<img src="{}" alt="" style="height:52px;width:72px;object-fit:cover;border-radius:6px" />',
            obj.image.url,
        )

    thumb.short_description = 'Rasm'
