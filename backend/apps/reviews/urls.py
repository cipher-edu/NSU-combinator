from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    path('applications/', views.AdminApplicationListView.as_view()),
    path('applications/<uuid:pk>/assignments/', views.AssignmentCreateView.as_view()),
    path('applications/<uuid:pk>/assignments/<uuid:aid>/', views.AssignmentDeleteView.as_view()),
    path('applications/<uuid:pk>/scores/', views.ScoreCreateView.as_view()),
    path('applications/<uuid:pk>/scores/<uuid:sid>/', views.ScorePatchView.as_view()),
    path('applications/<uuid:pk>/scores/<uuid:sid>/submit/', views.ScoreSubmitView.as_view()),
    path('applications/<uuid:pk>/interviews/', views.InterviewListCreateView.as_view()),
    path('seasons/<uuid:id>/bulk-shortlist/', views.BulkShortlistView.as_view()),
    path('export/applications.csv', views.ExportCsvView.as_view()),
]
