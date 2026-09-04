'use client'

import { useEffect, useState } from 'react'
import { adminApi, asList } from '@/lib/admin-api'
import { ResourcePage } from '@/components/admin/resource'
import { Card } from '@/components/admin/kit'

type League = { id: string; name: string; leads: number; applications: number }

export default function FacultyPage() {
  const [league, setLeague] = useState<League[]>([])
  useEffect(() => {
    adminApi<{ faculty_league: League[] }>('/api/v1/ops/stats')
      .then((d) => setLeague(d.faculty_league || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <div className="fa-grid fa-grid-2" style={{ marginBottom: 20 }}>
        <Card>
          <p className="fa-kicker">Liga</p>
          <ul style={{ marginTop: 10 }}>
            {league.map((f, i) => (
              <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #efece1', fontSize: 14 }}>
                <span>
                  {i + 1}. {f.name}
                </span>
                <span style={{ color: '#6d6b62' }}>
                  {f.leads} / {f.applications}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="fa-kicker">Qanday ishlaydi</p>
          <p className="fa-lead">Har fakultetga kampaniya kodi bering. Koordinator faqat o‘z fakultet lead/arizasini ko‘radi — to‘liq admin emas.</p>
        </Card>
      </div>
      <ResourcePage
        kicker="Odamlar"
        title="Fakultetlar"
        path="/api/v1/ops/faculties"
        columns={[
          { key: 'n', label: 'Nomi' },
          { key: 's', label: 'Slug' },
          { key: 'a', label: 'Faol' },
        ]}
        fields={[
          { key: 'name_uz', label: 'Nomi (uz)', required: true },
          { key: 'name_en', label: 'Nomi (en)' },
          { key: 'slug', label: 'Slug' },
          { key: 'is_active', label: 'Faol', type: 'bool' },
        ]}
        toRow={(r: { name_uz: string; slug: string; is_active: boolean }) => ({
          n: r.name_uz,
          s: r.slug,
          a: r.is_active ? 'ha' : 'yo‘q',
        })}
      />
    </>
  )
}
