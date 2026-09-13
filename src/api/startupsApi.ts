import { apiRequest } from './client';
import { Startup } from '../types';

export const startupsApi = {
  // Startaplar ro‘yxatini olish
  getStartups: async (category?: string): Promise<Startup[]> => {
    const q = category && category !== 'Barchasi' ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest<Startup[]>(`/startups/${q}`);
  },

  // Reyting bo‘yicha saralangan ro‘yxat (Leaderboard)
  getLeaderboard: async (): Promise<Startup[]> => {
    return apiRequest<Startup[]>('/startups/leaderboard/');
  },

  // Ovoz berish (Upvote)
  upvote: async (id: string): Promise<{ success: boolean; startup_id: string; new_upvotes: number }> => {
    return apiRequest<{ success: boolean; startup_id: string; new_upvotes: number }>(`/startups/${id}/upvote`, {
      method: 'POST',
    });
  },
};
