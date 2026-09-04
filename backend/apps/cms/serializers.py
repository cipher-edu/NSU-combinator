from rest_framework import serializers
from core.markdown import sanitize_html
from .models import Faculty, News, Partner, StaffMember, Page, Investor, GalleryImage


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ('id', 'slug', 'name_uz', 'name_en')


class NewsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ('id', 'slug', 'title_uz', 'title_en', 'cover', 'published_at', 'youtube_url')


class NewsDetailSerializer(NewsListSerializer):
    body_uz = serializers.SerializerMethodField()
    body_en = serializers.SerializerMethodField()

    class Meta(NewsListSerializer.Meta):
        fields = NewsListSerializer.Meta.fields + ('body_uz', 'body_en')

    def get_body_uz(self, obj):
        return sanitize_html(obj.body_uz)

    def get_body_en(self, obj):
        return sanitize_html(obj.body_en)


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ('id', 'slug', 'name', 'logo', 'url')


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffMember
        fields = ('id', 'slug', 'name', 'title_uz', 'title_en', 'photo', 'linkedin')


class InvestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investor
        fields = ('id', 'slug', 'name', 'title_uz', 'title_en', 'org', 'photo')


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = (
            'id',
            'slug',
            'image',
            'caption_uz',
            'caption_en',
            'placement',
            'show_in_gallery',
            'order',
        )


class PageSerializer(serializers.ModelSerializer):
    body_uz = serializers.SerializerMethodField()
    body_en = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ('slug', 'title_uz', 'title_en', 'body_uz', 'body_en')

    def get_body_uz(self, obj):
        return sanitize_html(obj.body_uz)

    def get_body_en(self, obj):
        return sanitize_html(obj.body_en)
