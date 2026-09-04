'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CampaignRedirectPage() {
  const { code } = useParams<{ code: string }>()
  const router = useRouter()

  useEffect(() => {
    if (!code) return
    fetch(`/api/v1/public/go/${code}`)
      .then((r) => r.json())
      .then((json) => {
        const data = json.data || json
        if (data.code) localStorage.setItem('nsu_src', data.code)
        const dest = data.redirect || `/apply?src=${code}`
        if (String(dest).startsWith('http')) window.location.href = dest
        else router.replace(dest)
      })
      .catch(() => router.replace(`/apply?src=${code}`))
  }, [code, router])

  return (
    <main style={{ minHeight: '50vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui' }}>
      Yo‘naltirilmoqda…
    </main>
  )
}
