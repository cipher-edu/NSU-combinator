import logging
from celery import shared_task
from django.utils import timezone
from .mail import otp_html, send_html_email, welcome_html
from .models import Broadcast, Notification
from .telegram import send_telegram

logger = logging.getLogger(__name__)


@shared_task(name='notifications.send_otp_email')
def send_otp_email(email: str, code: str):
    subject = 'NSU startup-club — kirish kodi'
    text = f'Sizning bir martalik kodingiz: {code}\nAmal qilish muddati: 10 daqiqa.'
    n = Notification.objects.create(
        email=email, channel=Notification.Channel.EMAIL, title=subject, body='OTP',
    )
    try:
        send_html_email(email, subject, text, otp_html(code))
        n.sent_at = timezone.now()
        n.save(update_fields=['sent_at'])
        logger.info('otp_send_total email=%s', email.split('@')[0][:2] + '***')
    except Exception as exc:
        n.error = str(exc)
        n.save(update_fields=['error'])
        logger.exception('otp_send_fail_total')
        raise


@shared_task(name='notifications.send_welcome_email')
def send_welcome_email(email: str):
    subject = 'NSU startup-club — xush kelibsiz'
    text = 'Email tasdiqlandi. Kabinetda profilni to‘ldiring va Telegram botni ulang.'
    try:
        send_html_email(email, subject, text, welcome_html())
    except Exception:
        logger.exception('welcome_email_fail')


@shared_task(name='notifications.send_simple_email')
def send_simple_email(email: str, subject: str, body: str):
    try:
        send_html_email(email, subject, body)
    except Exception:
        logger.exception('simple_email_fail')


@shared_task(name='notifications.deliver')
def deliver_notification(notification_id: str):
    n = Notification.objects.select_related('user').get(pk=notification_id)
    text = f"<b>{n.title}</b>\n\n{n.body}" if n.body else n.title
    ok, err = False, ''
    try:
        if n.channel == Notification.Channel.EMAIL:
            to = n.email or (n.user.email if n.user else '')
            if not to:
                raise ValueError('email yo‘q')
            send_html_email(to, n.title, n.body or n.title)
            ok = True
        elif n.channel == Notification.Channel.TELEGRAM:
            chat = n.user.telegram_user_id if n.user else None
            ok, err = send_telegram(chat, text)
        else:
            ok = True
    except Exception as exc:
        err = str(exc)[:400]
        ok = False
    if ok:
        n.sent_at = timezone.now()
        n.error = ''
    else:
        n.error = err or 'SEND_FAILED'
    n.save(update_fields=['sent_at', 'error'])
    return ok


def _audience_qs(audience: str):
    from apps.users.models import User
    qs = User.objects.filter(is_active=True)
    if audience == Broadcast.Audience.ALL_LINKED:
        return qs.exclude(telegram_user_id=None)
    if audience == Broadcast.Audience.APPLICANTS:
        return qs.filter(role=User.Role.APPLICANT).exclude(telegram_user_id=None)
    if audience == Broadcast.Audience.ACCEPTED:
        return qs.filter(memberships__team__status='accepted', memberships__left_at__isnull=True).distinct()
    if audience == Broadcast.Audience.STAFF:
        return qs.filter(role__in=[User.Role.ADMIN, User.Role.SUPERADMIN])
    return qs.none()


@shared_task(name='notifications.run_broadcast')
def run_broadcast(broadcast_id: str):
    b = Broadcast.objects.get(pk=broadcast_id)
    users = list(_audience_qs(b.audience))
    channels = b.channels or ['telegram']
    ok = fail = 0
    for user in users:
        for ch in channels:
            if ch == 'telegram' and not user.telegram_user_id:
                continue
            n = Notification.objects.create(
                user=user,
                email=user.email if ch == 'email' else '',
                channel=ch,
                title=b.title,
                body=b.body,
                broadcast=b,
            )
            if deliver_notification(str(n.id)):
                ok += 1
            else:
                fail += 1
    b.total = ok + fail
    b.sent_ok = ok
    b.sent_fail = fail
    b.sent_at = timezone.now()
    b.save(update_fields=['total', 'sent_ok', 'sent_fail', 'sent_at'])
    return {'ok': ok, 'fail': fail}
