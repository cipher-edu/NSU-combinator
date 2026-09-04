export class ApiError extends Error {
  code: string
  status: number
  constructor(message: string, code = 'ERROR', status = 400) {
    super(message)
    this.code = code
    this.status = status
  }
}

export function getAccess() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('nsu_access')
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('nsu_access', access)
  localStorage.setItem('nsu_refresh', refresh)
}

export function clearTokens() {
  localStorage.removeItem('nsu_access')
  localStorage.removeItem('nsu_refresh')
}

type Envelope<T> = { success: boolean; data: T; code?: string; message?: string }

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const isForm = init.body instanceof FormData
  if (!isForm && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getAccess()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  let res = await fetch(path, { ...init, headers, cache: 'no-store' })
  if (res.status === 401 && token && (init.method || 'GET') === 'GET') {
    headers.delete('Authorization')
    res = await fetch(path, { ...init, headers, cache: 'no-store' })
  }
  const json = (await res.json()) as Envelope<T>
  if (!res.ok || json.success === false) {
    throw new ApiError(json.message || 'Xato yuz berdi', json.code || 'ERROR', res.status)
  }
  return json.data
}

export async function serverApi<T>(path: string): Promise<T | null> {
  const base = process.env.API_PROXY_TARGET || 'http://localhost:8002'
  try {
    const res = await fetch(`${base}${path}`, { cache: 'no-store' })
    const json = (await res.json()) as Envelope<T>
    if (!res.ok || json.success === false) return null
    return json.data
  } catch {
    return null
  }
}
