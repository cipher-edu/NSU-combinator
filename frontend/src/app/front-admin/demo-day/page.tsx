'use client'

import { useEffect, useState } from 'react'
import { adminApi, asList } from '@/lib/admin-api'
import { ResourcePage } from '@/components/admin/resource'

export default function DemoDayPage() {
  const [seasons, setSeasons] = useState<{ value: string; label: string }[]>([])
  const [teams, setTeams] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    adminApi<{ results?: { id: string; name_uz: string }[] } | { id: string; name_uz: string }[]>('/api/v1/ops/seasons?page_size=20')
      .then((d) => setSeasons(asList(d).map((s) => ({ value: s.id, label: s.name_uz }))))
      .catch(() => {})
    adminApi<{ results?: { id: string; name: string }[] } | { id: string; name: string }[]>('/api/v1/ops/teams?status=accepted&page_size=80')
      .then((d) => setTeams(asList(d).map((t) => ({ value: t.id, label: t.name }))))
      .catch(() => {})
  }, [])

  return (
    <ResourcePage
      kicker="Dastur"
      title="Demo Day"
      lead="Run-of-show: navbat, speaker, deck/demo/video checklist."
      path="/api/v1/ops/demo-slots"
      columns={[
        { key: 'o', label: '#' },
        { key: 't', label: 'Jamoa' },
        { key: 's', label: 'Speaker' },
        { key: 'c', label: 'Checklist' },
      ]}
      fields={[
        { key: 'season', label: 'Mavsum', type: 'select', options: seasons, required: true },
        { key: 'team', label: 'Jamoa', type: 'select', options: teams, required: true },
        { key: 'order', label: 'Tartib', type: 'number' },
        { key: 'speaker', label: 'Speaker' },
        { key: 'duration_sec', label: 'Davomiylik (s)', type: 'number' },
        { key: 'deck_ok', label: 'Deck', type: 'bool' },
        { key: 'demo_ok', label: 'Demo', type: 'bool' },
        { key: 'video_ok', label: 'Video', type: 'bool' },
        { key: 'tech_checked', label: 'Texnik', type: 'bool' },
        { key: 'notes', label: 'Izoh', type: 'textarea' },
      ]}
      toRow={(r: { order: number; team_name: string; speaker: string; deck_ok: boolean; demo_ok: boolean; video_ok: boolean; tech_checked: boolean }) => ({
        o: r.order,
        t: r.team_name,
        s: r.speaker || '—',
        c: [r.deck_ok && 'deck', r.demo_ok && 'demo', r.video_ok && 'video', r.tech_checked && 'tech'].filter(Boolean).join(' · ') || '—',
      })}
    />
  )
}
