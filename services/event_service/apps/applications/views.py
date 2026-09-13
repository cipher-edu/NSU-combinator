import random
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from .models import Application
from .serializers import ApplicationDraftSerializer, ApplicationStatusSerializer, ApplicationDetailSerializer

def send_telegram_admin_alert(app_instance):
    """
    Yangi tasdiqlangan ariza tushganda universitet adminlarining guruhiga xabar yuboradi.
    """
    token = getattr(settings, 'TELEGRAM_BOT_TOKEN', '')
    chat_id = getattr(settings, 'ADMIN_TELEGRAM_CHAT_ID', '')
    if not token or not chat_id:
        return

    text = (
        f"🚀 <b>YANGI AKSELERATSIYA ARIZASI QABUL QILINDI!</b>\n\n"
        f"🆔 <b>Kod:</b> #{app_instance.id}\n"
        f"💡 <b>Loyiha:</b> {app_instance.project_name} ({app_instance.category})\n"
        f"👤 <b>Asoschi:</b> {app_instance.founder_name}\n"
        f"📱 <b>Tel:</b> {app_instance.phone}\n"
        f"💬 <b>Telegram:</b> {app_instance.telegram_username}\n"
        f"🏛️ <b>Fakultet:</b> {app_instance.faculty}, {app_instance.course}\n"
        f"👥 <b>Jamoa soni:</b> {app_instance.team_size} kishi\n"
        f"📈 <b>Bosqich:</b> {app_instance.stage}\n"
        f"🎯 <b>Muammo:</b> {app_instance.problem[:120]}...\n\n"
        f"📑 <b>Deck:</b> <a href='{app_instance.deck_url}'>Taqdimotni ko‘rish</a>"
    )

    try:
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        requests.post(url, json={
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": False
        }, timeout=5)
    except Exception as e:
        print(f"Telegram yuborishda xato: {e}")


class SubmitDraftApplicationAPIView(APIView):
    """
    1-Qadam: Talaba ma’lumotlarni kiritadi, unga 5 xonali OTP kod va Bot linki beriladi.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ApplicationDraftSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Unikal ID va 5 xonali OTP yaratish
        random_num = random.randint(100, 999)
        new_id = f"UZC-NAVDU-2026-{random_num}"
        otp_code = str(random.randint(10000, 99999))

        app_instance = serializer.save(
            id=new_id,
            otp_code=otp_code,
            is_verified=False,
            status='Kutilmoqda'
        )

        bot_username = "navdu_startup_bot"
        deep_link = f"https://t.me/{bot_username}?start=auth_{new_id}"

        return Response({
            "success": True,
            "application_id": new_id,
            "otp_code": otp_code, # local test uchun qulaylik
            "telegram_bot_url": deep_link,
            "message": "Arizangiz qabul qilindi. Tasdiqlash uchun Telegram Botimizga o‘ting."
        }, status=status.HTTP_201_CREATED)


class VerifyOtpAPIView(APIView):
    """
    2-Qadam: Talaba Telegram botdan olgan 5 xonali OTP kodni kiritadi va ariza rasman qabul qilinadi.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        app_id = request.data.get('application_id')
        code = request.data.get('otp_code', '').strip()

        try:
            app_instance = Application.objects.get(id=app_id)
        except Application.DoesNotExist:
            return Response({"error": "Bunday ariza topilmadi."}, status=status.HTTP_404_NOT_FOUND)

        if app_instance.otp_code != code:
            return Response({"error": "Noto‘g‘ri tasdiqlash kodi kiritildi."}, status=status.HTTP_400_BAD_REQUEST)

        app_instance.is_verified = True
        app_instance.status = 'Ko‘rib chiqilmoqda'
        app_instance.save()

        # Admin guruhga xabar yuborish
        send_telegram_admin_alert(app_instance)

        return Response({
            "success": True,
            "application_id": app_instance.id,
            "status": app_instance.status,
            "message": "Tabriklaymiz! Arizangiz muvaffaqiyatli tasdiqlandi va qabul qilindi."
        })


class CheckApplicationStatusAPIView(APIView):
    """
    Talaba saytdagi 'Ariza holati' tugmasiga ID kiritganda javob qaytaradi.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, application_id):
        try:
            app_instance = Application.objects.get(id=application_id.strip())
            serializer = ApplicationStatusSerializer(app_instance)
            return Response(serializer.data)
        except Application.DoesNotExist:
            return Response({"error": "Bunday ID raqamli ariza topilmadi. Kodni qayta tekshiring."}, status=status.HTTP_404_NOT_FOUND)
