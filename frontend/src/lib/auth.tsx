'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, clearTokens, setTokens } from './api'
import type { User } from './types'

type Auth = {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
  onTokens: (access: string, refresh: string) => Promise<void>
}

const Ctx = createContext<Auth | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const me = await api<User>('/api/v1/auth/me')
      setUser(me)
    } catch {
      setUser(null)
      clearTokens()
    }
  }, [])

  useEffect(() => {
    const t = localStorage.getItem('nsu_access')
    if (!t) {
      setLoading(false)
      return
    }
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const onTokens = async (access: string, refreshTok: string) => {
    setTokens(access, refreshTok)
    await refresh()
  }

  const logout = async () => {
    try {
      await api('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh: localStorage.getItem('nsu_refresh') }),
      })
    } catch {
      /* ignore */
    }
    clearTokens()
    setUser(null)
  }

  return <Ctx.Provider value={{ user, loading, refresh, logout, onTokens }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Auth')
  return ctx
}
