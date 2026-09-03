from rest_framework import generics, permissions
from .models import StartupPortfolio
from .serializers import PortfolioSerializer


class PortfolioListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PortfolioSerializer
    filterset_fields = []

    def get_queryset(self):
        qs = StartupPortfolio.objects.filter(is_published=True).select_related('team', 'season', 'track')
        season = self.request.query_params.get('season')
        track = self.request.query_params.get('track')
        if season:
            qs = qs.filter(season__slug=season)
        if track:
            qs = qs.filter(track__slug=track)
        return qs


class PortfolioDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PortfolioSerializer
    lookup_field = 'slug'
    queryset = StartupPortfolio.objects.filter(is_published=True).select_related('team', 'season', 'track')
