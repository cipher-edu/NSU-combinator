'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/admin-api'
import { APP_STATUS, LEAD_STATUS, SEASON_STATUS, fmtDate, label } from '@/lib/admin-labels'
import { Card, PageHead, Stat } from '@/components/admin/kit'

type Stats = {
  season: {
    id: string
    name_uz: string
    status: string
    apply_closes_at: string | null
    demo_day_at: string | null
    program_weeks: number
  } | null
  funnel_apps: Record<string, number>
  funnel_leads: Record<string, number>
  counts: {
    users: number
    teams: number
    leads: number
    interviews_upcoming: number
    reviews_pending: number
    tasks_open: number
    at_risk: number
  }
  faculty_league: { id: string; name: string; leads: number; applications: number }[]
  recent_events: { id: string; team: string; from_status: string; to_status: string; created_at: string }[]
  campaigns: { id: string; name: string; code: string; channel: string; clicks: number; leads: number }[]
}

const APP_KEYS = ['draft', 'submitted', 'screening', 'interview_invited', 'accepted', 'waitlisted', 'rejected']
const LEAD_KEYS = ['new', 'contacted', 'nurturing', 'qualified', 'converted']

export default function DashboardPage() {
  const [s, setS] = useState<Stats | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    adminApi<Stats>('/api/v1/ops/stats')
      .then(setS)
      .catch((e) => setErr(e.message))
  }, [])

  if (err) return <p className="fa-err">{err}</p>
  if (!s) return <p className="fa-lead">Hisobot yig‘ilmoqda…</p>

  return (
    <>
      <PageHead
        kicker="Operatsiya"
        title="Dashboard"
        lead={s.season ? `${s.season.name_uz} · ${label(SEASON_STATUS, s.season.status)}` : 'Joriy mavsum yo‘q'}
      />

      <div className="fa-grid fa-grid-4" style={{ marginBottom: 16 }}>
        <Card>
          <Stat label="Ochiq lead" value={s.counts.leads} />
        </Card>
        <Card>
          <Stat label="Foydalanuvchi" value={s.counts.users} />
        </Card>
        <Card>
          <Stat label="Jamoa" value={s.counts.teams} />
        </Card>
        <Card>
          <Stat label="Xavf ostida" value={s.counts.at_risk} hint="7 kun update yo‘q" />
        </Card>
      </div>

      <div className="fa-grid fa-grid-2" style={{ marginBottom: 16 }}>
        <Card>
          <p className="fa-kicker">Lead voronkasi</p>
          <div className="fa-funnel" style={{ marginTop: 10 }}>
            {LEAD_KEYS.map((k) => (
              <div key={k} className="fa-funnel-step">
                <b>{s.funnel_leads[k] || 0}</b>
                <span>{label(LEAD_STATUS, k)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="fa-kicker">Ariza voronkasi</p>
          <div className="fa-funnel" style={{ marginTop: 10 }}>
            {APP_KEYS.map((k) => (
              <div key={k} className="fa-funnel-step">
                <b>{s.funnel_apps[k] || 0}</b>
                <span>{label(APP_STATUS, k)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="fa-grid fa-grid-3" style={{ marginBottom: 16 }}>
        <Card>
          <Stat label="Suhbat (yaqin)" value={s.counts.interviews_upcoming} />
          <Link href="/front-admin/interviews" className="fa-kicker" style={{ display: 'inline-block', marginTop: 10, color: '#c45200' }}>
            Kalendarga →
          </Link>
        </Card>
        <Card>
          <Stat label="Baholanmagan" value={s.counts.reviews_pending} />
          <Link href="/front-admin/reviews" className="fa-kicker" style={{ display: 'inline-block', marginTop: 10, color: '#c45200' }}>
            Hay’at →
          </Link>
        </Card>
        <Card>
          <Stat label="Ochiq vazifa" value={s.counts.tasks_open} />
          <Link href="/front-admin/tasks" className="fa-kicker" style={{ display: 'inline-block', marginTop: 10, color: '#c45200' }}>
            Doska →
          </Link>
        </Card>
      </div>

      <div className="fa-grid fa-grid-2">
        <Card>
          <p className="fa-kicker">Fakultet ligasi</p>
          <ul style={{ marginTop: 12 }}>
            {s.faculty_league.slice(0, 8).map((f, i) => (
              <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #efece1', fontSize: 14 }}>
                <span>
                  {i + 1}. {f.name}
                </span>
                <span style={{ color: '#6d6b62' }}>
                  {f.leads} lead · {f.applications} ariza
                </span>
              </li>
            ))}
            {!s.faculty_league.length && <p className="fa-lead">Hali ma’lumot yo‘q</p>}
          </ul>
        </Card>
        <Card>
          <p className="fa-kicker">Oxirgi harakatlar</p>
          <ul style={{ marginTop: 12 }}>
            {s.recent_events.map((e) => (
              <li key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid #efece1', fontSize: 13.5 }}>
                <strong>{e.team}</strong>{' '}
                <span style={{ color: '#6d6b62' }}>
                  {label(APP_STATUS, e.from_status)} → {label(APP_STATUS, e.to_status)} · {fmtDate(e.created_at)}
                </span>
              </li>
            ))}
            {!s.recent_events.length && <p className="fa-lead">Hali event yo‘q</p>}
          </ul>
        </Card>
      </div>
    </>
  )
}
