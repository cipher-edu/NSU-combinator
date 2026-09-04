'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/admin-api'
import { APP_STATUS, label } from '@/lib/admin-labels'
import { Badge, Btn, Err, Field, PageHead, Select, Table } from '@/components/admin/kit'

type Row = {
  id: string
  team_name: string
  status: string
  track: string
  score_count: number
  min_scores: number
  score_avg: number | null
  assignments: { id: string; reviewer_email: string; submitted: boolean }[]
}

export default function ReviewsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [reviewers, setReviewers] = useState<{ id: string; email: string; name: string }[]>([])
  const [pick, setPick] = useState<Record<string, string>>({})
  const [err, setErr] = useState('')

  async function load() {
    const d = await adminApi<{ results: Row[]; reviewers: { id: string; email: string; name: string }[] }>('/api/v1/ops/reviews/board')
    setRows(d.results || [])
    setReviewers(d.reviewers || [])
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [])

  async function assign(appId: string) {
    const reviewer = pick[appId]
    if (!reviewer) return
    await adminApi(`/api/v1/ops/applications/${appId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ reviewer_id: reviewer }),
    })
    await load()
  }

  return (
    <>
      <PageHead kicker="Tanlov" title="Baholash" lead="Reviewer biriktirish, quorum va o‘rtacha ball." />
      <Err>{err}</Err>
      <Table
        columns={[
          { key: 't', label: 'Jamoa' },
          { key: 'st', label: 'Holat' },
          { key: 'sc', label: 'Ball' },
          { key: 'as', label: 'Reviewer' },
          { key: 'a', label: 'Biriktirish' },
        ]}
        rows={rows.map((r) => ({
          _key: r.id,
          t: r.team_name,
          st: <Badge tone={r.status}>{label(APP_STATUS, r.status)}</Badge>,
          sc: `${r.score_avg ?? '—'} (${r.score_count}/${r.min_scores})`,
          as: r.assignments.map((a) => `${a.reviewer_email}${a.submitted ? ' ✓' : ''}`).join(', ') || '—',
          a: (
            <span style={{ display: 'flex', gap: 6 }}>
              <Select value={pick[r.id] || ''} onChange={(e) => setPick({ ...pick, [r.id]: e.target.value })}>
                <option value="">—</option>
                {reviewers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
              <Btn small variant="ink" onClick={() => assign(r.id)}>
                +
              </Btn>
            </span>
          ),
        }))}
        empty="Topshirilgan ariza yo‘q"
      />
    </>
  )
}
