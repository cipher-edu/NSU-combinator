'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { ApplyStatus } from '@/components/ApplyStatus'
import type { Application, ApplyStep } from '@/lib/types'

const NEXT: Record<string, string[]> = {
  submitted: ['screening', 'interview_invited', 'rejected'],
  screening: ['interview_invited', 'waitlisted', 'rejected'],
  interview_invited: ['interviewed', 'rejected'],
  interviewed: ['accepted', 'waitlisted', 'rejected'],
  waitlisted: ['accepted', 'rejected'],
}

function BroadcastBox() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all_linked')
  const [msg, setMsg] = useState('')
  async function send(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    try {
      await api('/api/v1/admin/notifications/broadcast/', {
        method: 'POST',
        body: JSON.stringify({ title, body, audience, channels: ['telegram', 'email'] }),
      })
      setTitle('')
      setBody('')
      setMsg('Navbatga qo‘yildi — Telegram va email.')
    } catch (ex: unknown) {
      setMsg(ex instanceof Error ? ex.message : 'Xato')
    }
  }
  return (
    <form onSubmit={send} className="mt-8 rounded-2xl border border-black/5 bg-white/80 p-5">
      <h2 className="font-display text-xl">Ommaviy habarnoma</h2>
      <p className="mt-1 text-sm text-muted">Telegram ulangan foydalanuvchilarga va emailga.</p>
      <input className="mt-3 w-full rounded-lg border px-3 py-2 text-sm" placeholder="Sarlavha" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="mt-2 h-24 w-full rounded-lg border px-3 py-2 text-sm" placeholder="Matn" value={body} onChange={(e) => setBody(e.target.value)} />
      <select className="mt-2 rounded-lg border px-3 py-2 text-sm" value={audience} onChange={(e) => setAudience(e.target.value)}>
        <option value="all_linked">Telegram ulanganlar</option>
        <option value="applicants">Arizachilar</option>
        <option value="accepted">Qabul qilinganlar</option>
        <option value="staff">Adminlar</option>
      </select>
      <button className="ml-3 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Yuborish</button>
      {msg && <p className="mt-2 text-sm text-muted">{msg}</p>}
    </form>
  )
}

export default function ReviewPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [apps, setApps] = useState<Application[]>([])
  const [steps, setSteps] = useState<ApplyStep[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!loading && !user) router.replace('/apply')
  }, [loading, user, router])

  async function load() {
    const d = await api<{ results?: Application[] } | Application[]>('/api/v1/admin/applications/')
    setApps(Array.isArray(d) ? d : d.results || [])
  }

  useEffect(() => {
    if (!user) return
    load().catch((e) => setErr(e.message))
    api<{ steps: ApplyStep[] }>('/api/v1/applications/form')
      .then((d) => setSteps(d.steps || []))
      .catch(() => {})
  }, [user])

  async function go(id: string, to: string) {
    setErr('')
    try {
      await api(`/api/v1/admin/applications/${id}/transition/`, {
        method: 'POST',
        body: JSON.stringify({ to }),
      })
      await load()
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : 'Xato')
    }
  }

  if (loading || !user) return <main className="py-24 text-center">…</main>

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <p className="kicker">Admin</p>
      <h1 className="font-display text-4xl">Arizalar</h1>
      <BroadcastBox />
      {err && <p className="mt-3 text-sm text-red-700">{err}</p>}
      <ul className="mt-8 space-y-4">
        {apps.map((a) => {
          const expanded = open === a.id
          const answers = a.answers || {}
          return (
            <li key={a.id} className="rounded-2xl border border-black/5 bg-white/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button type="button" className="text-left" onClick={() => setOpen(expanded ? null : a.id)}>
                  <p className="font-medium">{a.team_name}</p>
                  <p className="text-[13px] text-muted">
                    {a.track_slug} · {a.status}
                    {a.progress ? ` · ${a.progress.filter((p) => p.complete).length}/7 bosqich` : ''}
                  </p>
                </button>
                <div className="flex flex-wrap gap-1">
                  {(NEXT[a.status] || []).map((to) => (
                    <button
                      key={to}
                      type="button"
                      onClick={() => go(a.id, to)}
                      className="rounded-full border px-2 py-0.5 text-[11px] hover:bg-ink hover:text-white"
                    >
                      {to}
                    </button>
                  ))}
                </div>
              </div>
              {expanded && (
                <div className="mt-4 space-y-4 border-t border-black/5 pt-4">
                  <ApplyStatus app={a} />
                  {steps.map((s) => (
                    <div key={s.id}>
                      <p className="eyebrow">
                        {s.n}. {s.title_uz}
                      </p>
                      <dl className="mt-2 space-y-2 text-[14px]">
                        {s.questions.map((q) => (
                          <div key={q.id}>
                            <dt className="text-[12px] text-muted">{q.label_uz}</dt>
                            <dd className="whitespace-pre-wrap text-ink">{answers[q.id] || '—'}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
