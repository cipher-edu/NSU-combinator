'use client'

import { useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList, qs } from '@/lib/admin-api'
import { useAdminAuth } from '@/lib/admin-auth'
import { Badge, Btn, Drawer, Err, Field, Input, Ok, PageHead, Select, Table } from '@/components/admin/kit'

type U = { id: string; email: string; name: string; role: string; has_password: boolean; capabilities: string[] }

export default function StaffPage() {
  const { user } = useAdminAuth()
  const [rows, setRows] = useState<U[]>([])
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'admin' })

  async function load() {
    const admins = await adminApi<U[] | { results: U[] }>(`/api/v1/ops/users${qs({ role: 'admin', page_size: '50' })}`)
    const supers = await adminApi<U[] | { results: U[] }>(`/api/v1/ops/users${qs({ role: 'superadmin', page_size: '20' })}`)
    setRows([...asList(supers), ...asList(admins)])
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    try {
      await adminApi('/api/v1/ops/users', { method: 'POST', body: JSON.stringify(form) })
      setOpen(false)
      setMsg('Xodim yaratildi')
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Xato')
    }
  }

  const canCreate = user?.role === 'superadmin'

  return (
    <>
      <PageHead
        kicker="Odamlar"
        title="Xodimlar"
        lead="Faqat superadmin yangi admin yaratadi. Parol — email orqali kirish uchun."
        actions={canCreate ? <Btn onClick={() => setOpen(true)}>Yangi xodim</Btn> : undefined}
      />
      <Err>{err}</Err>
      <Ok>{msg}</Ok>
      <Table
        columns={[
          { key: 'n', label: 'Xodim' },
          { key: 'r', label: 'Rol' },
          { key: 'p', label: 'Parol' },
        ]}
        rows={rows.map((u) => ({
          _key: u.id,
          n: (
            <>
              <strong>{u.name}</strong>
              <div style={{ fontSize: 12, color: '#6d6b62' }}>{u.email}</div>
            </>
          ),
          r: <Badge tone="brand">{u.role}</Badge>,
          p: u.has_password ? 'bor' : 'yo‘q',
        }))}
      />
      <Drawer open={open} title="Yangi xodim" onClose={() => setOpen(false)}>
        <form className="fa-form" onSubmit={create}>
          <Field label="Email">
            <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Ism">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Parol" hint="kamida 8 belgi">
            <Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Rol">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
              <option value="investor">Investor</option>
            </Select>
          </Field>
          <Btn type="submit">Yaratish</Btn>
        </form>
      </Drawer>
    </>
  )
}
