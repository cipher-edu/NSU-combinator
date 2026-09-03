from django.contrib import admin
from .models import Team, TeamMembership, TeamInvite


class MembershipInline(admin.TabularInline):
    model = TeamMembership
    extra = 0


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'season', 'status')
    list_filter = ('status', 'season')
    inlines = [MembershipInline]


@admin.register(TeamInvite)
class TeamInviteAdmin(admin.ModelAdmin):
    list_display = ('team', 'email', 'expires_at', 'accepted_at')
