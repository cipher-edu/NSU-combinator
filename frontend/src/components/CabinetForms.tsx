'use client'

import { useEffect, useState } from 'react'
import { ApiError, api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { Faculty, Team } from '@/lib/types'

export function Field({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <label className="mt-3 block text-[13px] text-muted">
      {label}
      <input className="mt-1 w-full rounded-lg border px-3 py-2 text-ink" value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </label>
  )
}

export function ProfileBox({ faculties, onSaved }: { faculties: Faculty[]; onSaved: () => void }) {
  const { user, refresh } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [affiliation, setAffiliation] = useState(user?.affiliation || 'student')
  const [studentId, setStudentId] = useState(user?.student_id || '')
  const [faculty, setFaculty] = useState(user?.faculty || '')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    await api('/api/v1/auth/me', {
      method: 'PATCH',
      body: JSON.stringify({
        name,
        phone,
        affiliation,
        student_id: studentId,
        faculty: faculty || null,
      }),
    })
    await refresh()
    onSaved()
  }

  return (
    <form onSubmit={save} className="mt-6 rounded-2xl border border-black/5 bg-white/80 p-5">
      <p className="eyebrow">2 / 5</p>
      <h2 className="mt-1 font-display text-2xl italic">Profil</h2>
      <p className="mt-1 text-sm text-muted">Ariza oldidan ism, telefon va affiliation kerak.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Ism" value={name} onChange={setName} />
        <Field label="Telefon" value={phone} onChange={setPhone} />
        <label className="text-[13px] text-muted">
          Affiliation
          <select className="mt-1 w-full rounded-lg border px-3 py-2" value={affiliation} onChange={(e) => setAffiliation(e.target.value)}>
            <option value="student">Talaba</option>
            <option value="master">Magistrant</option>
            <option value="alumni">Bitiruvchi</option>
            <option value="faculty">O‘qituvchi</option>
            <option value="other">Boshqa</option>
          </select>
        </label>
        <Field label="Student ID" value={studentId} onChange={setStudentId} required={false} />
        <label className="text-[13px] text-muted sm:col-span-2">
          Fakultet
          <select className="mt-1 w-full rounded-lg border px-3 py-2" value={faculty} onChange={(e) => setFaculty(e.target.value)}>
            <option value="">—</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name_uz}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white">Davom etish</button>
    </form>
  )
}

export function TelegramBox() {
  const { user, refresh } = useAuth()
  const [link, setLink] = useState('')
  const [err, setErr] = useState('')

  async function makeLink() {
    setErr('')
    try {
      const d = await api<{ linked: boolean; deep_link?: string }>('/api/v1/auth/telegram/link')
      if (d.linked) {
        await refresh()
        return
      }
      setLink(d.deep_link || '')
    } catch (ex: unknown) {
      if (ex instanceof ApiError && ex.code === 'TELEGRAM_NOT_CONFIGURED') {
        setErr('Telegram bot hali sozlanmagan.')
      } else {
        setErr(ex instanceof Error ? ex.message : 'Xato')
      }
    }
  }

  useEffect(() => {
    if (user?.telegram_linked || !link) return
    const t = setInterval(() => refresh(), 2500)
    return () => clearInterval(t)
  }, [user?.telegram_linked, link, refresh])

  return (
    <section className="mt-6 rounded-2xl border border-black/5 bg-white/80 p-5">
      <p className="eyebrow">3 / 5</p>
      <h2 className="mt-1 font-display text-2xl italic">Telegram bot</h2>
      <p className="mt-1 text-sm text-muted">Ariza holati shu chatga keladi. @testhacking2024bot</p>
      <button type="button" onClick={makeLink} className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white">
        Botni ulash
      </button>
      {link && (
        <p className="mt-3 text-sm">
          <a href={link} target="_blank" rel="noreferrer" className="text-brand underline">
            Telegram’da ochish
          </a>
          <span className="ml-2 text-muted">— Start bosilgach, shu sahifa yangilanadi.</span>
        </p>
      )}
      {err && <p className="mt-2 text-sm text-red-700">{err}</p>}
    </section>
  )
}

export function CreateTeam({ onCreated, setErr }: { onCreated: () => void; setErr: (s: string) => void }) {
  const [name, setName] = useState('')
  const [one, setOne] = useState('')
  async function go(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    try {
      await api('/api/v1/teams/', {
        method: 'POST',
        body: JSON.stringify({ name, one_liner_uz: one }),
      })
      onCreated()
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : 'Xato')
    }
  }
  return (
    <form onSubmit={go} className="mt-6 rounded-2xl border border-black/5 bg-white/80 p-5">
      <p className="eyebrow">4 / 5</p>
      <h2 className="mt-1 font-display text-2xl italic">Jamoa</h2>
      <p className="mt-1 text-sm text-muted">Startap nomi va bir jumlalik ta’rif. Keyin 7 bosqichli ariza ochiladi.</p>
      <Field label="Jamoa nomi" value={name} onChange={setName} />
      <Field label="Bir jumla" value={one} onChange={setOne} />
      <button className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white">Jamoa yaratish va arizaga o‘tish</button>
    </form>
  )
}

export function TeamInvite({ team, onChange }: { team: Team; onChange: () => void }) {
  const [invite, setInvite] = useState('')
  const [debugTok, setDebugTok] = useState('')
  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    const d = await api<{ debug_token?: string }>(`/api/v1/teams/${team.id}/invite/`, {
      method: 'POST',
      body: JSON.stringify({ email: invite }),
    })
    setDebugTok(d.debug_token || '')
    setInvite('')
    onChange()
  }
  return (
    <section className="rounded-2xl border border-black/5 bg-white/70 p-5">
      <h2 className="font-display text-2xl">{team.name}</h2>
      <p className="text-sm text-muted">{team.one_liner_uz} · {team.status}</p>
      <ul className="mt-3 text-sm">
        {team.memberships.map((m) => (
          <li key={m.id}>
            {m.name || m.email} — {m.role}
          </li>
        ))}
      </ul>
      <form onSubmit={sendInvite} className="mt-4 flex gap-2">
        <input className="flex-1 rounded-lg border px-3 py-2 text-sm" placeholder="a’zo email" value={invite} onChange={(e) => setInvite(e.target.value)} />
        <button className="rounded-lg bg-ink px-3 text-sm text-white">Taklif</button>
      </form>
      {debugTok && <p className="mt-2 break-all text-[12px] text-brand">dev token: {debugTok}</p>}
    </section>
  )
}

export function profileBasicsDone(user: { name: string; email: string; phone: string; affiliation: string } | null) {
  if (!user) return false
  const nameOk = Boolean(user.name) && user.name !== user.email.split('@')[0]
  return Boolean(nameOk && user.phone && user.affiliation)
}
