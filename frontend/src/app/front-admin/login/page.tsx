'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminApiError } from '@/lib/admin-api'
import { useAdminAuth } from '@/lib/admin-auth'
import { Btn, Err, Field, Input } from '@/components/admin/kit'

export default function AdminLoginPage() {
  const { user, loading, login } = useAdminAuth()
  const router = useRouter()
  const [email, setEmail] = useState('admin@nsuni.uz')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/front-admin')
  }, [loading, user, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await login(email, password)
      router.replace('/front-admin')
    } catch (ex) {
      setErr(ex instanceof AdminApiError ? ex.message : 'Kirish muvaffaqiyatsiz')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fa-login">
      <section className="fa-login-left">
        <div>
          <p className="fa-kicker" style={{ color: '#8b919c' }}>
            NSU startup-club
          </p>
          <h1>
            Boshqaruv
            <br />
            paneli
          </h1>
          <p>Ariza voronkasi, leadlar, 10 hafta dastur va Demo Day — bitta operatsion tizim.</p>
        </div>
        <p style={{ fontSize: 12, color: '#8b919c' }}>Navoiy davlat universiteti · faqat xodimlar</p>
      </section>
      <section className="fa-login-right">
        <form className="fa-login-box fa-form" onSubmit={onSubmit}>
          <div>
            <p className="fa-kicker">Kirish</p>
            <h2>Email va parol</h2>
            <p className="fa-lead" style={{ marginTop: 4 }}>
              Talaba OTP bu yerga kira olmaydi.
            </p>
          </div>
          <Field label="Email">
            <Input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Parol">
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          <Err>{err}</Err>
          <Btn type="submit" disabled={busy}>
            {busy ? 'Tekshirilmoqda…' : 'Kirish'}
          </Btn>
        </form>
      </section>
    </div>
  )
}
