'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList, qs } from '@/lib/admin-api'
import { CHANNEL, LEAD_STATUS, fmtDate, label } from '@/lib/admin-labels'
import { Badge, Btn, Drawer, Err, Field, Input, Ok, PageHead, Select, Table, Textarea, useDebounced } from '@/components/admin/kit'

type Lead = {
  id: string
  email: string
  name: string
  phone: string
  idea: string
  status: string
  source: string
  faculty_name: string | null
  campaign_code: string | null
  next_contact_at: string | null
  notes: string
  affiliation: string
  faculty: string | null
}

const STATUSES = Object.keys(LEAD_STATUS)

export default function LeadsPage() {
  const [rows, setRows] = useState<Lead[]>([])
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const dq = useDebounced(q)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Lead | null>(null)
  const [form, setForm] = useState({ email: '', name: '', phone: '', idea: '', notes: '', status: 'new', source: 'admin' })

  const load = useCallback(async () => {
    const d = await adminApi<Lead[] | { results: Lead[] }>(`/api/v1/ops/leads${qs({ status, search: dq, page_size: '80' })}`)
    setRows(asList(d))
  }, [status, dq])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [load])

  function start(row?: Lead) {
    setEdit(row || null)
    setForm({
      email: row?.email || '',
      name: row?.name || '',
      phone: row?.phone || '',
      idea: row?.idea || '',
      notes: row?.notes || '',
      status: row?.status || 'new',
      source: row?.source || 'admin',
    })
    setOpen(true)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    try {
      await adminApi(edit ? `/api/v1/ops/leads/${edit.id}` : '/api/v1/ops/leads', {
        method: edit ? 'PATCH' : 'POST',
        body: JSON.stringify(form),
      })
      setOpen(false)
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Saqlanmadi')
    }
  }

  async function convert(id: string) {
    setErr('')
    setMsg('')
    try {
      await adminApi(`/api/v1/ops/leads/${id}/convert`, { method: 'POST' })
      setMsg('Userga o‘tkazildi')
      await load()
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : 'Xato')
    }
  }

  async function ingest() {
    const d = await adminApi<{ created: number }>('/api/v1/ops/leads/ingest', { method: 'POST' })
    setMsg(`${d.created} ta avto-lead qo‘shildi`)
    await load()
  }

  return (
    <>
      <PageHead
        kicker="Kirish"
        title="Leadlar"
        lead="Arizadan oldingi qiziqish. Inbox — tizim topgan chala profillar."
        actions={
          <>
            <Btn variant="ghost" onClick={ingest}>
              Avto-inbox
            </Btn>
            <Btn onClick={() => start()}>Yangi lead</Btn>
          </>
        }
      />
      <div className="fa-toolbar">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="email, ism, g‘oya" style={{ maxWidth: 240 }} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">Barcha holat</option>
          {STATUSES.map((k) => (
            <option key={k} value={k}>
              {LEAD_STATUS[k]}
            </option>
          ))}
        </Select>
      </div>
      <Err>{err}</Err>
      <Ok>{msg}</Ok>
      <Table
        columns={[
          { key: 'who', label: 'Kim' },
          { key: 'idea', label: 'G‘oya' },
          { key: 'st', label: 'Holat' },
          { key: 'src', label: 'Manba' },
          { key: 'next', label: 'Keyingi aloqa' },
          { key: 'a', label: '' },
        ]}
        rows={rows.map((r) => ({
          _key: r.id,
          who: (
            <>
              <strong>{r.name || r.email}</strong>
              <div style={{ color: '#6d6b62', fontSize: 12 }}>{r.email}</div>
            </>
          ),
          idea: r.idea || '—',
          st: <Badge tone={r.status}>{label(LEAD_STATUS, r.status)}</Badge>,
          src: `${label(CHANNEL, r.source)}${r.campaign_code ? ` · ${r.campaign_code}` : ''}`,
          next: fmtDate(r.next_contact_at),
          a: (
            <span style={{ display: 'flex', gap: 8 }}>
              <button type="button" style={{ color: '#c45200', fontSize: 12 }} onClick={() => start(r)}>
                Ochish
              </button>
              {r.status !== 'converted' && (
                <button type="button" style={{ color: '#215c28', fontSize: 12 }} onClick={() => convert(r.id)}>
                  Konvert
                </button>
              )}
            </span>
          ),
        }))}
        empty="Lead yo‘q — kampaniya havolasi yoki avto-inbox ishlatib ko‘ring"
      />
      <Drawer open={open} title={edit ? 'Lead' : 'Yangi lead'} onClose={() => setOpen(false)}>
        <form className="fa-form" onSubmit={save}>
          <Field label="Email">
            <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Ism">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Telefon">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="G‘oya">
            <Input value={form.idea} onChange={(e) => setForm({ ...form, idea: e.target.value })} />
          </Field>
          <Field label="Holat">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((k) => (
                <option key={k} value={k}>
                  {LEAD_STATUS[k]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Manba">
            <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              {Object.entries(CHANNEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Izoh">
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <Btn type="submit">Saqlash</Btn>
        </form>
      </Drawer>
    </>
  )
}
