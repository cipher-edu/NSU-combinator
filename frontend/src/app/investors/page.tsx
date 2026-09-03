'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { PageTitle, PersonGrid } from '@/components/Chrome'
import { useI18n } from '@/lib/i18n'
import type { Investor } from '@/lib/types'

export default function InvestorsPage() {
  const { t } = useI18n()
  const [people, setPeople] = useState<Investor[]>([])
  useEffect(() => {
    api<Investor[]>('/api/v1/public/investors').then(setPeople).catch(() => {})
  }, [])
  return (
    <main className="pb-24">
      <PageTitle title={t.invTitle} lead={t.invLead} />
      <PersonGrid
        kind="investors"
        people={people.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          line: [p.title_uz, p.org].filter(Boolean).join(' · '),
          photo: p.photo,
        }))}
      />
    </main>
  )
}
