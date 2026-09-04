import logging
import time
from django.conf import settings
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'NSU startup-club Telegram bot (polling)'

    def handle(self, *args, **options):
        try:
            from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters
        except ImportError:
            self.stderr.write('python-telegram-bot o‘rnatilmagan')
            return

        import os
        token = (os.environ.get('TELEGRAM_BOT_TOKEN') or settings.TELEGRAM_BOT_TOKEN or '').strip()
        while not token:
            self.stderr.write('TELEGRAM_BOT_TOKEN yo‘q — 15s kutilyapti...')
            time.sleep(15)
            token = (os.environ.get('TELEGRAM_BOT_TOKEN') or '').strip()

        from .telegram_handlers import help_handler, start_handler, status_handler, unknown_handler

        app = ApplicationBuilder().token(token).build()
        app.add_handler(CommandHandler('start', start_handler))
        app.add_handler(CommandHandler('status', status_handler))
        app.add_handler(CommandHandler('help', help_handler))
        app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, unknown_handler))
        self.stdout.write('Telegram bot polling...')
        app.run_polling(drop_pending_updates=True)
