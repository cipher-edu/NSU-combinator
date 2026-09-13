from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import (
    HeroSlide, SectionConfig, TopTicker, PlatformMetric, PartnerLogo, Startup,
    NewsArticle, Mentor, CoFounderVacancy, Story, PlaybookGuide
)
from .serializers import (
    HeroSlideSerializer,
    SectionConfigSerializer,
    TopTickerSerializer,
    PlatformMetricSerializer,
    PartnerLogoSerializer,
    StartupSerializer,
    NewsArticleSerializer,
    MentorSerializer,
    CoFounderVacancySerializer,
    StorySerializer,
    PlaybookGuideSerializer
)

class FullLayoutAPIView(APIView):
    """
    1 ta yagona tezkor so‘rov orqali butun frontend ko‘rinishini uzatuvchi Server-Driven UI API.
    React dastlab yuklanganda ushbu API dan barcha slaydlar, bo‘limlar va sozlamalarni oladi.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        slides = HeroSlide.objects.filter(is_active=True).order_by('order')
        sections = SectionConfig.objects.all().order_by('order')
        ticker = TopTicker.objects.filter(is_active=True).first()
        metrics = PlatformMetric.objects.all().order_by('order')
        partners = PartnerLogo.objects.filter(is_active=True).order_by('order')
        news = NewsArticle.objects.all().order_by('-created_at')[:6]
        mentors = Mentor.objects.filter(is_active=True).order_by('-rating')
        vacancies = CoFounderVacancy.objects.filter(is_open=True).order_by('-created_at')
        stories = Story.objects.all().order_by('-created_at')
        guides = PlaybookGuide.objects.filter(is_active=True).order_by('order')

        return Response({
            'ticker': TopTickerSerializer(ticker).data if ticker else None,
            'slides': HeroSlideSerializer(slides, many=True).data,
            'sections': SectionConfigSerializer(sections, many=True).data,
            'metrics': PlatformMetricSerializer(metrics, many=True).data,
            'partners': PartnerLogoSerializer(partners, many=True).data,
            'news': NewsArticleSerializer(news, many=True).data,
            'mentors': MentorSerializer(mentors, many=True).data,
            'vacancies': CoFounderVacancySerializer(vacancies, many=True).data,
            'stories': StorySerializer(stories, many=True).data,
            'guides': PlaybookGuideSerializer(guides, many=True).data,
        })


class HeroSlideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroSlide.objects.filter(is_active=True).order_by('order')
    serializer_class = HeroSlideSerializer
    permission_classes = [permissions.AllowAny]


class SectionConfigViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SectionConfig.objects.all().order_by('order')
    serializer_class = SectionConfigSerializer
    permission_classes = [permissions.AllowAny]


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsArticle.objects.all().order_by('-created_at')
    serializer_class = NewsArticleSerializer
    permission_classes = [permissions.AllowAny]


class MentorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Mentor.objects.filter(is_active=True).order_by('-rating')
    serializer_class = MentorSerializer
    permission_classes = [permissions.AllowAny]


class CoFounderVacancyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CoFounderVacancy.objects.filter(is_open=True).order_by('-created_at')
    serializer_class = CoFounderVacancySerializer
    permission_classes = [permissions.AllowAny]


class StoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Story.objects.all().order_by('-created_at')
    serializer_class = StorySerializer
    permission_classes = [permissions.AllowAny]


class PlaybookGuideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlaybookGuide.objects.filter(is_active=True).order_by('order')
    serializer_class = PlaybookGuideSerializer
    permission_classes = [permissions.AllowAny]
