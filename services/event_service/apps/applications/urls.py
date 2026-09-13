from django.urls import path
from .views import (
    SubmitDraftApplicationAPIView,
    VerifyOtpAPIView,
    CheckApplicationStatusAPIView
)

urlpatterns = [
    path('draft/', SubmitDraftApplicationAPIView.as_view(), name='application-draft'),
    path('verify-otp/', VerifyOtpAPIView.as_view(), name='application-verify-otp'),
    path('status/<str:application_id>/', CheckApplicationStatusAPIView.as_view(), name='application-status'),
]
