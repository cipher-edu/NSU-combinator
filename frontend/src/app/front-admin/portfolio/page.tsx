'use client'

import { useEffect, useState } from 'react'
import { adminApi, asList } from '@/lib/admin-api'
import { ResourcePage } from '@/components/admin/resource'

export default function PortfolioAdminPage() {
  const [teams, setTeams] = useState<{ value: string; label: string }[]>([])
  const [seasons, setSeasons] = useState<{ value: string; label: string }[]>([])
  const [tracks, setTracks] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    adminApi<{ results?: { id: string; name: string }[] } | { id: string; name: string }[]>('/api/v1/ops/teams?page_size=80')
      .then((d) => setTeams(asList(d).map((t) => ({ value: t.id, label: t.name }))))
      .catch(() => {})
    adminApi<{ results?: { id: string; name_uz: string }[] } | { id: string; name_uz: string }[]>('/api/v1/ops/seasons?page_size=20')
      .then((d) => setSeasons(asList(d).map((s) => ({ value: s.id, label: s.name_uz }))))
      .catch(() => {})
    adminApi<{ results?: { id: string; name_uz: string }[] } | { id: string; name_uz: string }[]>('/api/v1/ops/tracks?page_size=40')
      .then((d) => setTracks(asList(d).map((t) => ({ value: t.id, label: t.name_uz }))))
      .catch(() => {})
  }, [])

  return (
    <ResourcePage
      kicker="Kontent"
      title="Portfolio"
      lead="Qabul qilingan jamoadan ommaviy yozuv."
      path="/api/v1/ops/portfolio"
      columns={[
        { key: 't', label: 'Jamoa' },
        { key: 's', label: 'Mavsum' },
        { key: 'p', label: 'Nashr' },
      ]}
      fields={[
        { key: 'team', label: 'Jamoa', type: 'select', options: teams, required: true },
        { key: 'season', label: 'Mavsum', type: 'select', options: seasons, required: true },
        { key: 'track', label: 'Yo‘nalish', type: 'select', options: tracks, required: true },
        { key: 'slug', label: 'Slug' },
        { key: 'summary_uz', label: 'Qisqa', type: 'textarea' },
        { key: 'website', label: 'Sayt', type: 'url' },
        { key: 'is_published', label: 'Nashr', type: 'bool' },
      ]}
      toRow={(r: { team_name: string; season_slug: string; is_published: boolean }) => ({
        t: r.team_name,
        s: r.season_slug,
        p: r.is_published ? 'ha' : 'yo‘q',
      })}
    />
  )
}
