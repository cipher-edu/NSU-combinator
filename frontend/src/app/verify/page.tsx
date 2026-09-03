'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { PageTitle } from '@/components/Chrome'
import { useI18n } from '@/lib/i18n'

export default function VerifyPage() {
  const { t } = useI18n()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  async function go(e: React.FormEvent) {
    e.preventDefault()
    try {
      const d = await api<{ display_name: string; team?: string; season?: string }>(
        `/api/v1/certificates/verify?code=${encodeURIComponent(code)}`,
      )
      setMsg(`${d.display_name} · ${d.team || ''} · ${d.season || ''}`)
    } catch {
      setMsg('Kod topilmadi yoki sertifikat hali yo‘q (Phase 3).')
    }
  }
  return (
    <main className="pb-24">
      <PageTitle title={t.verifyTitle} lead={t.verifyLead} />
      <form onSubmit={go} className="mx-auto flex max-w-md gap-2 px-5">
        <input
          className="flex-1 rounded-lg border border-black/10 px-3 py-3"
          placeholder="NSU1-…"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="rounded-lg bg-ink px-5 font-semibold text-white">{t.verifyBtn}</button>
      </form>
      {msg && <p className="mt-6 text-center text-muted">{msg}</p>}
    </main>
  )
}
