from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter(trailing_slash=False)
router.register('campaigns', views.CampaignViewSet)
router.register('leads', views.LeadViewSet)
router.register('tasks', views.OpsTaskViewSet)
router.register('program-weeks', views.ProgramWeekViewSet)
router.register('deliverables', views.DeliverableViewSet)
router.register('attendance', views.AttendanceViewSet)
router.register('updates', views.TeamWeeklyUpdateViewSet)
router.register('mentors', views.MentorAssignmentViewSet)
router.register('office-hours', views.OfficeHourViewSet)
router.register('demo-slots', views.DemoDaySlotViewSet)
router.register('investor-interest', views.InvestorInterestViewSet)
router.register('knowledge', views.KnowledgeArticleViewSet)
router.register('surveys', views.SurveyResponseViewSet)
router.register('users', views.AdminUserViewSet)
router.register('teams', views.AdminTeamViewSet)
router.register('seasons', views.AdminSeasonViewSet)
router.register('tracks', views.AdminTrackViewSet)
router.register('applications', views.AdminApplicationViewSet)
router.register('interviews', views.InterviewViewSet)
router.register('faculties', views.FacultyViewSet)
router.register('news', views.NewsViewSet)
router.register('partners', views.PartnerViewSet)
router.register('staff-members', views.StaffViewSet)
router.register('investors', views.InvestorViewSet)
router.register('gallery', views.GalleryViewSet)
router.register('pages', views.PageViewSet)
router.register('portfolio', views.PortfolioViewSet)
router.register('broadcasts', views.BroadcastViewSet, basename='broadcasts')

app_name = 'ops'

urlpatterns = [
    path('stats', views.StatsView.as_view()),
    path('choices', views.ChoicesView.as_view()),
    path('uploads', views.UploadView.as_view()),
    path('reviews/board', views.ReviewBoardView.as_view()),
    path('', include(router.urls)),
]
