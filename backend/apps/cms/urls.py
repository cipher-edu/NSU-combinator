from django.urls import path
from . import views

app_name = 'cms'

urlpatterns = [
    path('faculties', views.FacultyListView.as_view()),
    path('news', views.NewsListView.as_view()),
    path('news/<slug:slug>', views.NewsDetailView.as_view()),
    path('partners', views.PartnerListView.as_view()),
    path('staff', views.StaffListView.as_view()),
    path('investors', views.InvestorListView.as_view()),
    path('pages/<slug:slug>', views.PageDetailView.as_view()),
    path('gallery', views.GalleryListView.as_view()),
]
