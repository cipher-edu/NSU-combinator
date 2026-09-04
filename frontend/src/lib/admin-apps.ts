import { APP_STATUS } from './admin-labels'

export type AppProgress = {
  id: string
  n: number
  title_uz: string
  required: number
  filled: number
  complete: boolean
}

export type AppMember = {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

export type AppAssignment = {
  id: string
  reviewer_id: string
  reviewer_name: string
  reviewer_email: string
  submitted: boolean
  due_at: string | null
}

export type AppInterview = {
  id: string
  starts_at: string
  location: string
  notes: string
  cancelled_at: string | null
}

export type AppEvent = {
  id: string
  from_status: string
  to_status: string
  note: string
  created_at: string
}

export type AdminApp = {
  id: string
  team: string
  team_name: string
  team_slug: string
  one_liner: string
  status: string
  track: string
  track_slug: string
  track_name: string
  season: string
  season_slug: string
  season_name: string
  faculty: string | null
  faculty_name: string | null
  lead_name: string
  lead_email: string
  lead_phone: string
  submitted_at: string | null
  problem: string
  solution: string
  stage: string
  why_us: string
  faculty_endorsement_name: string
  demo_url: string
  video_url: string
  has_deck: boolean
  answers: Record<string, string>
  current_step: number
  progress: AppProgress[]
  events: AppEvent[]
  members: AppMember[]
  assignments: AppAssignment[]
  interviews: AppInterview[]
  allowed_to: string[]
  score_count: number
  score_avg: number | null
  created_at: string
  updated_at: string
}

export type AppQuestion = {
  id: string
  type: 'text' | 'textarea' | 'select' | 'url'
  required: boolean
  max?: number
  label_uz: string
  placeholder_uz?: string
  options?: { value: string; label_uz: string; label_en?: string }[]
  options_from?: 'tracks'
}

export type AppStep = {
  id: string
  n: number
  title_uz: string
  lead_uz: string
  questions: AppQuestion[]
}

export type AppMeta = {
  seasons: { id: string; slug: string; name_uz: string; is_current: boolean }[]
  tracks: { id: string; slug: string; name_uz: string; season: string }[]
  faculties: { id: string; slug: string; name_uz: string }[]
  reviewers: { id: string; email: string; name: string }[]
  steps: AppStep[]
  transitions: Record<string, string[]>
}

export const PIPE_COLS = [
  'draft',
  'submitted',
  'screening',
  'interview_invited',
  'interviewed',
  'waitlisted',
  'accepted',
  'rejected',
] as const

export function progressLabel(p?: AppProgress[]) {
  if (!p?.length) return '0/7'
  return `${p.filter((x) => x.complete).length}/7`
}

export function optionLabel(q: AppQuestion, value?: string) {
  if (!value) return '—'
  const hit = q.options?.find((o) => o.value === value)
  return hit?.label_uz || value
}

export const TONE_ACTION: Record<string, 'primary' | 'ink' | 'ghost' | 'danger'> = {
  submitted: 'primary',
  screening: 'ink',
  interview_invited: 'primary',
  interviewed: 'ink',
  accepted: 'primary',
  waitlisted: 'ghost',
  rejected: 'danger',
  withdrawn: 'ghost',
}

export function statusTitle(key: string) {
  return APP_STATUS[key] || key
}
