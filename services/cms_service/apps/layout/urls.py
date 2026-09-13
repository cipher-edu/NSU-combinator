from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FullLayoutAPIView,
    HeroSlideViewSet,
    SectionConfigViewSet,
    NewsArticleViewSet,
    MentorViewSet,
    CoFounderVacancyViewSet,
    StoryViewSet,
    PlaybookGuideViewSet
)

router = DefaultRouter()
router.register(r'slides', HeroSlideViewSet, basename='hero-slide')
router.register(r'sections', SectionConfigViewSet, basename='section-config')
router.register(r'news', NewsArticleViewSet, basename='news-article')
router.register(r'mentors', MentorViewSet, basename='mentor')
router.register(r'vacancies', CoFounderVacancyViewSet, basename='vacancy')
router.register(r'stories', StoryViewSet, basename='story')
router.register(r'guides', PlaybookGuideViewSet, basename='playbook-guide')

urlpatterns = [
    path('layout/', FullLayoutAPIView.as_view(), name='full-layout'),
    path('', include(router.urls)),
]
