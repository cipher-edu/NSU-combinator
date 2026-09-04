'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminApiError, adminApi, asList, qs, type Page } from '@/lib/admin-api'
import { PIPE_COLS, progressLabel, statusTitle, type AdminApp, type AppMeta } from '@/lib/admin-apps'
import { APP_STATUS, fmtDate, label } from '@/lib/admin-labels'
import { Badge, Btn, Err, Input, Ok, PageHead, Select, Tabs, useDebounced } from '@/components/admin/kit'

export default function ApplicationsPage() {
  const router = useRouter()
  const [rows, setRows] = useState<AdminApp[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [status, setStatus] = useState('')
  const [season, setSeason] = useState('')
  const [track, setTrack] = useState('')
  const [faculty, setFaculty] = useState('')
  const [q, setQ] = useState('')
  const dq = useDebounced(q, 280)
  const [meta, setMeta] = useState<AppMeta | null>(null)
  const [summary, setSummary] = useState<Record<string, number>>({})
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi<AppMeta>('/api/v1/ops/applications/meta')
      .then((d) => {
        setMeta(d)
        const cur = d.seasons.find((s) => s.is_current)
        if (cur) setSeason(cur.id)
      })
      .catch(() => {})
  }, [])

  const load = useCallback(async () => {
    setErr('')
    setLoading(true)
    try {
      const params = {
        status,
        season,
        track,
        faculty,
        search: dq,
        page: view === 'table' ? String(page) : '1',
        page_size: view === 'kanban' ? '200' : '20',
      }
      const d = await adminApi<Page<AdminApp> | AdminApp[]>(`/api/v1/ops/applications${qs(params)}`)
      if (Array.isArray(d)) {
        setRows(d)
        setCount(d.length)
        setPages(1)
      } else {
        setRows(d.results || [])
        setCount(d.count || 0)
        setPages(d.total_pages || 1)
      }
      const s = await adminApi<{ by_status: Record<string, number>; total: number }>(
        `/api/v1/ops/applications/summary${qs({ season, track, faculty })}`,
      )
      setSummary(s.by_status || {})
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : 'Yuklanmadi')
    } finally {
      setLoading(false)
    }
  }, [status, season, track, faculty, dq, page, view])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [status, season, track, faculty, dq, view])

  const grouped = useMemo(() => {
    const g: Record<string, AdminApp[]> = {}
    PIPE_COLS.forEach((k) => {
      g[k] = []
    })
    rows.forEach((r) => {
      if (!g[r.status]) g[r.status] = []
      g[r.status].push(r)
    })
    return g
  }, [rows])

  const tracks = useMemo(() => {
    if (!meta) return []
    return season ? meta.tracks.filter((t) => t.season === season) : meta.tracks
  }, [meta, season])

  async function go(app: AdminApp, to: string, e?: React.MouseEvent) {
    e?.preventDefault()
    e?.stopPropagation()
    if (!confirm(`${app.team_name} → ${statusTitle(to)}?`)) return
    setBusy(app.id)
    setErr('')
    setMsg('')
    try {
      await adminApi(`/api/v1/ops/applications/${app.id}/transition`, {
        method: 'POST',
        body: JSON.stringify({ to }),
      })
      setMsg(`${app.team_name}: ${statusTitle(to)}`)
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'O‘tmadi')
    } finally {
      setBusy(null)
    }
  }

  const total = Object.values(summary).reduce((a, b) => a + b, 0)

  return (
    <div className="fa-apps">
      <PageHead
        kicker="Tanlov"
        title="Arizalar"
        lead="Voronka, 7 bosqich, holat o‘tkazish. Kartochkani ochib to‘liq boshqaring."
        actions={
          <>
            <Btn variant="ghost" onClick={load}>
              Yangilash
            </Btn>
            <span className="fa-kicker" style={{ alignSelf: 'center' }}>
              {total} ta
            </span>
          </>
        }
      />

      <div className="fa-funnel fa-apps-funnel">
        <button type="button" className={`fa-funnel-step ${!status ? 'on' : ''}`} onClick={() => setStatus('')}>
          <b>{total}</b>
          <span>Barchasi</span>
        </button>
        {PIPE_COLS.map((k) => (
          <button
            key={k}
            type="button"
            className={`fa-funnel-step ${status === k ? 'on' : ''}`}
            onClick={() => setStatus(status === k ? '' : k)}
          >
            <b>{summary[k] || 0}</b>
            <span>{label(APP_STATUS, k)}</span>
          </button>
        ))}
      </div>

      <div className="fa-toolbar">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jamoa, lead, email…" style={{ maxWidth: 260 }} />
        <Select value={season} onChange={(e) => setSeason(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">Barcha mavsum</option>
          {(meta?.seasons || []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name_uz}
              {s.is_current ? ' · joriy' : ''}
            </option>
          ))}
        </Select>
        <Select value={track} onChange={(e) => setTrack(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">Yo‘nalish</option>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name_uz}
            </option>
          ))}
        </Select>
        <Select value={faculty} onChange={(e) => setFaculty(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">Fakultet</option>
          {(meta?.faculties || []).map((f) => (
            <option key={f.id} value={f.id}>
              {f.name_uz}
            </option>
          ))}
        </Select>
        <Tabs
          value={view}
          onChange={(v) => setView(v as 'kanban' | 'table')}
          items={[
            { id: 'kanban', label: 'Kanban' },
            { id: 'table', label: 'Jadval' },
          ]}
        />
      </div>
      <Err>{err}</Err>
      <Ok>{msg}</Ok>

      {loading && !rows.length ? (
        <p className="fa-lead">Yuklanmoqda…</p>
      ) : view === 'kanban' ? (
        <div className="fa-apps-kanban">
          {PIPE_COLS.map((k) => (
            <section key={k} className="fa-apps-col">
              <header>
                <h3>{label(APP_STATUS, k)}</h3>
                <span>{grouped[k]?.length || 0}</span>
              </header>
              <div className="fa-apps-col-body">
                {(grouped[k] || []).map((a) => (
                  <article key={a.id} className={`fa-app-card ${busy === a.id ? 'busy' : ''}`}>
                    <Link href={`/front-admin/applications/${a.id}`}>
                      <strong>{a.team_name}</strong>
                      {a.one_liner && <p>{a.one_liner}</p>}
                      <small>
                        {a.track_name || a.track_slug} · {a.lead_name || 'lead yo‘q'}
                        {a.faculty_name ? ` · ${a.faculty_name}` : ''}
                      </small>
                      <div className="fa-app-meta">
                        <span>{progressLabel(a.progress)}</span>
                        {a.score_avg != null && <span>ball {a.score_avg}</span>}
                        {a.submitted_at && <span>{fmtDate(a.submitted_at)}</span>}
                      </div>
                    </Link>
                    {(a.allowed_to || []).length > 0 && (
                      <div className="fa-app-next">
                        {a.allowed_to.slice(0, 3).map((to) => (
                          <button key={to} type="button" disabled={busy === a.id} onClick={(e) => go(a, to, e)}>
                            {statusTitle(to)}
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
                {!(grouped[k] || []).length && <p className="fa-apps-empty">Bo‘sh</p>}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <>
          <div className="fa-table-wrap">
            <table className="fa-table">
              <thead>
                <tr>
                  <th>Jamoa</th>
                  <th>Holat</th>
                  <th>Yo‘nalish</th>
                  <th>Lead</th>
                  <th>Bosqich</th>
                  <th>Ball</th>
                  <th>Topshirilgan</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="fa-row-click" onClick={() => router.push(`/front-admin/applications/${a.id}`)}>
                    <td>
                      <strong>{a.team_name}</strong>
                      <div style={{ fontSize: 12, color: '#6d6b62' }}>{a.one_liner || a.faculty_name || '—'}</div>
                    </td>
                    <td>
                      <Badge tone={a.status}>{label(APP_STATUS, a.status)}</Badge>
                    </td>
                    <td>{a.track_name || a.track_slug}</td>
                    <td>
                      {a.lead_name || '—'}
                      <div style={{ fontSize: 12, color: '#6d6b62' }}>{a.lead_email}</div>
                    </td>
                    <td>{progressLabel(a.progress)}</td>
                    <td>{a.score_avg ?? '—'}</td>
                    <td>{fmtDate(a.submitted_at)}</td>
                    <td>
                      {(a.allowed_to || []).slice(0, 2).map((to) => (
                        <button
                          key={to}
                          type="button"
                          className="fa-mini"
                          onClick={(e) => go(a, to, e)}
                        >
                          {statusTitle(to)}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#6d6b62', padding: 32 }}>
                      Mos ariza yo‘q
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="fa-pager">
              <Btn small variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Oldingi
              </Btn>
              <span>
                {page} / {pages} · {count} ta
              </span>
              <Btn small variant="ghost" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Keyingi
              </Btn>
            </div>
          )}
        </>
      )}
    </div>
  )
}
