import { apiRequest } from './client';

export interface DraftApplicationRequest {
  founder_name: string;
  phone: string;
  email: string;
  telegram_username: string;
  faculty: string;
  course: string;
  team_size: number;
  project_name: string;
  category: string;
  stage: string;
  problem: string;
  solution: string;
  target_market: string;
  deck_url?: string;
}

export interface DraftApplicationResponse {
  success: boolean;
  application_id: string;
  otp_code: string;
  telegram_bot_url: string;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  application_id: string;
  status: string;
  message: string;
}

export interface ApplicationStatusResponse {
  id: string;
  project_name: string;
  founder_name: string;
  category: string;
  stage: string;
  status: string;
  feedback?: string;
  created_at: string;
}

export const applicationsApi = {
  // 1-bosqich: Ariza qoralamasini yuborish va Telegram OTP havolasini olish
  submitDraft: async (data: DraftApplicationRequest): Promise<DraftApplicationResponse> => {
    return apiRequest<DraftApplicationResponse>('/applications/draft/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 2-bosqich: Telegram botdan olingan OTP kodni tasdiqlash
  verifyOtp: async (application_id: string, otp_code: string): Promise<VerifyOtpResponse> => {
    return apiRequest<VerifyOtpResponse>('/applications/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ application_id, otp_code }),
    });
  },

  // Talaba ID bo‘yicha o‘z arizasi holatini tekshirishi
  checkStatus: async (application_id: string): Promise<ApplicationStatusResponse> => {
    return apiRequest<ApplicationStatusResponse>(`/applications/status/${encodeURIComponent(application_id)}/`);
  },
};
