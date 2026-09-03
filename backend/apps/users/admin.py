from django.contrib import admin
from .models import User, UserCapability


class CapInline(admin.TabularInline):
    model = UserCapability
    extra = 0


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'affiliation', 'telegram_user_id', 'is_student_verified', 'is_active')
    list_filter = ('role', 'affiliation', 'is_student_verified', 'is_active')
    search_fields = ('email', 'name', 'student_id')
    ordering = ('email',)
    inlines = [CapInline]
    filter_horizontal = ('groups', 'user_permissions')
