from django.urls import path
from . import views

app_name = 'applications'

urlpatterns = [
    path('', views.ApplicationCreateView.as_view()),
    path('form', views.ApplicationFormSchemaView.as_view()),
    path('mine/', views.ApplicationMineView.as_view()),
    path('<uuid:pk>/', views.ApplicationDetailView.as_view()),
    path('<uuid:pk>/submit/', views.ApplicationSubmitView.as_view()),
    path('<uuid:pk>/withdraw/', views.ApplicationWithdrawView.as_view()),
    path('<uuid:pk>/deck/', views.ApplicationDeckView.as_view()),
]
