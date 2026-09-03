from django.contrib import admin
from .models import ReviewAssignment, ReviewScore, InterviewEvent


@admin.register(ReviewAssignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('application', 'reviewer', 'due_at')


@admin.register(ReviewScore)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('application', 'reviewer', 'team_score', 'submitted_at')
    readonly_fields = (
        'assignment', 'application', 'reviewer', 'team_score', 'problem_score',
        'feasibility_score', 'university_fit_score', 'traction_score', 'comment', 'submitted_at',
    )


@admin.register(InterviewEvent)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('application', 'starts_at', 'cancelled_at')
