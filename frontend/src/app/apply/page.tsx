'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ApiError, api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import { Img } from '@/components/Img'

type OtpSend = { sent: boolean; debug_otp?: string }
type TokenPair = { access: string; refresh: string }

export default function ApplyPage() {
  const { t } = useI18n()
  const { user, onTokens } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [debug, setDebug] = useState('')
  const [consentPd, setConsentPd] = useState(false)
  const [consentMk, setConsentMk] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    const next = new URLSearchParams(window.location.search).get('next') || '/cabinet/apply'
    router.replace(next.startsWith('/') ? next : '/cabinet/apply')
  }, [user, router])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const d = await api<OtpSend>('/api/v1/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setSent(true)
      setDebug(d.debug_otp || '')
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : 'Xato')
    } finally {
      setBusy(false)
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const body: Record<string, unknown> = { email, code }
      if (consentPd) body.consent_pd = true
      if (consentMk) body.consent_marketing = true
      const d = await api<TokenPair>('/api/v1/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      await onTokens(d.access, d.refresh)
      router.replace('/cabinet')
    } catch (ex: unknown) {
      if (ex instanceof ApiError && ex.code === 'CONSENT_REQUIRED') setErr(t.consentPd)
      else setErr(ex instanceof Error ? ex.message : 'Xato')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-5xl items-center gap-12 px-5 py-16 sm:grid-cols-2 sm:px-6 animate-page-in">
      <div className="rise-in">
        <div className="group relative mb-8 overflow-hidden rounded-3xl">
          <Img src="/images/apply-hero.jpg" alt="" className="hero-photo-in aspect-[4/3] w-full object-cover" />
          <span className="sweep-blur pointer-events-none absolute inset-0" />
        </div>
        <p className="eyebrow">NSU Combinator</p>
        <h1 className="page-title mt-4">{t.tagline}</h1>
        <p className="hero-lede mt-4 text-muted">
          Emailga bir martalik kod yuboramiz. Google v1 da yo‘q — universitet OTP.
        </p>
      </div>
      <form
        onSubmit={sent ? verify : send}
        className="rounded-3xl border border-[var(--color-line)] bg-white/80 p-8 shadow-sm rise-in"
      >
        <h2 className="page-title text-[36px]">{t.applyTitle}</h2>
        <label className="mt-6 block text-[13px] text-muted">
          {t.email}
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 text-ink"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {sent && (
          <label className="mt-4 block text-[13px] text-muted">
            {t.code}
            {debug && <span className="ml-2 text-brand">(dev: {debug})</span>}
            <input
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 tracking-[0.3em]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </label>
        )}
        {sent && (
          <div className="mt-4 space-y-2 text-[13px]">
            <label className="flex gap-2">
              <input type="checkbox" checked={consentPd} onChange={(e) => setConsentPd(e.target.checked)} />
              {t.consentPd}
            </label>
            <label className="flex gap-2">
              <input type="checkbox" checked={consentMk} onChange={(e) => setConsentMk(e.target.checked)} />
              {t.consentMk}
            </label>
          </div>
        )}
        {err && <p className="mt-3 text-sm text-red-700">{err}</p>}
        <button
          disabled={busy}
          className="btn-primary cta-urgent mt-6 w-full"
        >
          {sent ? t.verifyCode : t.sendCode}
        </button>
      </form>
    </main>
  )
}
