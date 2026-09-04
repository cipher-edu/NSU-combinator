from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve as media_serve
from rest_framework.permissions import AllowAny
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from apps.users.views import HealthView, AdminVerifyStudentView, AdminSetRolesView
from apps.applications.views import AdminApplicationTransitionView
from apps.cohorts.views import CurrentSeasonView, SeasonTransitionView
from apps.ops.views import PublicCampaignGoView

admin.site.site_header = 'NSU startup-club'
admin.site.site_title = 'NSU startup-club'
admin.site.index_title = 'Boshqaruv paneli'

urlpatterns = [
    path('kpp-admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(permission_classes=[AllowAny], authentication_classes=[]), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema', permission_classes=[AllowAny], authentication_classes=[]), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema', permission_classes=[AllowAny], authentication_classes=[]), name='redoc'),

    path('api/v1/health', HealthView.as_view()),
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/public/seasons/current', CurrentSeasonView.as_view()),
    path('api/v1/public/', include('apps.cms.urls')),
    path('api/v1/public/portfolio/', include('apps.portfolio.urls')),
    path('api/v1/teams/', include('apps.teams.urls')),
    path('api/v1/applications/', include('apps.applications.urls')),
    path('api/v1/admin/', include('apps.reviews.urls')),
    path('api/v1/admin/applications/<uuid:pk>/transition/', AdminApplicationTransitionView.as_view()),
    path('api/v1/admin/seasons/<uuid:id>/transition/', SeasonTransitionView.as_view()),
    path('api/v1/admin/users/<uuid:id>/verify-student/', AdminVerifyStudentView.as_view()),
    path('api/v1/admin/users/<uuid:id>/roles/', AdminSetRolesView.as_view()),
    path('api/v1/admin/notifications/', include('apps.notifications.urls')),
    path('api/v1/ops/', include('apps.ops.urls')),
    path('api/v1/public/go/<slug:code>', PublicCampaignGoView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', media_serve, {'document_root': settings.MEDIA_ROOT}),
    ]
