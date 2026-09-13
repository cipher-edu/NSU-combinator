from rest_framework import serializers
from .models import (
    HeroSlide, SectionConfig, TopTicker, PlatformMetric, PartnerLogo, Startup,
    NewsArticle, Mentor, CoFounderVacancy, Story, PlaybookGuide
)

class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = '__all__'


class SectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionConfig
        fields = '__all__'


class TopTickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopTicker
        fields = '__all__'


class PlatformMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformMetric
        fields = '__all__'


class PartnerLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerLogo
        fields = '__all__'


class StartupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Startup
        fields = '__all__'


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = '__all__'


class MentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = '__all__'


class CoFounderVacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = CoFounderVacancy
        fields = '__all__'


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'


class PlaybookGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaybookGuide
        fields = '__all__'
