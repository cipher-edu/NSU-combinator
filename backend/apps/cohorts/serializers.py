from rest_framework import serializers
from .models import Season, Track


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ('id', 'slug', 'name_uz', 'name_en')


class SeasonPublicSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True, read_only=True)

    class Meta:
        model = Season
        fields = (
            'id', 'slug', 'name_uz', 'name_en', 'status', 'is_current',
            'program_weeks', 'apply_opens_at', 'apply_closes_at',
            'program_starts_at', 'demo_day_at', 'stats_override',
            'curriculum', 'tracks',
        )
