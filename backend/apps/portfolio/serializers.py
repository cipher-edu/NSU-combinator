from rest_framework import serializers
from .models import StartupPortfolio


class PortfolioSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    logo = serializers.ImageField(source='team.logo', read_only=True)
    season_slug = serializers.CharField(source='season.slug', read_only=True)
    track_slug = serializers.CharField(source='track.slug', read_only=True)

    class Meta:
        model = StartupPortfolio
        fields = (
            'id', 'slug', 'team_name', 'logo', 'season_slug', 'track_slug',
            'summary_uz', 'summary_en', 'website', 'traction_public',
        )
