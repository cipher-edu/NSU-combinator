export type StartupStage = 'Idea' | 'MVP' | 'Traction' | 'Scaling';

export type StartupCategory = 
  | 'Barchasi'
  | 'AI & EdTech'
  | 'AgroTech & Eco'
  | 'GreenTech & Energy'
  | 'Sanoat & IoT'
  | 'MedTech & Salomatlik'
  | 'FinTech & Commerce';

export interface Founder {
  name: string;
  role: string;
  avatar: string;
  faculty: string;
  telegram?: string;
  linkedin?: string;
}

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  fullDescription: string;
  problem: string;
  solution: string;
  category: StartupCategory;
  stage: StartupStage;
  batch: string;
  founders: Founder[];
  upvotes: number;
  upvotedByUser?: boolean;
  logo: string;
  raisedAmount?: string;
  raisedPct?: number; // for demo day bar
  bannerImage?: string;
  website?: string;
  pitchDeckUrl?: string;
  metrics: {
    users?: string;
    revenue?: string;
    grantWon?: string;
    pilotLocations?: string;
  };
  tags: string[];
  createdAt: string;
  techStack?: string[];
  marketSize?: {
    tam: string;
    sam: string;
    som: string;
  };
  comments?: Comment[];
  screenshots?: string[];
  videoDemoUrl?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  text: string;
  date: string;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  startupName: string;
  date: string;
  readTime: string;
  likes: number;
  likedByUser?: boolean;
  commentsCount: number;
  comments: Comment[];
  tags: string[];
  coverImage?: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Hakaton' | 'Seminar' | 'Qabul' | 'Demo Day' | 'Vebinar' | 'Meetup';
  date: string;
  time: string;
  location: string;
  mode: 'Oflayn' | 'Onlayn' | 'Gibrid';
  prize?: string;
  registrationDeadline: string;
  description: string;
  agenda: string[];
  speakers?: { name: string; title: string; avatar: string }[];
  registeredCount: number;
  isRegistrationOpen: boolean;
  featured?: boolean;
}

export interface CoFounderVacancy {
  id: string;
  startupName: string;
  startupLogo: string;
  category: string;
  roleTitle: string;
  requiredSkills: string[];
  description: string;
  commitmentType: 'To‘liq stavka' | 'Erkin grafik' | 'Yarim stavka' | 'Loyiha asosida';
  faculty: string;
  contactTelegram: string;
  createdAt: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  avatar: string;
  expertise: string[];
  availableSlots: string[];
  rating: number;
  reviewsCount: number;
  telegram?: string;
}

export interface IncubationApplication {
  id: string;
  teamName: string;
  founderName: string;
  phone: string;
  email: string;
  telegram: string;
  faculty: string;
  course: string;
  teamMembersCount: number;
  category: string;
  stage: StartupStage;
  projectName: string;
  problem: string;
  solution: string;
  targetMarket: string;
  hasPrototype: boolean;
  deckUrl?: string;
  submittedAt: string;
  status: 'Ko‘rib chiqilmoqda' | 'Intervyuga chaqirildi' | 'Qabul qilindi' | 'Rad etildi';
}

export type NewsCategory = 
  | 'Barchasi'
  | 'Akseleratsiya'
  | 'Grantlar'
  | 'Hamkorlik'
  | 'Hakatonlar'
  | 'Universitet'
  | 'Investitsiya';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  featured?: boolean;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  likedByUser?: boolean;
  comments?: Comment[];
}
