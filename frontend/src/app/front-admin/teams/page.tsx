'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList } from '@/lib/admin-api'
import { TEAM_STATUS, label } from '@/lib/admin-labels'
import { Badge, Btn, Drawer, Err, Field, Input, PageHead, Select, Table } from '@/components/admin/kit'

type T = {
  id: string
  name: string
  slug: string
  status: string
  one_liner_uz: string
  season_name: string
  memberships: { id: string; name: string; email: string; role: string; user_id: string }[]
}

export default function TeamsPage() {
  const [rows, setRows] = useState<T[]>([])
  const [err, setErr] = useState('')
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState<T | null>(null)
  const [form, setForm] = useState({ name: '', one_liner_uz: '', status: '' })

  const load = useCallback(async () => {
    const d = await adminApi<T[] | { results: T[] }>('/api/v1/ops/teams?page_size=80')
    setRows(asList(d))
  }, [])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [load])

  function openT(t: T) {
    setCur(t)
    setForm({ name: t.name, one_liner_uz: t.one_liner_uz, status: t.status })
    setOpen(true)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!cur) return
    try {
      await adminApi(`/api/v1/ops/teams/${cur.id}`, { method: 'PATCH', body: JSON.stringify(form) })
      setOpen(false)
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Xato')
    }
  }

  return (
    <>
      <PageHead kicker="Odamlar" title="Jamoalar" lead="A’zolar, holat, one-liner. Qabul qilingan jamoalar dasturga o‘tadi." />
      <Err>{err}</Err>
      <Table
        columns={[
          { key: 'n', label: 'Jamoa' },
          { key: 'st', label: 'Holat' },
          { key: 'm', label: 'A’zolar' },
          { key: 's', label: 'Mavsum' },
        ]}
        rows={rows.map((t) => ({
          _key: t.id,
          n: (
            <button type="button" onClick={() => openT(t)} style={{ textAlign: 'left' }}>
              <strong>{t.name}</strong>
              <div style={{ fontSize: 12, color: '#6d6b62' }}>{t.one_liner_uz || t.slug}</div>
            </button>
          ),
          st: <Badge tone={t.status}>{label(TEAM_STATUS, t.status)}</Badge>,
          m: t.memberships.map((m) => `${m.name}${m.role === 'lead' ? ' (lead)' : ''}`).join(', ') || '—',
          s: t.season_name,
        }))}
      />
      <Drawer open={open} title={cur?.name || ''} onClose={() => setOpen(false)}>
        <form className="fa-form" onSubmit={save}>
          <Field label="Nomi">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="One-liner">
            <Input value={form.one_liner_uz} onChange={(e) => setForm({ ...form, one_liner_uz: e.target.value })} />
          </Field>
          <Field label="Holat">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {Object.entries(TEAM_STATUS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <ul style={{ fontSize: 13 }}>
            {cur?.memberships.map((m) => (
              <li key={m.id}>
                {m.name} · {m.email} · {m.role}
              </li>
            ))}
          </ul>
          <Btn type="submit">Saqlash</Btn>
        </form>
      </Drawer>
    </>
  )
}
