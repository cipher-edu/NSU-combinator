import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def send_telegram(chat_id: int, text: str) -> tuple[bool, str]:
    token = (settings.TELEGRAM_BOT_TOKEN or '').strip()
    if not token or not chat_id:
        return False, 'TELEGRAM_NOT_CONFIGURED'
    try:
        r = requests.post(
            f'https://api.telegram.org/bot{token}/sendMessage',
            json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'},
            timeout=15,
        )
        data = r.json() if r.content else {}
        if r.ok and data.get('ok'):
            return True, ''
        return False, str(data.get('description') or r.text)[:400]
    except Exception as exc:
        logger.warning('telegram send fail chat=%s: %s', chat_id, exc)
        return False, str(exc)[:400]
