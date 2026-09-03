'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'

function Inner() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/apply')
      return
    }
    if (!user || !token) return
    api('/api/v1/teams/invites/accept/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then(() => router.replace('/cabinet'))
      .catch((e: Error) => setMsg(e.message))
  }, [user, loading, token, router])

  return <main className="px-5 py-24 text-center text-muted">{msg || 'Taklif qabul qilinmoqda…'}</main>
}

export default function InvitePage() {
  return (
    <Suspense fallback={<main className="py-24 text-center">…</main>}>
      <Inner />
    </Suspense>
  )
}
