from rest_framework import generics, permissions
from .models import Faculty, News, Partner, StaffMember, Page, Investor, GalleryImage
from .serializers import (
    FacultySerializer, NewsListSerializer, NewsDetailSerializer,
    PartnerSerializer, StaffSerializer, PageSerializer, InvestorSerializer,
    GalleryImageSerializer,
)


class PublishedMixin:
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class FacultyListView(PublishedMixin, generics.ListAPIView):
    queryset = Faculty.objects.filter(is_active=True)
    serializer_class = FacultySerializer
    pagination_class = None


class NewsListView(PublishedMixin, generics.ListAPIView):
    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsListSerializer
    pagination_class = None


class NewsDetailView(PublishedMixin, generics.RetrieveAPIView):
    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsDetailSerializer
    lookup_field = 'slug'


class PartnerListView(PublishedMixin, generics.ListAPIView):
    queryset = Partner.objects.filter(is_published=True)
    serializer_class = PartnerSerializer
    pagination_class = None


class StaffListView(PublishedMixin, generics.ListAPIView):
    queryset = StaffMember.objects.filter(is_published=True)
    serializer_class = StaffSerializer
    pagination_class = None


class InvestorListView(PublishedMixin, generics.ListAPIView):
    queryset = Investor.objects.filter(is_published=True)
    serializer_class = InvestorSerializer
    pagination_class = None


class PageDetailView(PublishedMixin, generics.RetrieveAPIView):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageSerializer
    lookup_field = 'slug'


class GalleryListView(PublishedMixin, generics.ListAPIView):
    queryset = GalleryImage.objects.filter(is_published=True).exclude(image='')
    serializer_class = GalleryImageSerializer
    pagination_class = None
