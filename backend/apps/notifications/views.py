from rest_framework import permissions, views
from rest_framework.response import Response
from core.exceptions import ApiError
from core.permissions import IsAdminOps
from apps.users.models import User
from .models import Broadcast, Notification
from .tasks import deliver_notification, run_broadcast


class AdminSendView(views.APIView):
    permission_classes = [IsAdminOps]

    def post(self, request):
        user_id = request.data.get('user_id')
        title = (request.data.get('title') or '').strip()
        body = (request.data.get('body') or '').strip()
        channels = request.data.get('channels') or ['telegram']
        if not user_id or not title:
            raise ApiError('VALIDATION_ERROR', 'user_id va title majburiy')
        user = User.objects.filter(pk=user_id).first()
        if not user:
            raise ApiError('NOT_FOUND', 'Foydalanuvchi topilmadi', status_code=404)
        created = []
        for ch in channels:
            if ch == 'telegram' and not user.telegram_user_id:
                continue
            n = Notification.objects.create(
                user=user,
                email=user.email if ch == 'email' else '',
                channel=ch,
                title=title,
                body=body,
            )
            deliver_notification.delay(str(n.id))
            created.append(str(n.id))
        if not created:
            raise ApiError('NO_CHANNEL', 'Telegram ulanmagan yoki kanal yo‘q')
        return Response({'queued': created}, status=201)


class AdminBroadcastView(views.APIView):
    permission_classes = [IsAdminOps]

    def get(self, request):
        rows = Broadcast.objects.all()[:30]
        return Response([
            {
                'id': str(b.id),
                'title': b.title,
                'audience': b.audience,
                'channels': b.channels,
                'sent_at': b.sent_at,
                'total': b.total,
                'sent_ok': b.sent_ok,
                'sent_fail': b.sent_fail,
                'created_at': b.created_at,
            }
            for b in rows
        ])

    def post(self, request):
        title = (request.data.get('title') or '').strip()
        body = (request.data.get('body') or '').strip()
        audience = request.data.get('audience') or Broadcast.Audience.ALL_LINKED
        channels = request.data.get('channels') or ['telegram']
        if not title or not body:
            raise ApiError('VALIDATION_ERROR', 'title va body majburiy')
        if audience not in Broadcast.Audience.values:
            raise ApiError('VALIDATION_ERROR', 'Noto‘g‘ri audience')
        b = Broadcast.objects.create(
            title=title,
            body=body,
            audience=audience,
            channels=channels,
            created_by=request.user,
        )
        run_broadcast.delay(str(b.id))
        return Response({'id': str(b.id), 'queued': True}, status=201)
