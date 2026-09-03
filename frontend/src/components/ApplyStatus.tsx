'use client'

import type { Application } from '@/lib/types'

const PIPELINE = [
  { key: 'draft', label: 'To‘ldirish' },
  { key: 'submitted', label: 'Topshirildi' },
  { key: 'screening', label: 'Ko‘rib chiqish' },
  { key: 'interview_invited', label: 'Suhbat' },
  { key: 'interviewed', label: 'Suhbat o‘tdi' },
  { key: 'decision', label: 'Qaror' },
] as const

const LABELS: Record<string, string> = {
  draft: 'Qoralama — hali topshirilmagan',
  submitted: 'Ariza qabul qilindi, navbatda',
  screening: 'Operatorlar ko‘rib chiqmoqda',
  interview_invited: 'Suhbatga chaqirildingiz',
  interviewed: 'Suhbat o‘tdi, qaror kutilmoqda',
  accepted: 'Qabul qilindingiz',
  waitlisted: 'Kutish ro‘yxati',
  rejected: 'Bu mavsumda o‘tmadi',
  withdrawn: 'Ariza qaytarib olindi',
}

function pipeIndex(status: string) {
  if (status === 'withdrawn') return -1
  if (['accepted', 'waitlisted', 'rejected'].includes(status)) return 5
  const i = PIPELINE.findIndex((p) => p.key === status)
  return i < 0 ? 0 : i
}

export function ApplyStatus({ app }: { app: Application }) {
  const idx = pipeIndex(app.status)
  const decision =
    app.status === 'accepted' ? 'Qabul' : app.status === 'waitlisted' ? 'Kutish' : app.status === 'rejected' ? 'Yo‘q' : null

  return (
    <section className="rounded-2xl border border-black/5 bg-white/80 p-5">
      <p className="eyebrow">Ariza holati</p>
      <h2 className="mt-2 font-display text-2xl italic">{LABELS[app.status] || app.status}</h2>
      {app.submitted_at && (
        <p className="mt-1 text-[13px] text-muted">
          Topshirilgan: {new Date(app.submitted_at).toLocaleString('uz-UZ')}
        </p>
      )}
      <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-6">
        {PIPELINE.map((p, i) => {
          const on = idx >= i && idx >= 0
          const here = idx === i
          return (
            <li
              key={p.key}
              className={`rounded-xl px-3 py-2 text-[12px] ${
                here ? 'bg-brand text-white' : on ? 'bg-ink text-white' : 'bg-cream text-muted'
              }`}
            >
              <span className="block text-[10px] opacity-70">0{i + 1}</span>
              {i === 5 && decision ? decision : p.label}
            </li>
          )
        })}
      </ol>
      {app.progress && app.status === 'draft' && (
        <ul className="mt-4 grid gap-1 text-[12px] text-muted sm:grid-cols-2">
          {app.progress.map((p) => (
            <li key={p.id}>
              {p.n}. {p.title_uz} — {p.filled}/{p.required}
              {p.complete ? ' ✓' : ''}
            </li>
          ))}
        </ul>
      )}
      {app.events && app.events.length > 0 && (
        <ol className="mt-5 space-y-2 border-t border-black/5 pt-4 text-[13px] text-muted">
          {app.events.map((e) => (
            <li key={e.id}>
              <span className="text-ink">{e.from_status}</span> → <span className="text-ink">{e.to_status}</span>
              <span className="ml-2">{new Date(e.created_at).toLocaleString('uz-UZ')}</span>
              {e.note && <span className="ml-2">{e.note}</span>}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
