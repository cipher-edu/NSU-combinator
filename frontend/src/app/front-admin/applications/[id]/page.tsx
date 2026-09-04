'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminApiError, adminApi, getAdminAccess } from '@/lib/admin-api'
import { useAdminAuth } from '@/lib/admin-auth'
import {
  optionLabel,
  progressLabel,
  statusTitle,
  TONE_ACTION,
  type AdminApp,
  type AppMeta,
  type AppQuestion,
} from '@/lib/admin-apps'
import { APP_STATUS, fmtDate, label } from '@/lib/admin-labels'
import { Badge, Btn, Card, Err, Field, Input, Ok, PageHead, Select, Textarea } from '@/components/admin/kit'

const PIPE = ['draft', 'submitted', 'screening', 'interview_invited', 'interviewed', 'accepted']

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAdminAuth()
  const [app, setApp] = useState<AdminApp | null>(null)
  const [meta, setMeta] = useState<AppMeta | null>(null)
  const [step, setStep] = useState(1)
  const [edit, setEdit] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [note, setNote] = useState('')
  const [force, setForce] = useState(false)
  const [starts, setStarts] = useState('')
  const [loc, setLoc] = useState('')
  const [intNotes, setIntNotes] = useState('')
  const [reviewer, setReviewer] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const a = await adminApi<AdminApp>(`/api/v1/ops/applications/${id}`)
    setApp(a)
    setAnswers(a.answers || {})
    const st = a.progress?.find((p) => !p.complete)?.n || a.current_step || 1
    setStep(st)
  }, [id])

  useEffect(() => {
    load().catch((e) => setErr(e.message))
    adminApi<AppMeta>('/api/v1/ops/applications/meta')
      .then(setMeta)
      .catch(() => {})
  }, [load])

  const steps = meta?.steps || []
  const current = steps.find((s) => s.n === step) || steps[0]
  const tracks = useMemo(() => {
    if (!meta || !app) return []
    return meta.tracks.filter((t) => t.season === app.season)
  }, [meta, app])

  async function transition(to: string) {
    setErr('')
    setMsg('')
    setBusy(true)
    try {
      const next = await adminApi<AdminApp>(`/api/v1/ops/applications/${id}/transition`, {
        method: 'POST',
        body: JSON.stringify({ to, note, force }),
      })
      setApp(next)
      setAnswers(next.answers || {})
      setNote('')
      setForce(false)
      setMsg(`Holat: ${statusTitle(to)}`)
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : 'O‘tmadi')
    } finally {
      setBusy(false)
    }
  }

  async function saveAnswers(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const next = await adminApi<AdminApp>(`/api/v1/ops/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ extra: { answers, current_step: step } }),
      })
      setApp(next)
      setAnswers(next.answers || {})
      setEdit(false)
      setMsg('Javoblar saqlandi')
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Saqlanmadi')
    } finally {
      setBusy(false)
    }
  }

  async function assign() {
    if (!reviewer) return
    setErr('')
    try {
      await adminApi(`/api/v1/ops/applications/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify({ reviewer_id: reviewer }),
      })
      setReviewer('')
      setMsg('Reviewer biriktirildi')
      await load()
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : 'Xato')
    }
  }

  async function unassign(assignmentId: string) {
    try {
      await adminApi(`/api/v1/ops/applications/${id}/unassign`, {
        method: 'POST',
        body: JSON.stringify({ assignment_id: assignmentId }),
      })
      await load()
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : 'Xato')
    }
  }

  async function interview(e: React.FormEvent) {
    e.preventDefault()
    if (!starts) return
    setErr('')
    try {
      await adminApi(`/api/v1/ops/applications/${id}/interviews`, {
        method: 'POST',
        body: JSON.stringify({
          starts_at: new Date(starts).toISOString(),
          location: loc,
          notes: intNotes,
        }),
      })
      setStarts('')
      setLoc('')
      setIntNotes('')
      setMsg('Suhbat belgilandi')
      await load()
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Suhbat yozilmadi')
    }
  }

  async function cancelInterview(iid: string) {
    await adminApi(`/api/v1/ops/interviews/${iid}/cancel`, { method: 'POST' })
    await load()
  }

  async function downloadDeck() {
    const token = getAdminAccess()
    const res = await fetch(`/api/v1/applications/${id}/deck/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) {
      setErr('Deck yuklanmadi')
      return
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${app?.team_slug || 'deck'}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function remove() {
    if (!confirm('Arizani o‘chirasizmi? Faqat draft yoki superadmin.')) return
    try {
      await adminApi(`/api/v1/ops/applications/${id}`, { method: 'DELETE' })
      router.replace('/front-admin/applications')
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : 'O‘chirilmadi')
    }
  }

  function renderValue(q: AppQuestion) {
    const raw = answers[q.id]
    if (!raw) return '—'
    if (q.options_from === 'tracks') {
      const t = tracks.find((x) => x.id === raw || x.slug === raw)
      return t?.name_uz || raw
    }
    return optionLabel(q, raw)
  }

  function fieldFor(q: AppQuestion) {
    const v = answers[q.id] || ''
    const set = (val: string) => setAnswers({ ...answers, [q.id]: val })
    if (q.type === 'textarea') return <Textarea value={v} onChange={(e) => set(e.target.value)} />
    if (q.type === 'select' && q.options_from === 'tracks') {
      return (
        <Select value={v} onChange={(e) => set(e.target.value)}>
          <option value="">—</option>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name_uz}
            </option>
          ))}
        </Select>
      )
    }
    if (q.type === 'select') {
      return (
        <Select value={v} onChange={(e) => set(e.target.value)}>
          <option value="">—</option>
          {(q.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label_uz}
            </option>
          ))}
        </Select>
      )
    }
    return <Input type={q.type === 'url' ? 'url' : 'text'} value={v} maxLength={q.max} onChange={(e) => set(e.target.value)} />
  }

  if (!app) return <p className="fa-lead">{err || 'Yuklanmoqda…'}</p>

  const pipeIdx = PIPE.indexOf(app.status === 'waitlisted' || app.status === 'rejected' ? 'accepted' : app.status)

  return (
    <div className="fa-app-detail">
      <PageHead
        kicker={app.season_name || 'Ariza'}
        title={app.team_name}
        lead={[app.track_name, app.faculty_name, app.lead_name, app.lead_email].filter(Boolean).join(' · ')}
        actions={
          <>
            <Link href="/front-admin/applications" className="fa-btn fa-btn-ghost">
              Ro‘yxat
            </Link>
            <Link href="/front-admin/teams" className="fa-btn fa-btn-ghost">
              Jamoalar
            </Link>
          </>
        }
      />

      <ol className="fa-pipe">
        {PIPE.map((k, i) => (
          <li key={k} className={i < pipeIdx ? 'done' : i === pipeIdx ? 'here' : ''}>
            <span>0{i + 1}</span>
            {k === 'accepted' && ['accepted', 'waitlisted', 'rejected'].includes(app.status)
              ? statusTitle(app.status)
              : statusTitle(k)}
          </li>
        ))}
      </ol>

      <Err>{err}</Err>
      <Ok>{msg}</Ok>

      <div className="fa-app-layout">
        <div>
          <Card>
            <div className="fa-app-hero">
              <Badge tone={app.status}>{label(APP_STATUS, app.status)}</Badge>
              <span>{progressLabel(app.progress)} bosqich</span>
              {app.score_avg != null && <span>ball {app.score_avg}</span>}
              <span>{app.score_count} baho</span>
              {app.one_liner && <p>{app.one_liner}</p>}
            </div>
            <div className="fa-step-nav">
              {steps.map((s) => {
                const p = app.progress?.find((x) => x.id === s.id)
                return (
                  <button key={s.id} type="button" className={s.n === step ? 'on' : ''} onClick={() => setStep(s.n)}>
                    <b>{s.n}</b>
                    {s.title_uz}
                    {p?.complete ? ' ✓' : ''}
                  </button>
                )
              })}
            </div>
            {current && (
              <form className="fa-form" onSubmit={saveAnswers} style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                  <div>
                    <p className="fa-kicker">
                      {current.n}/7 · {current.title_uz}
                    </p>
                    <p className="fa-lead">{current.lead_uz}</p>
                  </div>
                  <Btn type="button" small variant="ghost" onClick={() => setEdit((v) => !v)}>
                    {edit ? 'Bekor' : 'Tahrirlash'}
                  </Btn>
                </div>
                {current.questions.map((q) => (
                  <Field key={q.id} label={`${q.label_uz}${q.required ? '' : ' (ixtiyoriy)'}`}>
                    {edit ? fieldFor(q) : <dd className="fa-answer">{renderValue(q)}</dd>}
                  </Field>
                ))}
                {edit && (
                  <Btn type="submit" disabled={busy}>
                    Bosqichni saqlash
                  </Btn>
                )}
              </form>
            )}
          </Card>
        </div>

        <aside className="fa-app-ops">
          <Card>
            <p className="fa-kicker">Holat o‘tkazish</p>
            <div className="fa-next-grid">
              {(app.allowed_to || []).map((to) => (
                <Btn
                  key={to}
                  small
                  variant={TONE_ACTION[to] || 'ghost'}
                  disabled={busy}
                  onClick={() => transition(to)}
                >
                  {statusTitle(to)}
                </Btn>
              ))}
              {!app.allowed_to?.length && <p className="fa-lead">Keyingi o‘tish yo‘q</p>}
            </div>
            <Field label="Izoh">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Qaror sababi…" />
            </Field>
            {user?.role === 'superadmin' && (
              <label className="fa-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
                Force (quorumdan o‘tish)
              </label>
            )}
          </Card>

          <Card>
            <p className="fa-kicker">Jamoa</p>
            <ul className="fa-people">
              {(app.members || []).map((m) => (
                <li key={m.id}>
                  <strong>
                    {m.name} {m.role === 'lead' ? '· lead' : ''}
                  </strong>
                  <span>
                    {m.email}
                    {m.phone ? ` · ${m.phone}` : ''}
                  </span>
                </li>
              ))}
              {!app.members?.length && <li>A’zo yo‘q</li>}
            </ul>
          </Card>

          <Card>
            <p className="fa-kicker">Reviewer</p>
            <ul className="fa-people">
              {(app.assignments || []).map((a) => (
                <li key={a.id}>
                  <strong>
                    {a.reviewer_name} {a.submitted ? '✓' : ''}
                  </strong>
                  <span>
                    {a.reviewer_email}
                    {!a.submitted && (
                      <button type="button" className="fa-mini" onClick={() => unassign(a.id)}>
                        olib tashla
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="fa-form" style={{ marginTop: 10 }}>
              <Select value={reviewer} onChange={(e) => setReviewer(e.target.value)}>
                <option value="">Biriktirish…</option>
                {(meta?.reviewers || []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.email}
                  </option>
                ))}
              </Select>
              <Btn variant="ink" small onClick={assign} disabled={!reviewer}>
                Qo‘shish
              </Btn>
            </div>
          </Card>

          <Card>
            <p className="fa-kicker">Suhbat</p>
            <ul className="fa-people">
              {(app.interviews || []).map((i) => (
                <li key={i.id}>
                  <strong>{fmtDate(i.starts_at)}</strong>
                  <span>
                    {i.cancelled_at ? 'bekor' : i.location || 'joy yo‘q'}
                    {!i.cancelled_at && (
                      <button type="button" className="fa-mini" onClick={() => cancelInterview(i.id)}>
                        bekor qil
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <form className="fa-form" style={{ marginTop: 10 }} onSubmit={interview}>
              <Field label="Sana">
                <Input type="datetime-local" value={starts} onChange={(e) => setStarts(e.target.value)} required />
              </Field>
              <Field label="Joy">
                <Input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="301-xona / Zoom" />
              </Field>
              <Btn type="submit" small variant="ghost">
                Belgilash
              </Btn>
            </form>
          </Card>

          <Card>
            <p className="fa-kicker">Fayl va havola</p>
            <ul className="fa-files">
              <li>
                Deck:{' '}
                {app.has_deck ? (
                  <button type="button" className="fa-mini" onClick={downloadDeck}>
                    yuklab ol
                  </button>
                ) : (
                  'yo‘q'
                )}
              </li>
              <li>
                Demo:{' '}
                {app.demo_url ? (
                  <a href={app.demo_url} target="_blank" rel="noreferrer">
                    ochish
                  </a>
                ) : (
                  'yo‘q'
                )}
              </li>
              <li>
                Video:{' '}
                {app.video_url ? (
                  <a href={app.video_url} target="_blank" rel="noreferrer">
                    ochish
                  </a>
                ) : (
                  'yo‘q'
                )}
              </li>
            </ul>
          </Card>

          <Card>
            <p className="fa-kicker">Timeline</p>
            <ol className="fa-time">
              {(app.events || []).map((e) => (
                <li key={e.id}>
                  <b>
                    {statusTitle(e.from_status)} → {statusTitle(e.to_status)}
                  </b>
                  <span>
                    {fmtDate(e.created_at)}
                    {e.note ? ` · ${e.note}` : ''}
                  </span>
                </li>
              ))}
              {!app.events?.length && <li>Hali o‘tish yo‘q</li>}
            </ol>
            {(app.status === 'draft' || user?.role === 'superadmin') && (
              <Btn small variant="danger" onClick={remove}>
                O‘chirish
              </Btn>
            )}
          </Card>
        </aside>
      </div>
    </div>
  )
}
