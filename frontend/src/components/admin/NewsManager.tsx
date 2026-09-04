'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminApiError, adminApi, asList } from '@/lib/admin-api'
import { fmtDay } from '@/lib/admin-labels'
import { Badge, Btn, Err, Field, Input, Ok, PageHead } from './kit'
import { RichEditor } from './RichEditor'

type News = {
  id: string
  slug: string
  title_uz: string
  title_en: string
  body_uz: string
  body_en: string
  cover: string | null
  youtube_url: string
  published_at: string | null
  is_published: boolean
}

const empty: Omit<News, 'id'> = {
  slug: '',
  title_uz: '',
  title_en: '',
  body_uz: '',
  body_en: '',
  cover: null,
  youtube_url: '',
  published_at: null,
  is_published: false,
}

export function NewsManager() {
  const [rows, setRows] = useState<News[]>([])
  const [cur, setCur] = useState<(News & { id?: string }) | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    const d = await adminApi<News[] | { results: News[] }>('/api/v1/ops/news?page_size=80')
    setRows(asList(d))
  }, [])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
  }, [load])

  function startNew() {
    setCur({ ...empty })
    setCoverFile(null)
    setErr('')
    setMsg('')
  }

  function open(n: News) {
    setCur({ ...n })
    setCoverFile(null)
    setErr('')
    setMsg('')
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!cur) return
    setErr('')
    setMsg('')
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('title_uz', cur.title_uz)
      if (cur.title_en) fd.append('title_en', cur.title_en)
      if (cur.slug) fd.append('slug', cur.slug)
      fd.append('body_uz', cur.body_uz || '')
      if (cur.body_en) fd.append('body_en', cur.body_en)
      fd.append('youtube_url', cur.youtube_url || '')
      fd.append('is_published', cur.is_published ? 'true' : 'false')
      if (coverFile) fd.append('cover', coverFile)
      const url = cur.id ? `/api/v1/ops/news/${cur.id}` : '/api/v1/ops/news'
      const saved = await adminApi<News>(url, { method: cur.id ? 'PATCH' : 'POST', body: fd })
      setCur(saved)
      setCoverFile(null)
      setMsg('Saqlandi')
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Saqlanmadi')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!cur?.id || !confirm('Yangilik o‘chirilsinmi?')) return
    try {
      await adminApi(`/api/v1/ops/news/${cur.id}`, { method: 'DELETE' })
      setCur(null)
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'O‘chirilmadi')
    }
  }

  const filtered = rows.filter((r) => {
    const s = q.trim().toLowerCase()
    if (!s) return true
    return r.title_uz.toLowerCase().includes(s) || r.slug.toLowerCase().includes(s)
  })

  return (
    <div className="fa-news">
      <PageHead
        kicker="Kontent"
        title="Yangiliklar"
        lead="Sarlavha, muqova, rich-text matn. Nashr qilinganda saytdagi /news da chiqadi."
        actions={<Btn onClick={startNew}>Yangi yangilik</Btn>}
      />
      <Err>{err}</Err>
      <Ok>{msg}</Ok>
      <div className="fa-news-layout">
        <aside className="fa-news-list">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Qidirish" />
          <ul>
            {filtered.map((n) => (
              <li key={n.id}>
                <button type="button" className={cur?.id === n.id ? 'on' : ''} onClick={() => open(n)}>
                  <strong>{n.title_uz}</strong>
                  <small>
                    {n.is_published ? 'Nashr' : 'Qoralama'} · {fmtDay(n.published_at)}
                  </small>
                </button>
              </li>
            ))}
            {!filtered.length && <li className="fa-lead" style={{ padding: 12 }}>Yangilik yo‘q</li>}
          </ul>
        </aside>
        <div>
          {!cur ? (
            <div className="fa-empty">Chapdan tanlang yoki yangi yarating.</div>
          ) : (
            <form className="fa-form fa-news-form" onSubmit={save}>
              <div className="fa-grid fa-grid-2">
                <Field label="Sarlavha (uz)">
                  <Input required value={cur.title_uz} onChange={(e) => setCur({ ...cur, title_uz: e.target.value })} />
                </Field>
                <Field label="Sarlavha (en)">
                  <Input value={cur.title_en || ''} onChange={(e) => setCur({ ...cur, title_en: e.target.value })} />
                </Field>
              </div>
              <div className="fa-grid fa-grid-2">
                <Field label="Slug" hint="Bo‘sh qoldirsangiz avtomatik">
                  <Input value={cur.slug || ''} onChange={(e) => setCur({ ...cur, slug: e.target.value })} />
                </Field>
                <Field label="YouTube">
                  <Input value={cur.youtube_url || ''} onChange={(e) => setCur({ ...cur, youtube_url: e.target.value })} placeholder="https://youtube.com/..." />
                </Field>
              </div>
              <Field label="Muqova">
                {cur.cover && !coverFile && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cur.cover} alt="" className="fa-news-cover" />
                )}
                <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
              </Field>
              <label className="fa-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={cur.is_published}
                  onChange={(e) => setCur({ ...cur, is_published: e.target.checked })}
                />
                Saytda nashr qilish
                {cur.is_published && <Badge tone="ok">ommaviy</Badge>}
              </label>
              <Field label="Matn (o‘zbek)">
                <RichEditor value={cur.body_uz || ''} onChange={(html) => setCur({ ...cur, body_uz: html })} />
              </Field>
              <Field label="Matn (ingliz, ixtiyoriy)">
                <RichEditor value={cur.body_en || ''} onChange={(html) => setCur({ ...cur, body_en: html })} />
              </Field>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Btn type="submit" disabled={busy}>
                  {busy ? 'Saqlanmoqda…' : 'Saqlash'}
                </Btn>
                {cur.id && (
                  <Btn type="button" variant="danger" onClick={remove}>
                    O‘chirish
                  </Btn>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
