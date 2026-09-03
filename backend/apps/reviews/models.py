from django.conf import settings
from django.db import models
from core.models import BaseModel


class ReviewAssignment(BaseModel):
    application = models.ForeignKey(
        'applications.Application', on_delete=models.CASCADE, related_name='assignments'
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='review_assignments'
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='review_assignments_made'
    )
    due_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'review_assignments'
        constraints = [
            models.UniqueConstraint(fields=['application', 'reviewer'], name='uq_review_assignment'),
        ]


class ReviewScore(BaseModel):
    assignment = models.OneToOneField(
        ReviewAssignment, on_delete=models.CASCADE, related_name='score'
    )
    application = models.ForeignKey(
        'applications.Application', on_delete=models.CASCADE, related_name='scores'
    )
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    team_score = models.PositiveSmallIntegerField()
    problem_score = models.PositiveSmallIntegerField()
    feasibility_score = models.PositiveSmallIntegerField()
    university_fit_score = models.PositiveSmallIntegerField()
    traction_score = models.PositiveSmallIntegerField(null=True, blank=True)
    comment = models.TextField(blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'review_scores'
        constraints = [
            models.UniqueConstraint(fields=['application', 'reviewer'], name='uq_review_score'),
            models.CheckConstraint(
                check=models.Q(team_score__gte=1) & models.Q(team_score__lte=5), name='ck_team_score'
            ),
            models.CheckConstraint(
                check=models.Q(problem_score__gte=1) & models.Q(problem_score__lte=5), name='ck_problem_score'
            ),
            models.CheckConstraint(
                check=models.Q(feasibility_score__gte=1) & models.Q(feasibility_score__lte=5),
                name='ck_feasibility_score',
            ),
            models.CheckConstraint(
                check=models.Q(university_fit_score__gte=1) & models.Q(university_fit_score__lte=5),
                name='ck_fit_score',
            ),
            models.CheckConstraint(
                check=models.Q(traction_score__isnull=True)
                | (models.Q(traction_score__gte=1) & models.Q(traction_score__lte=5)),
                name='ck_traction_score',
            ),
        ]

    def weighted(self, weights: dict) -> float:
        parts = {
            'team': self.team_score,
            'problem': self.problem_score,
            'feasibility': self.feasibility_score,
            'university_fit': self.university_fit_score,
        }
        if self.traction_score is not None:
            parts['traction'] = self.traction_score
        present = {k: v for k, v in parts.items() if k in weights}
        total_w = sum(weights[k] for k in present)
        if not total_w:
            return 0.0
        return sum(present[k] * (weights[k] / total_w) for k in present)


class InterviewEvent(BaseModel):
    application = models.ForeignKey(
        'applications.Application', on_delete=models.CASCADE, related_name='interviews'
    )
    starts_at = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)

    class Meta:
        db_table = 'interview_events'
        ordering = ['-created_at']
