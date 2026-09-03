'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { ApplyStatus } from '@/components/ApplyStatus'
import { CreateTeam, ProfileBox, TeamInvite, TelegramBox, profileBasicsDone } from '@/components/CabinetForms'
import type { Application, Faculty, Season, Team } from '@/lib/types'

export default function CabinetPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [season, setSeason] = useState<Season | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [apps, setApps] = useState<Application[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [err, setErr] = useState('')
  const [edit, setEdit] = useState<'profile' | 'telegram' | null>(null)

  useEffect(() => {
    if (!loading && !user) router.replace('/apply?next=/cabinet')
  }, [loading, user, router])

  async function load() {
    const [s, t, a, f] = await Promise.all([
      api<Season>('/api/v1/public/seasons/current').catch(() => null),
      api<{ results?: Team[] } | Team[]>('/api/v1/teams/mine/').catch(() => []),
      api<{ results?: Application[] } | Application[]>('/api/v1/applications/mine/').catch(() => []),
      api<Faculty[]>('/api/v1/public/faculties').catch(() => []),
    ])
    setSeason(s)
    setTeams(Array.isArray(t) ? t : t.results || [])
    setApps(Array.isArray(a) ? a : a.results || [])
    setFaculties(Array.isArray(f) ? f : [])
  }

  useEffect(() => {
    if (user) load()
  }, [user])

  if (loading || !user) return <main className="px-5 py-24 text-center text-muted">…</main>

  const isStaff = ['admin', 'superadmin'].includes(user.role) || user.capabilities?.includes('reviewer')
  const basics = profileBasicsDone(user)
  const team = teams[0]
  const app = team ? apps.find((x) => x.team === team.id) : undefined
  const applyReady = basics && user.telegram_linked && !!team

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
      <p className="kicker">Kabinet</p>
      <h1 className="mt-2 font-display text-4xl">{user.name || user.email}</h1>
      <p className="mt-1 text-sm text-muted">
        {user.email} · {user.role}
        {isStaff && (
          <Link href="/cabinet/review" className="ml-3 text-brand">
            Review →
          </Link>
        )}
      </p>

      <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/5 p-6">
        <p className="eyebrow">Ariza</p>
        <h2 className="mt-2 font-display text-3xl italic">
          {app?.status && app.status !== 'draft' ? 'Ariza holati' : '7 bosqichli ariza'}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Asoschilar, G‘oya, Bozor, O‘sish, Yuridik, Tavsiya, Resurslar.
        </p>
        {season && season.status !== 'applications_open' && (
          <p className="mt-2 text-sm text-red-700">Hozir ariza oynasi yopiq.</p>
        )}
        <Link href="/cabinet/apply" className="btn-primary mt-5 inline-flex h-11 px-6">
          {app ? (app.status === 'draft' ? 'Arizani davom ettirish' : 'Holatni ko‘rish') : 'Ariza topshirish'}
        </Link>
      </div>

      {app && (
        <div className="mt-6">
          <ApplyStatus app={app} />
        </div>
      )}

      <ul className="mt-8 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white/70 text-sm">
        <li className="flex items-center justify-between px-5 py-3">
          <span>Profil {basics ? '· tayyor' : '· to‘ldiring'}</span>
          <button type="button" className="text-brand" onClick={() => setEdit(edit === 'profile' ? null : 'profile')}>
            {edit === 'profile' ? 'Yopish' : 'Tahrirlash'}
          </button>
        </li>
        <li className="flex items-center justify-between px-5 py-3">
          <span>Telegram {user.telegram_linked ? `· @${user.telegram_username || 'ulangan'}` : '· ulanmagan'}</span>
          <button type="button" className="text-brand" onClick={() => setEdit(edit === 'telegram' ? null : 'telegram')}>
            {edit === 'telegram' ? 'Yopish' : user.telegram_linked ? 'Boshqarish' : 'Ulash'}
          </button>
        </li>
        <li className="flex items-center justify-between px-5 py-3">
          <span>Jamoa {team ? `· ${team.name}` : '· yo‘q'}</span>
          {!team && applyReady === false && user.telegram_linked && <span className="text-muted">pastda</span>}
        </li>
      </ul>

      {edit === 'profile' && <ProfileBox faculties={faculties} onSaved={() => { load(); setEdit(null) }} />}
      {edit === 'telegram' && <TelegramBox />}

      {!team && user.profile_complete && <CreateTeam onCreated={load} setErr={setErr} />}
      {team && (
        <div className="mt-6">
          <TeamInvite team={team} onChange={load} />
        </div>
      )}
      {err && <p className="mt-4 text-sm text-red-700">{err}</p>}
    </main>
  )
}
