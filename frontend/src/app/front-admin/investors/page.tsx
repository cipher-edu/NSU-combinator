'use client'

import { useEffect, useState } from 'react'
import { adminApi, asList } from '@/lib/admin-api'
import { ResourcePage } from '@/components/admin/resource'
import { Tabs } from '@/components/admin/kit'

export default function InvestorsOpsPage() {
  const [tab, setTab] = useState('crm')
  const [teams, setTeams] = useState<{ value: string; label: string }[]>([])
  const [inv, setInv] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    adminApi<{ results?: { id: string; name: string }[] } | { id: string; name: string }[]>('/api/v1/ops/teams?page_size=80')
      .then((d) => setTeams(asList(d).map((t) => ({ value: t.id, label: t.name }))))
      .catch(() => {})
    adminApi<{ results?: { id: string; name: string }[] } | { id: string; name: string }[]>('/api/v1/ops/investors?page_size=80')
      .then((d) => setInv(asList(d).map((t) => ({ value: t.id, label: t.name }))))
      .catch(() => {})
  }, [])

  return (
    <>
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: 'crm', label: 'Qiziqish' },
          { id: 'cms', label: 'Sayt kartochkalari' },
        ]}
      />
      {tab === 'crm' ? (
        <ResourcePage
          kicker="Dastur"
          title="Investor follow-up"
          lead="Taklif, keldi, qiziqdi, intro. Marketing kartochkasi emas."
          path="/api/v1/ops/investor-interest"
          columns={[
            { key: 'i', label: 'Investor' },
            { key: 't', label: 'Jamoa' },
            { key: 's', label: 'Holat' },
          ]}
          fields={[
            { key: 'investor', label: 'Investor (CMS)', type: 'select', options: inv },
            { key: 'investor_name', label: 'Yoki ism' },
            { key: 'team', label: 'Jamoa', type: 'select', options: teams, required: true },
            {
              key: 'status',
              label: 'Holat',
              type: 'select',
              options: [
                { value: 'invited', label: 'Taklif' },
                { value: 'attended', label: 'Keldi' },
                { value: 'interested', label: 'Qiziqdi' },
                { value: 'intro', label: 'Intro' },
                { value: 'passed', label: 'O‘tdi' },
              ],
            },
            { key: 'notes', label: 'Izoh', type: 'textarea' },
          ]}
          toRow={(r: { investor_title: string | null; investor_name: string; team_name: string; status: string }) => ({
            i: r.investor_title || r.investor_name || '—',
            t: r.team_name,
            s: r.status,
          })}
        />
      ) : (
        <ResourcePage
          kicker="Kontent"
          title="Investorlar (sayt)"
          path="/api/v1/ops/investors"
          columns={[
            { key: 'n', label: 'Ism' },
            { key: 'o', label: 'Tashkilot' },
            { key: 'p', label: 'Nashr' },
          ]}
          fields={[
            { key: 'name', label: 'Ism', required: true },
            { key: 'title_uz', label: 'Lavozim' },
            { key: 'org', label: 'Tashkilot' },
            { key: 'slug', label: 'Slug' },
            { key: 'photo', label: 'Foto', type: 'file' },
            { key: 'order', label: 'Tartib', type: 'number' },
            { key: 'is_published', label: 'Nashr', type: 'bool' },
          ]}
          toRow={(r: { name: string; org: string; is_published: boolean }) => ({
            n: r.name,
            o: r.org,
            p: r.is_published ? 'ha' : 'yo‘q',
          })}
        />
      )}
    </>
  )
}
