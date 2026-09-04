export class AdminApiError extends Error {
  code: string
  status: number
  errors?: unknown
  constructor(message: string, code = 'ERROR', status = 400, errors?: unknown) {
    super(formatErrors(message, errors))
    this.code = code
    this.status = status
    this.errors = errors
  }
}

function formatErrors(message: string, errors?: unknown) {
  if (!errors || typeof errors !== 'object') return message
  const bits: string[] = []
  for (const [k, v] of Object.entries(errors as Record<string, unknown>)) {
    if (v == null) continue
    const text = Array.isArray(v) ? v.map(String).join(', ') : typeof v === 'object' ? JSON.stringify(v) : String(v)
    bits.push(`${k}: ${text}`)
  }
  return bits.length ? bits.join(' · ') : message
}

const ACCESS = 'nsu_crm_access'
const REFRESH = 'nsu_crm_refresh'

export function getAdminAccess() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS)
}

export function setAdminTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS, access)
  localStorage.setItem(REFRESH, refresh)
}

export function clearAdminTokens() {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
}

type Envelope<T> = { success: boolean; data: T; code?: string; message?: string; errors?: unknown }

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text) {
    if (res.ok) return undefined as T
    throw new AdminApiError('Xato yuz berdi', 'ERROR', res.status)
  }
  let json: Envelope<T>
  try {
    json = JSON.parse(text) as Envelope<T>
  } catch {
    throw new AdminApiError(res.ok ? 'Javob o‘qilmadi' : 'Xato yuz berdi', 'ERROR', res.status)
  }
  if (!res.ok || json.success === false) {
    throw new AdminApiError(json.message || 'Xato yuz berdi', json.code || 'ERROR', res.status, json.errors)
  }
  return json.data
}

export async function adminApi<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers)
  const isForm = init.body instanceof FormData
  if (!isForm && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getAdminAccess()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(path, { ...init, headers, cache: 'no-store' })
  if (res.status === 401 && retry && typeof window !== 'undefined') {
    const refresh = localStorage.getItem(REFRESH)
    if (refresh) {
      try {
        const r = await fetch('/api/v1/auth/token/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        })
        const json = (await r.json()) as Envelope<{ access: string; refresh?: string }>
        if (r.ok && json.success && json.data?.access) {
          setAdminTokens(json.data.access, json.data.refresh || refresh)
          return adminApi<T>(path, init, false)
        }
      } catch {
        /* fall through */
      }
    }
    clearAdminTokens()
  }
  return parse<T>(res)
}

export type Page<T> = {
  results: T[]
  count: number
  page: number
  total_pages: number
}

export function asList<T>(data: T[] | Page<T> | { results?: T[] }): T[] {
  if (Array.isArray(data)) return data
  return data.results || []
}

export function qs(params: Record<string, string | undefined | null>) {
  const u = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v) u.set(k, v)
  })
  const s = u.toString()
  return s ? `?${s}` : ''
}
