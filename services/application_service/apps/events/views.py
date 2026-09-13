import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from .models import Event, Ticket
from .serializers import EventSerializer, TicketRegisterSerializer, TicketDetailSerializer

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]


class RegisterTicketAPIView(APIView):
    """
    Talaba hakaton yoki tadbirga yozilganda unikal chipta beradi.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Tadbir topilmadi"}, status=status.HTTP_404_NOT_FOUND)

        if not event.is_registration_open:
            return Response({"error": "Ushbu tadbirga ro‘yxatdan o‘tish yopilgan"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TicketRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ticket_code = f"UZC-PASS-{random.randint(1000, 9999)}"
        ticket = serializer.save(event=event, ticket_id=ticket_code)

        return Response({
            "success": True,
            "ticket_id": ticket.ticket_id,
            "event_title": event.title,
            "participant_name": ticket.participant_name,
            "message": "Tabriklaymiz, siz tadbirga muvaffaqiyatli ro‘yxatdan o‘tdingiz!"
        }, status=status.HTTP_201_CREATED)


class VerifyTicketAPIView(APIView):
    """
    Eshikdagi nazoratchi QR-kodni skaner qilganda davomatni tasdiqlash uchun.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ticket_id = request.data.get('ticket_id', '').strip()
        try:
            ticket = Ticket.objects.get(ticket_id=ticket_id)
            if ticket.is_attended:
                return Response({
                    "status": "warning",
                    "message": "Ushbu chipta oldinroq skaner qilingan!",
                    "participant_name": ticket.participant_name,
                    "event_title": ticket.event.title
                })

            ticket.is_attended = True
            ticket.save()

            return Response({
                "status": "success",
                "message": "Chipta haqiqiy! Xush kelibsiz.",
                "participant_name": ticket.participant_name,
                "event_title": ticket.event.title
            })
        except Ticket.DoesNotExist:
            return Response({"status": "error", "message": "Bunday chipta tizimda mavjud emas!"}, status=status.HTTP_404_NOT_FOUND)
