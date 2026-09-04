export type Season = {
  id: string
  slug: string
  name_uz: string
  name_en: string
  status: string
  is_current: boolean
  program_weeks: number
  apply_opens_at: string | null
  apply_closes_at: string | null
  program_starts_at: string | null
  demo_day_at: string | null
  stats_override: Record<string, number>
  curriculum: { week: number; slug: string; title_uz: string; title_en?: string; outcome_uz?: string }[]
  tracks: Track[]
}

export type Track = { id: string; slug: string; name_uz: string; name_en: string }

export type NewsItem = {
  id: string
  slug: string
  title_uz: string
  title_en: string
  cover: string | null
  published_at: string | null
  youtube_url?: string
  body_uz?: string
  body_en?: string
}

export type Partner = { id: string; slug: string; name: string; logo: string | null; url: string }
export type GalleryItem = {
  id: string
  slug: string
  image: string | null
  caption_uz: string
  caption_en: string
  placement: string
  show_in_gallery: boolean
  order: number
}
export type Staff = { id: string; slug: string; name: string; title_uz: string; title_en: string; photo: string | null; linkedin: string }
export type Investor = { id: string; slug: string; name: string; title_uz: string; title_en: string; org: string; photo: string | null }
export type Faculty = { id: string; slug: string; name_uz: string; name_en: string }
export type PortfolioItem = {
  id: string
  slug: string
  team_name: string
  logo: string | null
  season_slug: string
  track_slug: string
  summary_uz: string
  summary_en: string
  website: string
}

export type User = {
  id: string
  email: string
  name: string
  phone: string
  role: string
  affiliation: string
  student_id: string
  faculty: string | null
  faculty_slug: string | null
  is_student_verified: boolean
  locale: string
  capabilities: string[]
  telegram_linked: boolean
  telegram_username: string
  profile_complete: boolean
}

export type Membership = { id: string; user_id: string; email: string; name: string; role: string }
export type Team = {
  id: string
  name: string
  slug: string
  one_liner_uz: string
  one_liner_en: string
  logo: string | null
  status: string
  season: string
  season_slug: string
  memberships: Membership[]
}

export type Application = {
  id: string
  season: string
  season_slug: string
  team: string
  team_name: string
  track: string
  track_slug: string
  faculty: string | null
  status: string
  submitted_at: string | null
  problem: string
  solution: string
  stage: string
  why_us: string
  faculty_endorsement_name: string
  demo_url: string
  video_url: string
  has_deck: boolean
  extra?: { current_step?: number; answers?: Record<string, string> }
  answers?: Record<string, string>
  current_step?: number
  progress?: { id: string; n: number; title_uz: string; required: number; filled: number; complete: boolean }[]
  events?: { id: string; from_status: string; to_status: string; note: string; created_at: string }[]
}

export type ApplyQuestion = {
  id: string
  type: 'text' | 'textarea' | 'select' | 'url'
  required: boolean
  max?: number
  label_uz: string
  label_en: string
  placeholder_uz?: string
  options?: { value: string; label_uz: string; label_en: string }[]
  options_from?: 'tracks'
}

export type ApplyStep = {
  id: string
  n: number
  title_uz: string
  title_en: string
  lead_uz: string
  lead_en: string
  questions: ApplyQuestion[]
}
