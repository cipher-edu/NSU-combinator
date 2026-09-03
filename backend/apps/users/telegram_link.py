import hashlib
import secrets
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from .models import TelegramLinkToken


def hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


def issue_link_token(user) -> tuple[str, TelegramLinkToken]:
    TelegramLinkToken.objects.filter(user=user, used_at__isnull=True).delete()
    raw = secrets.token_urlsafe(16)
    obj = TelegramLinkToken.objects.create(
        user=user,
        token_hash=hash_token(raw),
        expires_at=timezone.now() + timedelta(minutes=15),
    )
    return raw, obj


def deep_link(raw: str) -> str:
    username = (settings.TELEGRAM_BOT_USERNAME or '').lstrip('@')
    if not username:
        return ''
    return f'https://t.me/{username}?start={raw}'
