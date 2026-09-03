from django.urls import path
from . import views

app_name = 'teams'

urlpatterns = [
    path('', views.TeamCreateView.as_view()),
    path('mine/', views.TeamMineView.as_view()),
    path('invites/accept/', views.TeamInviteAcceptView.as_view()),
    path('<uuid:pk>/', views.TeamDetailView.as_view()),
    path('<uuid:pk>/disband/', views.TeamDisbandView.as_view()),
    path('<uuid:pk>/invite/', views.TeamInviteView.as_view()),
    path('<uuid:pk>/transfer-lead/', views.TeamTransferLeadView.as_view()),
    path('<uuid:pk>/members/<uuid:user_id>/remove/', views.TeamRemoveMemberView.as_view()),
    path('<uuid:pk>/leave/', views.TeamLeaveView.as_view()),
]
