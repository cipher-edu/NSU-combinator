'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList } from '@/lib/admin-api'
import { SEASON_STATUS, fmtDay, label } from '@/lib/admin-labels'
import { Badge, Btn, Card, Drawer, Err, Field, Input, Ok, PageHead, Select, Table } from '@/components/admin/kit'

type S = {
  id: string
  slug: string
  name_uz: string
  status: string
  is_current: boolean
  program_weeks: number
  min_scores: number
  apply_opens_at: string | null
  apply_closes_at: string | null
  demo_day_at: string | null
  tracks: { id: string; slug: string; name_uz: string }[]
}

export default function SeasonsPage() {
  const [rows, setRows] = useState<S[]>([])
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState<S | null>(null)
  const [allowed, setAllowed] = useState<string[]>([])
  const [to, setTo] = useState('')
  const [form, setForm] = useState({ name_uz: '', slug: '', program_weeks: '10', min_scores: '2' })
  const [track, setTrack] = useState({ name_uz: '', slug: '' })

  const load = useCallback(async () => {
    const d = await adminApi<S[] | { results: S[] }>('/api/v1/ops/seasons?page_size=40')
    setRows(asList(d))
  }, [])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [load])

  async function openS(s: S) {
    setCur(s)
    setForm({
      name_uz: s.name_uz,
      slug: s.slug,
      program_weeks: String(s.program_weeks),
      min_scores: String(s.min_scores),
    })
    const al = await adminApi<{ to: string[] }>(`/api/v1/ops/seasons/${s.id}/allowed`)
    setAllowed(al.to || [])
    setTo(al.to?.[0] || '')
    setOpen(true)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (cur) {
        await adminApi(`/api/v1/ops/seasons/${cur.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ ...form, program_weeks: Number(form.program_weeks), min_scores: Number(form.min_scores) }),
        })
      } else {
        await adminApi('/api/v1/ops/seasons', {
          method: 'POST',
          body: JSON.stringify({ ...form, program_weeks: Number(form.program_weeks), min_scores: Number(form.min_scores) }),
        })
      }
      setOpen(false)
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Xato')
    }
  }

  async function transition() {
    if (!cur || !to) return
    try {
      await adminApi(`/api/v1/ops/seasons/${cur.id}/transition`, { method: 'POST', body: JSON.stringify({ to }) })
      setMsg('Mavsum holati yangilandi')
      setOpen(false)
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'O‘tish mumkin emas')
    }
  }

  async function addTrack() {
    if (!cur || !track.name_uz) return
    await adminApi('/api/v1/ops/tracks', {
      method: 'POST',
      body: JSON.stringify({ season: cur.id, name_uz: track.name_uz, slug: track.slug || undefined }),
    })
    setTrack({ name_uz: '', slug: '' })
    const s = await adminApi<S>(`/api/v1/ops/seasons/${cur.id}`)
    setCur(s)
    await load()
  }

  return (
    <>
      <PageHead
        kicker="Tanlov"
        title="Mavsumlar"
        lead="Ariza oynasi, suhbat, dastur, Demo Day — bitta state machine."
        actions={<Btn onClick={() => { setCur(null); setOpen(true); setAllowed([]) }}>Yangi mavsum</Btn>}
      />
      <Err>{err}</Err>
      <Ok>{msg}</Ok>
      <Table
        columns={[
          { key: 'n', label: 'Mavsum' },
          { key: 'st', label: 'Holat' },
          { key: 'd', label: 'Sanalar' },
          { key: 't', label: 'Yo‘nalish' },
        ]}
        rows={rows.map((s) => ({
          _key: s.id,
          n: (
            <button type="button" onClick={() => openS(s)} style={{ textAlign: 'left' }}>
              <strong>{s.name_uz}</strong> {s.is_current ? <Badge tone="ok">joriy</Badge> : null}
            </button>
          ),
          st: <Badge tone="brand">{label(SEASON_STATUS, s.status)}</Badge>,
          d: `yopilish ${fmtDay(s.apply_closes_at)} · demo ${fmtDay(s.demo_day_at)}`,
          t: s.tracks.map((t) => t.name_uz).join(', ') || '—',
        }))}
      />
      <Drawer open={open} title={cur ? cur.name_uz : 'Yangi mavsum'} onClose={() => setOpen(false)} wide>
        <form className="fa-form" onSubmit={save}>
          <Field label="Nomi">
            <Input required value={form.name_uz} onChange={(e) => setForm({ ...form, name_uz: e.target.value })} />
          </Field>
          <Field label="Slug">
            <Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Haftalar">
            <Input type="number" value={form.program_weeks} onChange={(e) => setForm({ ...form, program_weeks: e.target.value })} />
          </Field>
          <Field label="Min scores">
            <Input type="number" value={form.min_scores} onChange={(e) => setForm({ ...form, min_scores: e.target.value })} />
          </Field>
          <Btn type="submit">Saqlash</Btn>
        </form>
        {cur && (
          <>
            <div className="fa-form" style={{ marginTop: 20 }}>
              <p className="fa-kicker">Holat o‘tkazish</p>
              <Select value={to} onChange={(e) => setTo(e.target.value)}>
                {allowed.map((k) => (
                  <option key={k} value={k}>
                    {label(SEASON_STATUS, k)}
                  </option>
                ))}
              </Select>
              <Btn variant="ink" onClick={transition} disabled={!to}>
                O‘tkazish
              </Btn>
            </div>
            <div className="fa-form" style={{ marginTop: 20 }}>
              <p className="fa-kicker">Yo‘nalish qo‘shish</p>
              <Input placeholder="Nomi" value={track.name_uz} onChange={(e) => setTrack({ ...track, name_uz: e.target.value })} />
              <Btn variant="ghost" onClick={addTrack}>
                Qo‘shish
              </Btn>
              <ul>
                {cur.tracks.map((t) => (
                  <li key={t.id}>{t.name_uz}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
