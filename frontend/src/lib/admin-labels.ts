export const APP_STATUS: Record<string, string> = {
  draft: 'Qoralama',
  submitted: 'Topshirilgan',
  screening: 'Screening',
  interview_invited: 'Suhbat',
  interviewed: 'Suhbatdan o‘tgan',
  accepted: 'Qabul',
  waitlisted: 'Kutish',
  rejected: 'Rad',
  withdrawn: 'Qaytarilgan',
}

export const LEAD_STATUS: Record<string, string> = {
  new: 'Yangi',
  contacted: 'Bog‘lanildi',
  nurturing: 'Yetaklanmoqda',
  qualified: 'Mos',
  converted: 'Konvert',
  lost: 'Yo‘qotildi',
  next_season: 'Keyingi S',
}

export const SEASON_STATUS: Record<string, string> = {
  draft: 'Qoralama',
  applications_open: 'Ariza ochiq',
  applications_closed: 'Ariza yopiq',
  interview: 'Suhbat davri',
  selection_finalized: 'Tanlov yakun',
  program_running: 'Dastur',
  demo_day: 'Demo Day',
  closed: 'Yopiq',
  cancelled: 'Bekor',
}

export const TEAM_STATUS: Record<string, string> = {
  forming: 'Shakllanmoqda',
  active: 'Faol',
  accepted: 'Qabul',
  alumni: 'Alumni',
  disbanded: 'Tugatilgan',
}

export const CHANNEL: Record<string, string> = {
  telegram: 'Telegram',
  instagram: 'Instagram',
  facebook: 'Facebook',
  faculty: 'Fakultet',
  event: 'Tadbir',
  qr: 'QR',
  mentor: 'Mentor',
  referral: 'Referral',
  other: 'Boshqa',
  site: 'Sayt',
  ingest: 'Tizim',
  admin: 'Admin',
}

export function label(map: Record<string, string>, key?: string | null) {
  if (!key) return '—'
  return map[key] || key
}

export function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('uz-UZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function fmtDay(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const PIPELINE = [
  'draft',
  'submitted',
  'screening',
  'interview_invited',
  'interviewed',
  'waitlisted',
  'accepted',
  'rejected',
] as const

export const TONE: Record<string, 'neutral' | 'warn' | 'ok' | 'bad' | 'brand'> = {
  draft: 'neutral',
  submitted: 'brand',
  screening: 'warn',
  interview_invited: 'brand',
  interviewed: 'warn',
  accepted: 'ok',
  waitlisted: 'warn',
  rejected: 'bad',
  withdrawn: 'neutral',
  new: 'brand',
  contacted: 'warn',
  nurturing: 'warn',
  qualified: 'ok',
  converted: 'ok',
  lost: 'bad',
  next_season: 'neutral',
  todo: 'neutral',
  doing: 'warn',
  done: 'ok',
}
