'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList, qs } from '@/lib/admin-api'
import { Badge, Btn, Drawer, Err, Field, Input, Ok, PageHead, Select, Table, useDebounced } from '@/components/admin/kit'

type U = {
  id: string
  email: string
  name: string
  phone: string
  role: string
  affiliation: string
  is_student_verified: boolean
  telegram_linked: boolean
  faculty_name: string | null
  is_active: boolean
  profile_complete: boolean
}

export default function UsersPage() {
  const [rows, setRows] = useState<U[]>([])
  const [q, setQ] = useState('')
  const dq = useDebounced(q)
  const [role, setRole] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState<U | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', affiliation: '', role: '' })

  const load = useCallback(async () => {
    const d = await adminApi<U[] | { results: U[] }>(`/api/v1/ops/users${qs({ search: dq, role, page_size: '80' })}`)
    setRows(asList(d))
  }, [dq, role])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [load])

  function openU(u: U) {
    setCur(u)
    setForm({ name: u.name, phone: u.phone, affiliation: u.affiliation, role: u.role })
    setOpen(true)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!cur) return
    try {
      await adminApi(`/api/v1/ops/users/${cur.id}`, { method: 'PATCH', body: JSON.stringify(form) })
      setOpen(false)
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Xato')
    }
  }

  async function verify(id: string) {
    await adminApi(`/api/v1/ops/users/${id}/verify`, { method: 'POST' })
    setMsg('Tasdiqlandi')
    await load()
  }

  return (
    <>
      <PageHead kicker="Odamlar" title="Foydalanuvchilar" lead="Talaba, admin, investor. Tasdiq va rol shu yerda." />
      <div className="fa-toolbar">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="email / ism" style={{ maxWidth: 240 }} />
        <Select value={role} onChange={(e) => setRole(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">Barcha rol</option>
          {['applicant', 'admin', 'superadmin', 'investor'].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </div>
      <Err>{err}</Err>
      <Ok>{msg}</Ok>
      <Table
        columns={[
          { key: 'who', label: 'Foydalanuvchi' },
          { key: 'role', label: 'Rol' },
          { key: 'fac', label: 'Fakultet' },
          { key: 'tg', label: 'Telegram' },
          { key: 'a', label: '' },
        ]}
        rows={rows.map((u) => ({
          _key: u.id,
          who: (
            <>
              <strong>{u.name}</strong>
              <div style={{ fontSize: 12, color: '#6d6b62' }}>{u.email}</div>
            </>
          ),
          role: <Badge tone={u.role === 'applicant' ? 'neutral' : 'brand'}>{u.role}</Badge>,
          fac: u.faculty_name || '—',
          tg: u.telegram_linked ? 'ulangan' : 'yo‘q',
          a: (
            <span style={{ display: 'flex', gap: 8 }}>
              <button type="button" style={{ color: '#c45200', fontSize: 12 }} onClick={() => openU(u)}>
                Ochish
              </button>
              {!u.is_student_verified && (
                <button type="button" style={{ color: '#215c28', fontSize: 12 }} onClick={() => verify(u.id)}>
                  Tasdiq
                </button>
              )}
            </span>
          ),
        }))}
      />
      <Drawer open={open} title={cur?.email || ''} onClose={() => setOpen(false)}>
        <form className="fa-form" onSubmit={save}>
          <Field label="Ism">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Telefon">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Affiliation">
            <Select value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })}>
              <option value="">—</option>
              {['student', 'master', 'alumni', 'faculty', 'other'].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </Select>
          </Field>
          <Btn type="submit">Saqlash</Btn>
        </form>
      </Drawer>
    </>
  )
}
