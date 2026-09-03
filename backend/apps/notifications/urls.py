from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('send/', views.AdminSendView.as_view()),
    path('broadcast/', views.AdminBroadcastView.as_view()),
]
