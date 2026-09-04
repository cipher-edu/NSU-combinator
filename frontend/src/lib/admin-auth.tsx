'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { adminApi, clearAdminTokens, setAdminTokens } from './admin-api'

export type AdminUser = {
  id: string
  email: string
  name: string
  role: string
  capabilities: string[]
}

type Ctx = {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const C = createContext<Ctx | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const me = await adminApi<AdminUser>('/api/v1/auth/me')
      if (me.role !== 'admin' && me.role !== 'superadmin') {
        clearAdminTokens()
        setUser(null)
        return
      }
      setUser(me)
    } catch {
      setUser(null)
      clearAdminTokens()
    }
  }, [])

  useEffect(() => {
    const t = localStorage.getItem('nsu_crm_access')
    if (!t) {
      setLoading(false)
      return
    }
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const login = async (email: string, password: string) => {
    const d = await adminApi<{ access: string; refresh: string; user: AdminUser }>('/api/v1/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAdminTokens(d.access, d.refresh)
    setUser(d.user)
  }

  const logout = async () => {
    try {
      await adminApi('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh: localStorage.getItem('nsu_crm_refresh') }),
      })
    } catch {
      /* ignore */
    }
    clearAdminTokens()
    setUser(null)
  }

  return <C.Provider value={{ user, loading, login, logout, refresh }}>{children}</C.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(C)
  if (!ctx) throw new Error('AdminAuth')
  return ctx
}
