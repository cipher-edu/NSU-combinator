from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('otp/send', views.OtpSendView.as_view()),
    path('otp/verify', views.OtpVerifyView.as_view()),
    path('password/set', views.PasswordSetView.as_view()),
    path('login', views.PasswordLoginView.as_view()),
    path('admin/login', views.AdminLoginView.as_view()),
    path('token/refresh', views.RefreshView.as_view()),
    path('logout', views.LogoutView.as_view()),
    path('me', views.MeView.as_view()),
    path('telegram/link', views.TelegramLinkView.as_view()),
]
