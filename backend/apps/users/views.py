from django.conf import settings
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.exceptions import ApiError
from core.permissions import IsAdminOps, IsSuperadmin
from .models import User, UserCapability
from .otp import send_otp, verify_otp
from .serializers import UserMeSerializerFixed
from .throttles import AuthEmailThrottle, OtpVerifyThrottle
from apps.notifications.tasks import send_otp_email, send_welcome_email
from .telegram_link import deep_link, issue_link_token


def _tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserMeSerializerFixed(user).data,
    }


class HealthView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        from django.db import connection
        from django.core.cache import cache
        db_ok = True
        redis_ok = True
        try:
            connection.ensure_connection()
        except Exception:
            db_ok = False
        try:
            cache.set('health', '1', 5)
            redis_ok = cache.get('health') == '1'
        except Exception:
            redis_ok = False
        payload = {'db': db_ok, 'redis': redis_ok, 'university': settings.UNIVERSITY_CODE}
        code = status.HTTP_200_OK if db_ok and redis_ok else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(payload, status=code)


class OtpSendView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [AuthEmailThrottle]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        if email:
            code = send_otp(email)
            send_otp_email.delay(email, code)
            data = {'sent': True}
            if settings.DEBUG:
                data['debug_otp'] = code
            return Response(data)
        return Response({'sent': True})


class OtpVerifyView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [OtpVerifyThrottle]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        code = (request.data.get('code') or '').strip()
        if not email or not code:
            raise ApiError('VALIDATION_ERROR', 'Email va kod majburiy')
        ok, err = verify_otp(email, code)
        if not ok:
            raise ApiError(err, 'OTP noto‘g‘ri yoki bloklangan', status_code=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            if request.data.get('consent_pd') is not True:
                raise ApiError('CONSENT_REQUIRED', 'Shaxsga doir ma’lumotlarga rozilik majburiy', status_code=400)
            user = User(email=email, name=email.split('@')[0], consent_pd_at=timezone.now())
            user.set_unusable_password()
            if request.data.get('consent_marketing') is True:
                user.consent_marketing_at = timezone.now()
            user.save()
            send_welcome_email.delay(user.email)
        return Response(_tokens_for(user))


class PasswordSetView(APIView):
    def post(self, request):
        password = request.data.get('password') or ''
        if len(password) < 8:
            raise ApiError('WEAK_PASSWORD', 'Parol kamida 8 belgi')
        request.user.set_password(password)
        request.user.save(update_fields=['password'])
        return Response({'ok': True})


class LogoutView(APIView):
    def post(self, request):
        token = request.data.get('refresh')
        if token:
            try:
                RefreshToken(token).blacklist()
            except Exception:
                pass
        return Response({'ok': True})


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserMeSerializerFixed

    def get_object(self):
        return self.request.user


class AdminVerifyStudentView(APIView):
    permission_classes = [IsAdminOps]

    def post(self, request, id):
        user = User.objects.get(pk=id)
        user.is_student_verified = True
        try:
            user.save(update_fields=['is_student_verified'])
        except Exception:
            raise ApiError('STUDENT_ID_TAKEN', 'Bu student_id allaqachon tasdiqlangan')
        return Response(UserMeSerializerFixed(user).data)


class AdminSetRolesView(APIView):
    permission_classes = [IsSuperadmin]

    def post(self, request, id):
        user = User.objects.get(pk=id)
        role = request.data.get('role')
        caps = request.data.get('capabilities') or []
        if role:
            user.role = role
            user.save()
        UserCapability.objects.filter(user=user).delete()
        for cap in caps:
            UserCapability.objects.create(user=user, capability=cap)
        return Response(UserMeSerializerFixed(user).data)


class TelegramLinkView(APIView):
    def get(self, request):
        user = request.user
        if user.telegram_user_id:
            return Response({
                'linked': True,
                'telegram_username': user.telegram_username,
                'bot_username': settings.TELEGRAM_BOT_USERNAME,
            })
        if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_BOT_USERNAME:
            raise ApiError(
                'TELEGRAM_NOT_CONFIGURED',
                'Telegram bot sozlanmagan. @BotFather dan token oling va TELEGRAM_BOT_TOKEN / TELEGRAM_BOT_USERNAME ni .env ga yozing.',
                status_code=503,
            )
        raw, obj = issue_link_token(user)
        return Response({
            'linked': False,
            'deep_link': deep_link(raw),
            'bot_username': settings.TELEGRAM_BOT_USERNAME,
            'expires_at': obj.expires_at,
        })

    def delete(self, request):
        user = request.user
        if not user.telegram_user_id:
            return Response({'linked': False})
        user.telegram_user_id = None
        user.telegram_username = ''
        user.telegram_linked_at = None
        user.save(update_fields=['telegram_user_id', 'telegram_username', 'telegram_linked_at'])
        return Response({'linked': False})


class PasswordLoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]


class RefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]
