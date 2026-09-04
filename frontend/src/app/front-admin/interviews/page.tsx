'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { adminApi, asList } from '@/lib/admin-api'
import { APP_STATUS, fmtDate, label } from '@/lib/admin-labels'
import { Badge, Btn, Err, PageHead, Table } from '@/components/admin/kit'

type I = {
  id: string
  application: string
  team_name: string
  application_status: string
  starts_at: string
  location: string
  cancelled_at: string | null
}

export default function InterviewsPage() {
  const [rows, setRows] = useState<I[]>([])
  const [err, setErr] = useState('')

  async function load() {
    const d = await adminApi<I[] | { results: I[] }>('/api/v1/ops/interviews?page_size=80')
    setRows(asList(d))
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [])

  async function cancel(id: string) {
    await adminApi(`/api/v1/ops/interviews/${id}/cancel`, { method: 'POST' })
    await load()
  }

  return (
    <>
      <PageHead kicker="Tanlov" title="Suhbatlar" lead="Belgilanган uchrashuvlar. Yangi suhbat ariza kartochkasidan." />
      <Err>{err}</Err>
      <Table
        columns={[
          { key: 't', label: 'Jamoa' },
          { key: 'when', label: 'Sana' },
          { key: 'loc', label: 'Joy' },
          { key: 'st', label: 'Ariza' },
          { key: 'a', label: '' },
        ]}
        rows={rows.map((r) => ({
          _key: r.id,
          t: <Link href={`/front-admin/applications/${r.application}`}>{r.team_name}</Link>,
          when: fmtDate(r.starts_at),
          loc: r.location || '—',
          st: r.cancelled_at ? <Badge tone="bad">bekor</Badge> : <Badge tone={r.application_status}>{label(APP_STATUS, r.application_status)}</Badge>,
          a: !r.cancelled_at && (
            <Btn small variant="ghost" onClick={() => cancel(r.id)}>
              Bekor
            </Btn>
          ),
        }))}
        empty="Suhbat yo‘q"
      />
    </>
  )
}
