from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, RegisterTicketAPIView, VerifyTicketAPIView

router = DefaultRouter()
router.register(r'list', EventViewSet, basename='events-list')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:event_id>/register/', RegisterTicketAPIView.as_view(), name='event-register'),
    path('verify-ticket/', VerifyTicketAPIView.as_view(), name='event-verify-ticket'),
]
