import logging
import secrets
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.cache import cache

logger = logging.getLogger(__name__)


def _otp_key(email: str) -> str:
    return f'otp:{email.lower()}'


def _fail_key(email: str) -> str:
    return f'otp_fail:{email.lower()}'


def _lock_key(email: str) -> str:
    return f'otp_lock:{email.lower()}'


def mask_email(email: str) -> str:
    local, _, domain = email.partition('@')
    return f'{local[:2]}***@{domain}'


def send_otp(email: str) -> str:
    email = email.lower()
    code = f'{secrets.randbelow(1_000_000):06d}'
    cache.set(_otp_key(email), make_password(code), settings.OTP_TTL_SECONDS)
    cache.delete(_fail_key(email))
    logger.info('Email OTP yuborildi: %s', mask_email(email))
    if settings.DEBUG:
        logger.info('DEBUG OTP %s -> %s', mask_email(email), code)
    return code


def verify_otp(email: str, code: str) -> tuple[bool, str | None]:
    email = email.lower()
    if cache.get(_lock_key(email)):
        return False, 'OTP_LOCKED'
    hashed = cache.get(_otp_key(email))
    if not hashed or not check_password(code, hashed):
        fails = cache.get(_fail_key(email), 0) + 1
        cache.set(_fail_key(email), fails, settings.OTP_TTL_SECONDS)
        if fails >= settings.OTP_MAX_ATTEMPTS:
            cache.delete(_otp_key(email))
            cache.set(_lock_key(email), 1, settings.OTP_LOCK_SECONDS)
            return False, 'OTP_LOCKED'
        return False, 'OTP_INVALID'
    cache.delete(_otp_key(email))
    cache.delete(_fail_key(email))
    return True, None
