'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList } from '@/lib/admin-api'
import { fmtDate } from '@/lib/admin-labels'
import { Btn, Err, Field, Input, Ok, PageHead, Select, Table, Textarea } from '@/components/admin/kit'

type B = {
  id: string
  title: string
  audience: string
  channels: string[]
  total: number
  sent_ok: number
  sent_fail: number
  created_at: string
}

export default function NotificationsPage() {
  const [rows, setRows] = useState<B[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all_linked')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const d = await adminApi<B[] | { results: B[] }>('/api/v1/ops/broadcasts')
    setRows(asList(d))
  }, [])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [load])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setMsg('')
    try {
      await adminApi('/api/v1/ops/broadcasts', {
        method: 'POST',
        body: JSON.stringify({ title, body, audience, channels: ['telegram', 'email'] }),
      })
      setTitle('')
      setBody('')
      setMsg('Navbatga qo‘yildi')
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Yuborilmadi')
    }
  }

  return (
    <>
      <PageHead kicker="Kontent" title="Habarnoma" lead="Broadcast: Telegram va email. Drip keyingi iteratsiyada avtomatik." />
      <form className="fa-card fa-form" style={{ marginBottom: 20, maxWidth: 640 }} onSubmit={send}>
        <Field label="Sarlavha">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <Field label="Matn">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        </Field>
        <Field label="Auditoria">
          <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
            <option value="all_linked">Telegram ulanganlar</option>
            <option value="applicants">Arizachilar</option>
            <option value="accepted">Qabul qilinganlar</option>
            <option value="staff">Xodimlar</option>
          </Select>
        </Field>
        <Btn type="submit">Yuborish</Btn>
        <Err>{err}</Err>
        <Ok>{msg}</Ok>
      </form>
      <Table
        columns={[
          { key: 't', label: 'Sarlavha' },
          { key: 'a', label: 'Kimga' },
          { key: 's', label: 'Natija' },
          { key: 'd', label: 'Sana' },
        ]}
        rows={rows.map((r) => ({
          _key: r.id,
          t: r.title,
          a: r.audience,
          s: `${r.sent_ok}/${r.total} · xato ${r.sent_fail}`,
          d: fmtDate(r.created_at),
        }))}
        empty="Hali broadcast yo‘q"
      />
    </>
  )
}
