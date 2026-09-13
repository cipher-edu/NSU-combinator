import os
import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.enums import ParseMode

logging.basicConfig(level=logging.INFO)

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
ADMIN_CHAT_ID = os.environ.get("ADMIN_CHAT_ID", "")

dp = Dispatcher()

@dp.message(CommandStart(deep_link=True))
async def cmd_start_deeplink(message: types.Message, command: types.CommandObject):
    """
    Talaba saytdan t.me/navdu_startup_bot?start=auth_UZC-NAVDU-2026-304 linki bilan kirganda ishlaydi.
    """
    deep_link_args = command.args
    app_id = deep_link_args.replace("auth_", "") if deep_link_args else "Noma'lum"

    welcome_text = (
        f"👋 <b>Assalomu alaykum, {message.from_user.full_name}!</b>\n\n"
        f"🎓 <b>NavDU Inkubatsiya & Akseleratsiya Markazi</b> rasmiy botiga xush kelibsiz.\n\n"
        f"Siz <b>#{app_id}</b> raqamli arizani tasdiqlash uchun kirdingiz.\n\n"
        f"🔐 <b>Sizning bir martalik tasdiqlash kodingiz (OTP):</b>\n"
        f"👉 <code>58241</code> 👈\n\n"
        f"<i>Ushbu 5 xonali kodni saytga kiriting. Kod 5 daqiqa davomida amal qiladi.</i>"
    )

    await message.answer(welcome_text, parse_mode=ParseMode.HTML)


@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    """
    Oddiy /start bosilganda
    """
    text = (
        f"👋 <b>Assalomu alaykum, {message.from_user.full_name}!</b>\n\n"
        f"🚀 <b>NavDU Startap Klubi va Inkubatsiya Markazi</b> rasmiy botisiz.\n\n"
        f"Ushbu bot orqali:\n"
        f"• 45 kunlik dastur arizangizni tasdiqlashingiz;\n"
        f"• Ariza holati va hakamlar izohini kuzatishingiz;\n"
        f"• Hakatonlar uchun QR-chiptangizni olishingiz mumkin.\n\n"
        f"🌐 <b>Rasmiy portal:</b> https://startups.navdu.uz"
    )
    await message.answer(text, parse_mode=ParseMode.HTML)


async def main():
    if not BOT_TOKEN or BOT_TOKEN in ("mock_bot_token_for_dev", "YOUR_TELEGRAM_BOT_TOKEN") or ":" not in BOT_TOKEN:
        logging.warning("⚠️ TELEGRAM_BOT_TOKEN kiritilmagan. Lokal rejimda worker kutish holatida turadi.")
        while True:
            await asyncio.sleep(3600)
    bot = Bot(token=BOT_TOKEN)
    logging.info("🤖 Telegram Bot Worker ishga tushdi...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
