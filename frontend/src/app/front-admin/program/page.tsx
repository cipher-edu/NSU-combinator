'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList } from '@/lib/admin-api'
import { Badge, Btn, Card, Err, Field, Input, Ok, PageHead, Select, Table, Textarea } from '@/components/admin/kit'

type Week = { id: string; week: number; title_uz: string; outcome_uz: string; season: string }
type Team = { id: string; name: string; status: string }
type Del = { id: string; week: string; week_n: number; team: string; team_name: string; status: string; url: string }
type Upd = { id: string; team_name: string; body: string; created_at: string }

export default function ProgramPage() {
  const [weeks, setWeeks] = useState<Week[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [dels, setDels] = useState<Del[]>([])
  const [updates, setUpdates] = useState<Upd[]>([])
  const [season, setSeason] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ week: '', team: '', status: 'submitted', url: '', body: '' })

  const load = useCallback(async () => {
    const seasons = asList(await adminApi<{ id: string; is_current: boolean }[] | { results: { id: string; is_current: boolean }[] }>('/api/v1/ops/seasons?page_size=20'))
    const cur = seasons.find((s) => s.is_current) || seasons[0]
    if (!cur) return
    setSeason(cur.id)
    const w = asList(await adminApi<Week[] | { results: Week[] }>(`/api/v1/ops/program-weeks?season=${cur.id}&page_size=40`))
    setWeeks(w)
    const t = asList(await adminApi<Team[] | { results: Team[] }>('/api/v1/ops/teams?page_size=80'))
    setTeams(t.filter((x) => x.status === 'accepted' || x.status === 'active'))
    const d = asList(await adminApi<Del[] | { results: Del[] }>('/api/v1/ops/deliverables?page_size=80'))
    setDels(d)
    const u = asList(await adminApi<Upd[] | { results: Upd[] }>('/api/v1/ops/updates?page_size=40'))
    setUpdates(u)
  }, [])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [load])

  async function sync() {
    try {
      await adminApi('/api/v1/ops/program-weeks/sync', { method: 'POST', body: JSON.stringify({ season }) })
      setMsg('Haftalar sinxronlandi')
      await load()
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : 'Xato')
    }
  }

  async function addDel(e: React.FormEvent) {
    e.preventDefault()
    await adminApi('/api/v1/ops/deliverables', {
      method: 'POST',
      body: JSON.stringify({ week: form.week, team: form.team, status: form.status, url: form.url }),
    })
    if (form.body) {
      await adminApi('/api/v1/ops/updates', {
        method: 'POST',
        body: JSON.stringify({ week: form.week, team: form.team, body: form.body, url: form.url }),
      })
    }
    setMsg('Yozildi')
    await load()
  }

  return (
    <>
      <PageHead
        kicker="Dastur"
        title="10 hafta"
        lead="Curriculum → jonli haftalar, deliverable, juma update, at-risk."
        actions={<Btn onClick={sync}>Haftalarni sinxronlash</Btn>}
      />
      <Err>{err}</Err>
      <Ok>{msg}</Ok>
      <div className="fa-grid fa-grid-4" style={{ marginBottom: 16 }}>
        {weeks.map((w) => (
          <Card key={w.id}>
            <p className="fa-kicker">{w.week}-hafta</p>
            <p style={{ fontWeight: 600, fontSize: 16 }}>{w.title_uz}</p>
            <p className="fa-lead">{w.outcome_uz}</p>
          </Card>
        ))}
        {!weeks.length && <p className="fa-lead">Avval sinxronlang — curriculum yoki 1…N hafta yaratiladi.</p>}
      </div>
      <Card style={{ marginBottom: 16 }}>
        <p className="fa-kicker">Deliverable / update</p>
        <form className="fa-form" style={{ marginTop: 10 }} onSubmit={addDel}>
          <div className="fa-grid fa-grid-3">
            <Select value={form.week} onChange={(e) => setForm({ ...form, week: e.target.value })} required>
              <option value="">Hafta</option>
              {weeks.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.week}. {w.title_uz}
                </option>
              ))}
            </Select>
            <Select value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} required>
              <option value="">Jamoa</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {['pending', 'submitted', 'late', 'missing'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <Input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <Textarea placeholder="Juma update" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <Btn type="submit">Yozish</Btn>
        </form>
      </Card>
      <Table
        columns={[
          { key: 'w', label: 'Hafta' },
          { key: 't', label: 'Jamoa' },
          { key: 's', label: 'Holat' },
          { key: 'u', label: 'URL' },
        ]}
        rows={dels.map((d) => ({
          _key: d.id,
          w: d.week_n,
          t: d.team_name,
          s: <Badge tone={d.status === 'submitted' ? 'ok' : d.status === 'late' ? 'warn' : 'neutral'}>{d.status}</Badge>,
          u: d.url || '—',
        }))}
        empty="Deliverable yo‘q"
      />
    </>
  )
}
