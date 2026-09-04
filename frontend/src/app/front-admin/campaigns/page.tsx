'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList } from '@/lib/admin-api'
import { CHANNEL, label } from '@/lib/admin-labels'
import { Badge, Btn, Card, Drawer, Err, Field, Input, Ok, PageHead, Select, Table } from '@/components/admin/kit'

type Camp = {
  id: string
  code: string
  name: string
  channel: string
  destination: string
  faculty: string | null
  faculty_name: string | null
  is_active: boolean
  clicks: number
  leads_count: number
  apply_url: string
  telegram_url: string
}

type Fac = { id: string; name_uz: string }

export default function CampaignsPage() {
  const [rows, setRows] = useState<Camp[]>([])
  const [facs, setFacs] = useState<Fac[]>([])
  const [open, setOpen] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ name: '', code: '', channel: 'telegram', destination: 'apply', faculty: '', note: '' })

  const load = useCallback(async () => {
    const d = await adminApi<Camp[] | { results: Camp[] }>('/api/v1/ops/campaigns?page_size=80')
    setRows(asList(d))
  }, [])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
    adminApi<Fac[]>('/api/v1/ops/faculties').then((d) => setFacs(asList(d))).catch(() => {})
  }, [load])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    try {
      await adminApi('/api/v1/ops/campaigns', {
        method: 'POST',
        body: JSON.stringify({ ...form, faculty: form.faculty || null, code: form.code || undefined }),
      })
      setOpen(false)
      setForm({ name: '', code: '', channel: 'telegram', destination: 'apply', faculty: '', note: '' })
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Saqlanmadi')
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(window.location.origin + (text.startsWith('http') ? '' : '') + (text.startsWith('http') ? text : text))
    const full = text.startsWith('http') ? text : `${window.location.origin}${text}`
    navigator.clipboard.writeText(full)
    setMsg('Nusxa olindi: ' + full)
  }

  return (
    <>
      <PageHead
        kicker="Growth"
        title="Kampaniyalar"
        lead="Bitta kod — sayt, Telegram, Instagram, Facebook va fakultet QR."
        actions={<Btn onClick={() => setOpen(true)}>Yangi havola</Btn>}
      />
      <Err>{err}</Err>
      <Ok>{msg}</Ok>
      <Table
        columns={[
          { key: 'name', label: 'Kampaniya' },
          { key: 'ch', label: 'Kanal' },
          { key: 'clk', label: 'Klik' },
          { key: 'ld', label: 'Lead' },
          { key: 'a', label: 'Havola' },
        ]}
        rows={rows.map((r) => ({
          _key: r.id,
          name: (
            <>
              <strong>{r.name}</strong>
              <div style={{ fontSize: 12, color: '#6d6b62' }}>
                /r/{r.code}
                {r.faculty_name ? ` · ${r.faculty_name}` : ''}
              </div>
            </>
          ),
          ch: <Badge tone="brand">{label(CHANNEL, r.channel)}</Badge>,
          clk: r.clicks,
          ld: r.leads_count ?? 0,
          a: (
            <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" style={{ color: '#c45200', fontSize: 12 }} onClick={() => copy(r.apply_url)}>
                Sayt
              </button>
              {r.telegram_url && (
                <button type="button" style={{ color: '#c45200', fontSize: 12 }} onClick={() => copy(r.telegram_url)}>
                  Telegram
                </button>
              )}
            </span>
          ),
        }))}
        empty="Hali kampaniya yo‘q"
      />
      <Drawer open={open} title="Yangi havola" onClose={() => setOpen(false)}>
        <form className="fa-form" onSubmit={save}>
          <Field label="Nomi" hint="Masalan: S1 — Iqtisod fakulteti">
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Kod" hint="Bo‘sh qoldirsangiz avtomatik">
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="iqtisod" />
          </Field>
          <Field label="Kanal">
            <Select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
              {['telegram', 'instagram', 'facebook', 'faculty', 'event', 'qr', 'mentor', 'referral'].map((k) => (
                <option key={k} value={k}>
                  {label(CHANNEL, k)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Maqsad">
            <Select value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}>
              <option value="apply">Ariza sahifasi</option>
              <option value="telegram">Telegram bot</option>
            </Select>
          </Field>
          <Field label="Fakultet">
            <Select value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })}>
              <option value="">—</option>
              {facs.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name_uz}
                </option>
              ))}
            </Select>
          </Field>
          <Btn type="submit">Yaratish</Btn>
        </form>
      </Drawer>
      <div className="fa-grid fa-grid-3" style={{ marginTop: 20 }}>
        <Card>
          <p className="fa-kicker">Instagram / Facebook</p>
          <p className="fa-lead">Bio va storyga sayt havolasini qo‘ying. Ushlash Telegram+email drip orqali.</p>
        </Card>
        <Card>
          <p className="fa-kicker">Fakultet</p>
          <p className="fa-lead">Har dekanatga alohida kod. Liga dashboardda ko‘rinadi.</p>
        </Card>
        <Card>
          <p className="fa-kicker">QR</p>
          <p className="fa-lead">`/r/kod` ni plakatga qo‘ying. Kliklar shu yerda sanaladi.</p>
        </Card>
      </div>
    </>
  )
}
