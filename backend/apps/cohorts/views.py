from rest_framework import generics, permissions, views
from rest_framework.response import Response
from core.exceptions import ApiError
from core.permissions import IsAdminOps
from .models import Season
from .serializers import SeasonPublicSerializer
from .state_machine import transition_season


class CurrentSeasonView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SeasonPublicSerializer

    def get_object(self):
        obj = Season.objects.filter(is_current=True).prefetch_related('tracks').first()
        if not obj:
            raise ApiError('NO_CURRENT_SEASON', 'Joriy mavsum yo‘q', status_code=404)
        return obj


class SeasonTransitionView(views.APIView):
    permission_classes = [IsAdminOps]

    def post(self, request, id):
        season = Season.objects.get(pk=id)
        to_status = request.data.get('to')
        note = request.data.get('note') or ''
        transition_season(season, to_status, actor=request.user, note=note)
        return Response(SeasonPublicSerializer(season).data)
