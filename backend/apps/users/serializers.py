from rest_framework import serializers
from .models import User, UserCapability


class UserMeSerializerFixed(serializers.ModelSerializer):
    capabilities = serializers.SerializerMethodField()
    faculty_slug = serializers.CharField(source='faculty.slug', read_only=True, allow_null=True)
    telegram_linked = serializers.BooleanField(read_only=True)
    profile_complete = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'name', 'bio', 'phone', 'photo', 'role', 'email_kind',
            'affiliation', 'student_id', 'faculty', 'faculty_slug', 'is_student_verified',
            'locale', 'consent_pd_at', 'consent_marketing_at', 'capabilities',
            'telegram_linked', 'telegram_username', 'profile_complete',
        )
        read_only_fields = (
            'id', 'email', 'role', 'email_kind', 'is_student_verified',
            'consent_pd_at', 'capabilities',
            'telegram_linked', 'telegram_username', 'profile_complete',
        )

    def get_capabilities(self, obj):
        return list(obj.capabilities.values_list('capability', flat=True))

    def update(self, instance, validated_data):
        marketing = self.initial_data.get('consent_marketing')
        instance = super().update(instance, validated_data)
        if marketing is True and not instance.consent_marketing_at:
            from django.utils import timezone
            instance.consent_marketing_at = timezone.now()
            instance.save(update_fields=['consent_marketing_at'])
        if marketing is False:
            instance.consent_marketing_at = None
            instance.save(update_fields=['consent_marketing_at'])
        return instance


class CapabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCapability
        fields = ('id', 'capability', 'created_at')
