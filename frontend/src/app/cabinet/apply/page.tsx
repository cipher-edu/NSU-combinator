'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { ApplyWizard } from '@/components/ApplyWizard'
import { CreateTeam, ProfileBox, TelegramBox, profileBasicsDone } from '@/components/CabinetForms'
import type { Application, Faculty, Season, Team } from '@/lib/types'

export default function CabinetApplyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [season, setSeason] = useState<Season | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [apps, setApps] = useState<Application[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!loading && !user) router.replace('/apply?next=/cabinet/apply')
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

  const team = teams[0]
  const app = team ? apps.find((x) => x.team === team.id) : undefined
  const basics = profileBasicsDone(user)

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
      <p className="eyebrow">Ariza</p>
      <h1 className="mt-2 font-display text-4xl italic">Ariza topshirish</h1>
      <p className="mt-2 text-sm text-muted">
        7 bosqich: Asoschilar, G‘oya, Bozor, O‘sish, Yuridik, Tavsiya, Resurslar.
      </p>
      <ol className="mt-6 flex flex-wrap gap-2 text-[12px]">
        <li className="rounded-full bg-ink px-3 py-1 text-white">1. Email</li>
        <li className={`rounded-full px-3 py-1 ${basics ? 'bg-ink text-white' : 'bg-brand text-white'}`}>2. Profil</li>
        <li className={`rounded-full px-3 py-1 ${user.telegram_linked ? 'bg-ink text-white' : basics ? 'bg-brand text-white' : 'bg-cream'}`}>3. Telegram</li>
        <li className={`rounded-full px-3 py-1 ${team ? 'bg-ink text-white' : user.telegram_linked ? 'bg-brand text-white' : 'bg-cream'}`}>4. Jamoa</li>
        <li className={`rounded-full px-3 py-1 ${app && app.status !== 'draft' ? 'bg-ink text-white' : team ? 'bg-brand text-white' : 'bg-cream'}`}>5. 7 bosqich</li>
      </ol>

      {err && <p className="mt-4 text-sm text-red-700">{err}</p>}

      {!basics && <ProfileBox faculties={faculties} onSaved={load} />}
      {basics && !user.telegram_linked && <TelegramBox />}
      {basics && user.telegram_linked && !team && <CreateTeam onCreated={load} setErr={setErr} />}
      {team && (
        <>
          <p className="mt-8 text-sm text-muted">
            Jamoa: <strong className="text-ink">{team.name}</strong>
            {' · '}
            <Link href="/cabinet" className="link-hover text-brand">
              Kabinet
            </Link>
          </p>
          <ApplyWizard team={team} season={season} app={app} onChange={load} setErr={setErr} />
        </>
      )}
    </main>
  )
}
