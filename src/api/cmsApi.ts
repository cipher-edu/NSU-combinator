import { apiRequest } from './client';

export interface BackendHeroSlide {
  id: number;
  badge: string;
  title: string;
  title_accent: string;
  subtitle: string;
  description: string;
  image_url: string;
  highlights: string[];
  cta_text: string;
  secondary_cta_text: string;
  cta_action: 'apply' | 'events' | 'team' | 'portfolio';
  order: number;
  is_active: boolean;
}

export interface BackendSectionConfig {
  id: number;
  section_key: string;
  custom_title: string;
  is_visible: boolean;
  order: number;
}

export interface BackendTopTicker {
  badge_text: string;
  message: string;
  action_text: string;
  action_url: string;
  is_active: boolean;
}

export interface FullLayoutResponse {
  ticker: BackendTopTicker | null;
  slides: BackendHeroSlide[];
  sections: BackendSectionConfig[];
  metrics: any[];
  partners: any[];
  news?: any[];
  mentors?: any[];
  vacancies?: any[];
  stories?: any[];
  guides?: any[];
}

export const cmsApi = {
  // Barcha bo‘limlar va slayderlarni 1 ta so‘rov bilan olish
  getFullLayout: async (): Promise<FullLayoutResponse> => {
    return apiRequest<FullLayoutResponse>('/cms/layout/');
  },
};
