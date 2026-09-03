from django.contrib import admin
from .models import Broadcast, Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'email', 'channel', 'title', 'sent_at', 'created_at')
    list_filter = ('channel',)
    search_fields = ('email', 'title')
    readonly_fields = ('user', 'email', 'channel', 'title', 'body', 'sent_at', 'error', 'broadcast', 'created_at')


@admin.register(Broadcast)
class BroadcastAdmin(admin.ModelAdmin):
    list_display = ('title', 'audience', 'sent_at', 'sent_ok', 'sent_fail', 'created_by')
    list_filter = ('audience',)
