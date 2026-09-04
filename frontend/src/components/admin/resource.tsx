'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AdminApiError, adminApi, asList, qs } from '@/lib/admin-api'
import { Btn, Drawer, Err, Field, Input, PageHead, Select, Table, Textarea, useDebounced } from './kit'
import { RichEditor } from './RichEditor'

export type FieldSpec = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'select' | 'number' | 'datetime' | 'bool' | 'email' | 'url' | 'file' | 'rich'
  options?: { value: string; label: string }[]
  required?: boolean
}

function toLocalInput(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 16)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function fromLocalInput(v: string) {
  if (!v) return ''
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toISOString()
}

export function ResourcePage<T extends { id: string }>({
  kicker,
  title,
  lead,
  path,
  columns,
  fields,
  searchPlaceholder,
  extraFilters,
  toRow,
  extraActions,
  pageSize = 50,
}: {
  kicker: string
  title: string
  lead?: string
  path: string
  columns: { key: string; label: string; width?: string }[]
  fields: FieldSpec[]
  searchPlaceholder?: string
  extraFilters?: ReactNode
  toRow: (row: T) => Record<string, ReactNode>
  extraActions?: (reload: () => void) => ReactNode
  pageSize?: number
}) {
  const [rows, setRows] = useState<T[]>([])
  const [q, setQ] = useState('')
  const dq = useDebounced(q)
  const [err, setErr] = useState('')
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<T | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [file, setFile] = useState<Record<string, File | null>>({})

  const load = useCallback(async () => {
    setErr('')
    try {
      const d = await adminApi<T[] | { results: T[] }>(`${path}${qs({ search: dq, page_size: String(pageSize) })}`)
      setRows(asList(d))
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : 'Yuklanmadi')
    }
  }, [path, dq, pageSize])

  useEffect(() => {
    load()
  }, [load])

  function startCreate() {
    setEdit(null)
    setForm({})
    setFile({})
    setOpen(true)
  }

  function startEdit(row: T) {
    setEdit(row)
    const next: Record<string, string> = {}
    fields.forEach((f) => {
      const v = (row as Record<string, unknown>)[f.key]
      if (f.type === 'file') return
      if (f.type === 'bool') next[f.key] = v ? '1' : ''
      else if (f.type === 'datetime') next[f.key] = toLocalInput(v == null ? '' : String(v))
      else if (v != null) next[f.key] = String(v)
    })
    setForm(next)
    setFile({})
    setOpen(true)
  }

  function appendField(f: FieldSpec, put: (k: string, v: string) => void) {
    if (f.type === 'file') {
      if (file[f.key]) put(f.key, file[f.key] as unknown as string)
      return
    }
    if (f.type === 'bool') put(f.key, form[f.key] ? 'true' : 'false')
    else if (f.type === 'datetime') {
      const iso = fromLocalInput(form[f.key] || '')
      if (iso) put(f.key, iso)
    } else if (f.type === 'number') {
      if (form[f.key] !== '' && form[f.key] != null) put(f.key, form[f.key])
    } else {
      put(f.key, form[f.key] ?? '')
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    try {
      const hasFile = Object.values(file).some(Boolean)
      let body: BodyInit
      if (hasFile) {
        const fd = new FormData()
        fields.forEach((f) => {
          if (f.type === 'file') {
            if (file[f.key]) fd.append(f.key, file[f.key] as File)
          } else {
            appendField(f, (k, v) => fd.append(k, v))
          }
        })
        body = fd
      } else {
        const payload: Record<string, unknown> = {}
        fields.forEach((f) => {
          if (f.type === 'file') return
          if (f.type === 'bool') payload[f.key] = Boolean(form[f.key])
          else if (f.type === 'datetime') {
            const iso = fromLocalInput(form[f.key] || '')
            if (iso) payload[f.key] = iso
          } else if (f.type === 'number') {
            if (form[f.key] !== '' && form[f.key] != null) payload[f.key] = Number(form[f.key])
          } else if (f.key === 'slug' && !form[f.key]) {
            return
          } else payload[f.key] = form[f.key] ?? ''
        })
        body = JSON.stringify(payload)
      }
      await adminApi(edit ? `${path}/${edit.id}` : path, {
        method: edit ? 'PATCH' : 'POST',
        body,
      })
      setOpen(false)
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Saqlanmadi')
    }
  }

  async function remove(id: string) {
    if (!confirm('O‘chirasizmi?')) return
    setErr('')
    try {
      await adminApi(`${path}/${id}`, { method: 'DELETE' })
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'O‘chirilmadi')
    }
  }

  return (
    <>
      <PageHead
        kicker={kicker}
        title={title}
        lead={lead}
        actions={
          <>
            {extraActions?.(load)}
            <Btn onClick={startCreate}>Yangi</Btn>
          </>
        }
      />
      <div className="fa-toolbar">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder || 'Qidirish'} style={{ maxWidth: 280 }} />
        {extraFilters}
      </div>
      <Err>{err}</Err>
      <Table
        columns={[...columns, { key: '_a', label: '', width: '90px' }]}
        rows={rows.map((r) => ({
          _key: r.id,
          ...toRow(r),
          _a: (
            <span style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => startEdit(r)} style={{ color: '#c45200', fontSize: 12 }}>
                Tahrir
              </button>
              <button type="button" onClick={() => remove(r.id)} style={{ color: '#9f1d1d', fontSize: 12 }}>
                O‘chirish
              </button>
            </span>
          ),
        }))}
      />
      <Drawer open={open} title={edit ? 'Tahrirlash' : 'Yangi yozuv'} onClose={() => setOpen(false)} wide={fields.some((f) => f.type === 'rich')}>
        <form className="fa-form" onSubmit={save}>
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === 'rich' ? (
                <RichEditor value={form[f.key] || ''} onChange={(html) => setForm({ ...form, [f.key]: html })} />
              ) : f.type === 'textarea' ? (
                <Textarea value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              ) : f.type === 'select' ? (
                <Select value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                  <option value="">—</option>
                  {(f.options || []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              ) : f.type === 'bool' ? (
                <input type="checkbox" checked={Boolean(form[f.key])} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked ? '1' : '' })} />
              ) : f.type === 'file' ? (
                <Input type="file" onChange={(e) => setFile({ ...file, [f.key]: e.target.files?.[0] || null })} />
              ) : (
                <Input
                  type={f.type === 'datetime' ? 'datetime-local' : f.type || 'text'}
                  value={form[f.key] || ''}
                  required={f.required}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
            </Field>
          ))}
          <Btn type="submit">Saqlash</Btn>
        </form>
      </Drawer>
    </>
  )
}
