'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { ApplyStatus } from '@/components/ApplyStatus'
import type { Application, ApplyQuestion, ApplyStep, Season, Team } from '@/lib/types'

function isFilled(v: unknown) {
  return String(v || '').trim().length > 0
}

export function ApplyWizard({
  team,
  season,
  app,
  onChange,
  setErr,
}: {
  team: Team
  season: Season | null
  app?: Application
  onChange: () => void
  setErr: (s: string) => void
}) {
  const { lang } = useI18n()
  const uz = lang !== 'en'
  const [steps, setSteps] = useState<ApplyStep[]>([])
  const [stepI, setStepI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [appId, setAppId] = useState<string | undefined>(app?.id)
  const [busy, setBusy] = useState(false)
  const inited = useRef(false)

  useEffect(() => {
    api<{ steps: ApplyStep[] }>('/api/v1/applications/form')
      .then((d) => setSteps(d.steps || []))
      .catch((e) => setErr(e instanceof Error ? e.message : 'Forma yuklanmadi'))
  }, [setErr])

  useEffect(() => {
    if (app?.id) setAppId(app.id)
    if (app?.answers) setAnswers((prev) => ({ ...app.answers, ...prev }))
  }, [app?.id])

  useEffect(() => {
    if (inited.current || !steps.length) return
    inited.current = true
    const src = app?.answers || {}
    const incomplete = steps.findIndex((s) => s.questions.some((q) => q.required && !isFilled(src[q.id])))
    setStepI(incomplete < 0 ? 0 : incomplete)
  }, [steps, app?.answers])

  const step = steps[stepI]
  const locked = !!(app && app.status !== 'draft')

  const filledReq = useMemo(() => {
    if (!steps.length) return 0
    const req = steps.flatMap((s) => s.questions.filter((q) => q.required))
    const done = req.filter((q) => isFilled(answers[q.id])).length
    return req.length ? Math.round((done / req.length) * 100) : 0
  }, [steps, answers])

  function setAns(id: string, v: string) {
    setAnswers((a) => ({ ...a, [id]: v }))
  }

  async function persist(nextStep = stepI + 1, patch = answers): Promise<Application | null> {
    setErr('')
    setBusy(true)
    const extra = { current_step: nextStep, answers: patch }
    try {
      if (!appId) {
        const created = await api<Application>('/api/v1/applications/', {
          method: 'POST',
          body: JSON.stringify({
            team: team.id,
            track: patch.track || season?.tracks[0]?.id,
            extra,
          }),
        })
        setAppId(created.id)
        onChange()
        return created
      }
      const updated = await api<Application>(`/api/v1/applications/${appId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ extra, track: patch.track || undefined }),
      })
      onChange()
      return updated
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : 'Xato')
      return null
    } finally {
      setBusy(false)
    }
  }

  function stepMissing(s: ApplyStep) {
    return s.questions.filter((q) => q.required && !isFilled(answers[q.id])).map((q) => (uz ? q.label_uz : q.label_en))
  }

  async function goNext() {
    if (!step) return
    const miss = stepMissing(step)
    if (miss.length) {
      setErr(`Shu bosqichda majburiy: ${miss[0]}`)
      return
    }
    const saved = await persist(Math.min(step.n + 1, 7))
    if (!saved && !appId) return
    if (stepI < steps.length - 1) setStepI(stepI + 1)
  }

  async function submit() {
    for (const s of steps) {
      const miss = stepMissing(s)
      if (miss.length) {
        setStepI(s.n - 1)
        setErr(`«${uz ? s.title_uz : s.title_en}»: ${miss[0]}`)
        return
      }
    }
    const saved = await persist(7)
    const id = saved?.id || appId
    if (!id) return
    setBusy(true)
    try {
      await api(`/api/v1/applications/${id}/submit/`, { method: 'POST' })
      onChange()
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : 'Xato')
    } finally {
      setBusy(false)
    }
  }

  function opts(q: ApplyQuestion) {
    if (q.options_from === 'tracks') {
      return (season?.tracks || []).map((t) => ({
        value: t.id,
        label: uz ? t.name_uz : t.name_en || t.name_uz,
      }))
    }
    return (q.options || []).map((o) => ({ value: o.value, label: uz ? o.label_uz : o.label_en }))
  }

  function field(q: ApplyQuestion) {
    const common = {
      disabled: locked,
      value: answers[q.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setAns(q.id, e.target.value),
    }
    if (q.type === 'textarea') {
      return (
        <textarea
          className="mt-2 h-28 w-full rounded-xl border border-black/10 px-3 py-2 text-[15px]"
          maxLength={q.max || 4000}
          placeholder={q.placeholder_uz || ''}
          {...common}
        />
      )
    }
    if (q.type === 'select') {
      return (
        <select className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2" {...common}>
          <option value="">— tanlang —</option>
          {opts(q).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
    }
    return (
      <input
        type={q.type === 'url' ? 'url' : 'text'}
        className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2"
        maxLength={q.max || 500}
        placeholder={q.placeholder_uz || ''}
        {...common}
      />
    )
  }

  if (!steps.length) {
    return <p className="mt-6 text-sm text-muted">Ariza formasi yuklanmoqda…</p>
  }

  return (
    <div className="mt-6 space-y-5">
      {app && <ApplyStatus app={app} />}

      <div className="rounded-2xl border border-black/5 bg-white/80 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Ariza topshirish · {step?.n || 1}/7</p>
            <h2 className="mt-1 font-display text-2xl italic">{uz ? step.title_uz : step.title_en}</h2>
            <p className="mt-1 text-sm text-muted">{uz ? step.lead_uz : step.lead_en}</p>
          </div>
          <p className="tabular-nums text-[13px] text-muted">{filledReq}%</p>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-cream">
          <div className="h-full bg-brand transition-all" style={{ width: `${filledReq}%` }} />
        </div>

        <ol className="mt-5 flex flex-wrap gap-1.5">
          {steps.map((s, i) => {
            const done = s.questions.filter((q) => q.required).every((q) => isFilled(answers[q.id]))
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStepI(i)}
                className={`rounded-full px-2.5 py-1 text-[11px] ${
                  i === stepI ? 'bg-ink text-white' : done ? 'bg-brand/15 text-brand' : 'bg-cream text-muted'
                }`}
              >
                {s.n}. {uz ? s.title_uz : s.title_en}
              </button>
            )
          })}
        </ol>

        <ol className="mt-6 space-y-5">
          {step.questions.map((q, qi) => (
            <li key={q.id}>
              <p className="text-[12px] text-muted">
                {step.n}.{qi + 1}
                {q.required ? ' · majburiy' : ' · ixtiyoriy'}
              </p>
              <label className="mt-1 block text-[15px] leading-snug text-ink">
                {uz ? q.label_uz : q.label_en}
                {field(q)}
              </label>
            </li>
          ))}
        </ol>

        {!locked && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStepI(Math.max(0, stepI - 1))}
              className="rounded-full border px-4 py-2 text-sm"
              disabled={stepI === 0}
            >
              Oldingi bosqich
            </button>
            {stepI < steps.length - 1 ? (
              <button type="button" onClick={goNext} disabled={busy} className="rounded-full bg-ink px-4 py-2 text-sm text-white">
                Keyingi bosqich
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={busy} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white">
                Arizani topshirish
              </button>
            )}
            <button type="button" onClick={() => persist(step.n)} disabled={busy} className="rounded-full px-4 py-2 text-sm text-muted">
              Saqlash
            </button>
          </div>
        )}
        {locked && <p className="mt-4 text-sm text-muted">Ariza topshirilgan — tahrir yopiq. Holat yuqorida yangilanadi.</p>}
      </div>
    </div>
  )
}
