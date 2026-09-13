from rest_framework import serializers
from .models import Event, Ticket

class EventSerializer(serializers.ModelSerializer):
    registered_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_registered_count(self, obj):
        return obj.tickets.count()


class TicketRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['participant_name', 'phone', 'telegram', 'faculty']


class TicketDetailSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.CharField(source='event.date', read_only=True)
    event_location = serializers.CharField(source='event.location', read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
