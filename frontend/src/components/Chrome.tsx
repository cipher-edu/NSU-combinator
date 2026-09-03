'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useI18n as useT } from '@/lib/i18n'
import { Img } from '@/components/Img'
import { MOMENTS, personPhoto } from '@/lib/media'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[6px] bg-brand text-[11px] font-bold text-white">
        NSU
      </span>
      <span className="font-display text-[22px] italic leading-none tracking-tight">Combinator</span>
    </Link>
  )
}

export function Header() {
  const { t, lang, setLang } = useT()
  const { user, logout } = useAuth()
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const links = [
    ['/portfolio', t.navPortfolio],
    ['/team', t.navTeam],
    ['/investors', t.navInvestors],
    ['/news', t.navNews],
  ] as const

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 text-[14px] font-light md:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`link-hover rounded-md px-2 py-2 ${path === href ? 'text-ink' : 'text-[var(--color-ink)]/80'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-[14px]">
          <button type="button" onClick={() => setLang(lang === 'uz' ? 'en' : 'uz')} className="eyebrow">
            {lang === 'uz' ? 'UZ' : 'EN'}
            <span className="mx-1 opacity-40">/</span>
            <span className="opacity-40">{lang === 'uz' ? 'EN' : 'UZ'}</span>
          </button>
          {user ? (
            <>
              <Link href="/cabinet" className="link-hover hidden sm:inline">
                {t.cabinet}
              </Link>
              <button type="button" onClick={() => logout()} className="text-muted">
                {t.logout}
              </button>
            </>
          ) : (
            <Link href="/apply" className="header-signin font-extralight">
              {t.login}
            </Link>
          )}
          <Link href="/cabinet/apply" className="btn-primary hidden sm:inline-flex">
            {t.apply}
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-px w-4 bg-ink" />
            <span className="mt-1.5 block h-px w-4 bg-ink" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="menu-in border-t border-[var(--color-line)] px-5 py-3 md:hidden">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="block py-2 text-[15px]" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  const { t } = useT()
  const row = [...MOMENTS, ...MOMENTS]
  return (
    <footer className="relative z-10 mt-24">
      <div className="overflow-hidden py-2">
        <div className="wall-drift-l flex w-max gap-2">
          {row.map((src, i) => (
            <div key={'a' + i} className="h-28 w-40 shrink-0 overflow-hidden rounded-md sm:h-36 sm:w-52">
              <Img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="wall-drift-r mt-2 flex w-max gap-2">
          {row.map((src, i) => (
            <div key={'b' + i} className="h-28 w-40 shrink-0 overflow-hidden rounded-md sm:h-36 sm:w-52">
              <Img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <p>{t.footer}</p>
          <div className="flex gap-5">
            <Link href="/valuation" className="link-hover">{t.navValuation}</Link>
            <Link href="/verify" className="link-hover">Verify</Link>
            <Link href="/cabinet/apply" className="link-hover">{t.apply}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function Aurora() {
  return (
    <div className="aurora-root" aria-hidden>
      <span className="aurora-blob aurora-blob--a" />
      <span className="aurora-blob aurora-blob--b" />
      <span className="aurora-blob aurora-blob--c" />
      <span className="aurora-blob aurora-blob--d" />
      <span className="aurora-sweep" />
    </div>
  )
}

export function PageTitle({ kicker, title, lead }: { kicker?: string; title: string; lead?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-16 text-center sm:px-6">
      {kicker && <p className="eyebrow mb-4">{kicker}</p>}
      <h1 className="page-title rise-in">{title}</h1>
      {lead && <p className="hero-lede mx-auto mt-4 max-w-xl text-muted">{lead}</p>}
    </div>
  )
}

export function PersonGrid({
  people,
  kind,
}: {
  kind: 'team' | 'investors'
  people: { id: string; slug?: string; name: string; line: string; photo?: string | null; linkedin?: string }[]
}) {
  return (
    <ul className="stagger-rise mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 sm:grid-cols-3 md:grid-cols-4 sm:px-6">
      {people.map((p) => (
        <li key={p.id} className="group text-center">
          <div className="relative mx-auto mb-3 aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-[var(--bg-cream-warm)]">
            <Img
              src={personPhoto(kind, p.slug || '', p.photo)}
              alt={p.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <span className="sweep-blur pointer-events-none absolute inset-0" />
            <span className="pointer-events-none absolute inset-0 bg-ink/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {p.linkedin && (
              <a
                href={p.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${p.name} LinkedIn`}
                className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-md">
                  in
                </span>
              </a>
            )}
          </div>
          <h3 className="font-medium">{p.name}</h3>
          <p className="mt-1 text-[13px] text-muted">{p.line}</p>
        </li>
      ))}
    </ul>
  )
}
