import { apiRequest } from './client';

export interface RegisterTicketRequest {
  participant_name: string;
  phone: string;
  telegram: string;
  faculty: string;
}

export interface RegisterTicketResponse {
  success: boolean;
  ticket_id: string;
  event_title: string;
  participant_name: string;
  message: string;
}

export const eventsApi = {
  // Tadbirlar ro‘yxatini olish
  getEvents: async (): Promise<any[]> => {
    return apiRequest<any[]>('/events/list/');
  },

  // Tadbirga ro‘yxatdan o‘tib QR chipta olish
  registerTicket: async (eventId: string | number, data: RegisterTicketRequest): Promise<RegisterTicketResponse> => {
    return apiRequest<RegisterTicketResponse>(`/events/${eventId}/register/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Eshikdagi nazoratchi QR chiptani tekshirishi
  verifyTicket: async (ticket_id: string): Promise<{ status: string; message: string }> => {
    return apiRequest<{ status: string; message: string }>('/events/verify-ticket/', {
      method: 'POST',
      body: JSON.stringify({ ticket_id }),
    });
  },
};
