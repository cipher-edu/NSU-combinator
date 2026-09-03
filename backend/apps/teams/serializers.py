from rest_framework import serializers
from .models import Team, TeamMembership, TeamInvite


class MembershipSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True)

    class Meta:
        model = TeamMembership
        fields = ('id', 'user_id', 'email', 'name', 'role', 'left_at')


class TeamSerializer(serializers.ModelSerializer):
    memberships = serializers.SerializerMethodField()
    season_slug = serializers.CharField(source='season.slug', read_only=True)

    class Meta:
        model = Team
        fields = (
            'id', 'name', 'slug', 'one_liner_uz', 'one_liner_en', 'logo',
            'status', 'season', 'season_slug', 'memberships', 'created_at',
        )
        read_only_fields = ('id', 'slug', 'status', 'season', 'created_at')

    def get_memberships(self, obj):
        qs = obj.memberships.filter(left_at__isnull=True)
        return MembershipSerializer(qs, many=True).data


class TeamInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamInvite
        fields = ('id', 'email', 'expires_at', 'accepted_at', 'created_at')
        read_only_fields = fields
