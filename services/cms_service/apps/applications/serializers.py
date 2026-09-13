from rest_framework import serializers
from .models import Application, ApplicationEvaluation

class ApplicationDraftSerializer(serializers.ModelSerializer):
    """
    Talaba saytda arizani ilk to‘ldirganda jo‘natadigan ma’lumotlar.
    """
    class Meta:
        model = Application
        fields = [
            'founder_name', 'phone', 'email', 'telegram_username',
            'faculty', 'course', 'team_size', 'project_name',
            'category', 'stage', 'problem', 'solution',
            'target_market', 'deck_url'
        ]


class ApplicationStatusSerializer(serializers.ModelSerializer):
    """
    Talaba faqat o‘z ID kodi bo‘yicha arizasini tekshirganda qaytadigan xavfsiz javob.
    """
    class Meta:
        model = Application
        fields = [
            'id', 'project_name', 'founder_name', 'category',
            'stage', 'status', 'feedback', 'created_at'
        ]


class ApplicationDetailSerializer(serializers.ModelSerializer):
    """
    Admin panel yoki hakamlar uchun arizaning to‘liq ko‘rinishi.
    """
    class Meta:
        model = Application
        fields = '__all__'
