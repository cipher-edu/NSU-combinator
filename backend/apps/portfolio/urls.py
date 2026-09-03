from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('', views.PortfolioListView.as_view()),
    path('<slug:slug>', views.PortfolioDetailView.as_view()),
]
