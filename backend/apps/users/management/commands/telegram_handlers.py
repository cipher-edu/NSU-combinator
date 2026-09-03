import logging
from asgiref.sync import sync_to_async
from django.utils import timezone
from telegram import Update
from telegram.ext import ContextTypes

from apps.users.models import TelegramLinkToken, User
from apps.users.telegram_link import hash_token

logger = logging.getLogger(__name__)

HELP = (
    "NSU Combinator boti\n\n"
    "/start — akkauntni ulash\n"
    "/status — ulanish holati\n"
    "/help — yordam\n\n"
    "Avval saytda email orqali kiring, kabinetda «Telegram ulash» ni bosing."
)


@sync_to_async
def _user_by_tg(tg_id: int):
    return User.objects.filter(telegram_user_id=tg_id).first()


@sync_to_async
def _link(raw: str, tg_id: int, username: str):
    if not raw:
        return 'NO_TOKEN', None
    token = TelegramLinkToken.objects.filter(token_hash=hash_token(raw), used_at__isnull=True).select_related('user').first()
    if not token:
        return 'NOT_FOUND', None
    if token.expires_at < timezone.now():
        return 'EXPIRED', None
    other = User.objects.filter(telegram_user_id=tg_id).exclude(pk=token.user_id).first()
    if other:
        return 'TG_TAKEN', None
    user = token.user
    user.telegram_user_id = tg_id
    user.telegram_username = (username or '')[:64]
    user.telegram_linked_at = timezone.now()
    user.save(update_fields=['telegram_user_id', 'telegram_username', 'telegram_linked_at'])
    token.used_at = timezone.now()
    token.save(update_fields=['used_at'])
    return 'OK', user


async def start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    tg = update.effective_user
    args = context.args or []
    if args:
        code, user = await _link(args[0], tg.id, tg.username or '')
        if code == 'OK':
            await update.message.reply_text(
                f"Ulandi. Salom, {user.name or user.email}.\n"
                "Endi NSU Combinator xabarlari shu yerga keladi."
            )
            return
        msg = {
            'NOT_FOUND': 'Havola topilmadi. Kabinetdan yangi havola oling.',
            'EXPIRED': 'Havola muddati o‘tgan. Kabinetdan qayta bosing.',
            'TG_TAKEN': 'Bu Telegram boshqa akkauntga ulangan.',
            'NO_TOKEN': HELP,
        }.get(code, HELP)
        await update.message.reply_text(msg)
        return

    user = await _user_by_tg(tg.id)
    if user:
        await update.message.reply_text(
            f"Siz allaqachon ulangansiz: {user.email}\nHabarnomalar shu chatga keladi."
        )
        return
    await update.message.reply_text(HELP)


async def status_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = await _user_by_tg(update.effective_user.id)
    if user:
        await update.message.reply_text(f"Ulangan: {user.email}\n{user.name}")
    else:
        await update.message.reply_text("Hali ulanmagan. Saytdagi kabinetdan havolani oching.")


async def help_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(HELP)


async def unknown_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Noma’lum buyruq. /help")
