from rest_framework import serializers
from apps.applications.serializers import ApplicationSerializer
from .models import ReviewAssignment, ReviewScore, InterviewEvent


class ReviewScoreSerializer(serializers.ModelSerializer):
    weighted_average = serializers.SerializerMethodField()

    class Meta:
        model = ReviewScore
        fields = (
            'id', 'assignment', 'application', 'reviewer',
            'team_score', 'problem_score', 'feasibility_score',
            'university_fit_score', 'traction_score', 'comment',
            'submitted_at', 'weighted_average',
        )
        read_only_fields = ('id', 'assignment', 'application', 'reviewer', 'submitted_at')

    def get_weighted_average(self, obj):
        weights = obj.application.season.scoring_weights or {}
        return round(obj.weighted(weights), 3)


class ReviewAssignmentSerializer(serializers.ModelSerializer):
    application_detail = ApplicationSerializer(source='application', read_only=True)
    reviewer_email = serializers.EmailField(source='reviewer.email', read_only=True)
    my_score = serializers.SerializerMethodField()

    class Meta:
        model = ReviewAssignment
        fields = (
            'id', 'application', 'application_detail', 'reviewer', 'reviewer_email',
            'assigned_by', 'due_at', 'my_score',
        )
        read_only_fields = ('id', 'assigned_by')

    def get_my_score(self, obj):
        try:
            score = obj.score
        except ReviewScore.DoesNotExist:
            return None
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and (user == obj.reviewer or user.role in ('admin', 'superadmin')):
            return ReviewScoreSerializer(score).data
        return {'submitted': bool(score.submitted_at)}


class InterviewEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewEvent
        fields = ('id', 'starts_at', 'location', 'notes', 'cancelled_at', 'created_at')
        read_only_fields = ('id', 'cancelled_at', 'created_at')
