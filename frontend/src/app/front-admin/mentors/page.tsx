'use client'

import { useEffect, useState } from 'react'
import { adminApi, asList } from '@/lib/admin-api'
import { ResourcePage } from '@/components/admin/resource'

export default function MentorsPage() {
  const [teams, setTeams] = useState<{ value: string; label: string }[]>([])
  const [users, setUsers] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    adminApi<{ results?: { id: string; name: string }[] } | { id: string; name: string }[]>('/api/v1/ops/teams?page_size=80')
      .then((d) => setTeams(asList(d).map((t) => ({ value: t.id, label: t.name }))))
      .catch(() => {})
    adminApi<{ results?: { id: string; name: string; email: string }[] } | { id: string; name: string; email: string }[]>(
      '/api/v1/ops/users?page_size=80',
    )
      .then((d) => setUsers(asList(d).map((u) => ({ value: u.id, label: `${u.name} · ${u.email}` }))))
      .catch(() => {})
  }, [])

  return (
    <>
      <ResourcePage
        kicker="Dastur"
        title="Mentorlar"
        lead="Jamoaga asosiy mentor va maslahatchi. Office hours pastroqda."
        path="/api/v1/ops/mentors"
        columns={[
          { key: 't', label: 'Jamoa' },
          { key: 'm', label: 'Mentor' },
          { key: 'k', label: 'Tur' },
        ]}
        fields={[
          { key: 'team', label: 'Jamoa', type: 'select', options: teams, required: true },
          { key: 'mentor', label: 'Mentor', type: 'select', options: users, required: true },
          {
            key: 'kind',
            label: 'Tur',
            type: 'select',
            options: [
              { value: 'primary', label: 'Asosiy' },
              { value: 'advisor', label: 'Maslahatchi' },
            ],
          },
          { key: 'notes', label: 'Izoh', type: 'textarea' },
        ]}
        toRow={(r: { team_name: string; mentor_name: string; mentor_email: string; kind: string }) => ({
          t: r.team_name,
          m: `${r.mentor_name} · ${r.mentor_email}`,
          k: r.kind,
        })}
      />
      <div style={{ height: 28 }} />
      <ResourcePage
        kicker="Dastur"
        title="Office hours"
        path="/api/v1/ops/office-hours"
        columns={[
          { key: 'm', label: 'Mentor' },
          { key: 't', label: 'Jamoa' },
          { key: 's', label: 'Boshlanish' },
          { key: 'st', label: 'Holat' },
        ]}
        fields={[
          { key: 'mentor', label: 'Mentor', type: 'select', options: users, required: true },
          { key: 'team', label: 'Jamoa', type: 'select', options: teams },
          { key: 'starts_at', label: 'Boshlanish', type: 'datetime', required: true },
          { key: 'notes', label: 'Izoh', type: 'textarea' },
          { key: 'summary', label: 'Xulosa', type: 'textarea' },
          {
            key: 'status',
            label: 'Holat',
            type: 'select',
            options: ['open', 'booked', 'done', 'cancelled'].map((v) => ({ value: v, label: v })),
          },
        ]}
        toRow={(r: { mentor_name: string; team_name: string | null; starts_at: string; status: string }) => ({
          m: r.mentor_name,
          t: r.team_name || '—',
          s: r.starts_at,
          st: r.status,
        })}
      />
    </>
  )
}
