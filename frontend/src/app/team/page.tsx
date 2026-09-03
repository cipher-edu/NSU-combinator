'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { PageTitle, PersonGrid } from '@/components/Chrome'
import { pick, useI18n } from '@/lib/i18n'
import type { Staff } from '@/lib/types'

export default function TeamPage() {
  const { t, lang } = useI18n()
  const [people, setPeople] = useState<Staff[]>([])
  useEffect(() => {
    api<Staff[]>('/api/v1/public/staff').then(setPeople).catch(() => {})
  }, [])
  return (
    <main className="pb-24">
      <PageTitle title={t.teamTitle} lead={t.teamLead} />
      <PersonGrid
        kind="team"
        people={people
          .filter((p) => p.slug !== 'admin')
          .map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            line: pick(lang, p.title_uz, p.title_en),
            photo: p.photo,
            linkedin: p.linkedin,
          }))}
      />
    </main>
  )
}
