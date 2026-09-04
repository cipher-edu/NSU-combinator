'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from '@/lib/admin-auth'

type Item = { href: string; label: string; icon: string; exact?: boolean }
type Group = { id: string; label: string; items: Item[] }

const NAV: Group[] = [
  {
    id: 'ops',
    label: 'Boshqaruv',
    items: [
      { href: '/front-admin', label: 'Dashboard', icon: 'grid', exact: true },
      { href: '/front-admin/leads', label: 'Leadlar', icon: 'users' },
      { href: '/front-admin/campaigns', label: 'Kampaniyalar', icon: 'link' },
      { href: '/front-admin/applications', label: 'Arizalar', icon: 'file' },
    ],
  },
  {
    id: 'people',
    label: 'Odamlar',
    items: [
      { href: '/front-admin/users', label: 'Foydalanuvchilar', icon: 'user' },
      { href: '/front-admin/teams', label: 'Jamoalar', icon: 'team' },
      { href: '/front-admin/staff', label: 'Xodimlar', icon: 'badge' },
      { href: '/front-admin/faculty', label: 'Fakultet', icon: 'building' },
    ],
  },
  {
    id: 'select',
    label: 'Tanlov',
    items: [
      { href: '/front-admin/reviews', label: 'Baholash', icon: 'star' },
      { href: '/front-admin/interviews', label: 'Suhbatlar', icon: 'cal' },
      { href: '/front-admin/seasons', label: 'Mavsumlar', icon: 'flag' },
    ],
  },
  {
    id: 'program',
    label: 'Dastur',
    items: [
      { href: '/front-admin/program', label: '10 hafta', icon: 'list' },
      { href: '/front-admin/mentors', label: 'Mentorlar', icon: 'cap' },
      { href: '/front-admin/tasks', label: 'Vazifalar', icon: 'check' },
      { href: '/front-admin/demo-day', label: 'Demo Day', icon: 'mic' },
      { href: '/front-admin/investors', label: 'Investorlar', icon: 'brief' },
    ],
  },
  {
    id: 'content',
    label: 'Kontent',
    items: [
      { href: '/front-admin/cms', label: 'CMS', icon: 'image' },
      { href: '/front-admin/portfolio', label: 'Portfolio', icon: 'box' },
      { href: '/front-admin/knowledge', label: 'Bilim', icon: 'book' },
      { href: '/front-admin/notifications', label: 'Habarnoma', icon: 'bell' },
    ],
  },
]

const CRUMB: Record<string, string> = {
  '/front-admin': 'Dashboard',
  '/front-admin/leads': 'Leadlar',
  '/front-admin/campaigns': 'Kampaniyalar',
  '/front-admin/applications': 'Arizalar',
  '/front-admin/users': 'Foydalanuvchilar',
  '/front-admin/teams': 'Jamoalar',
  '/front-admin/staff': 'Xodimlar',
  '/front-admin/faculty': 'Fakultet',
  '/front-admin/reviews': 'Baholash',
  '/front-admin/interviews': 'Suhbatlar',
  '/front-admin/seasons': 'Mavsumlar',
  '/front-admin/program': '10 hafta',
  '/front-admin/mentors': 'Mentorlar',
  '/front-admin/tasks': 'Vazifalar',
  '/front-admin/demo-day': 'Demo Day',
  '/front-admin/investors': 'Investorlar',
  '/front-admin/cms': 'CMS',
  '/front-admin/portfolio': 'Portfolio',
  '/front-admin/knowledge': 'Bilim',
  '/front-admin/notifications': 'Habarnoma',
}

function isOn(path: string, href: string, exact?: boolean) {
  if (exact) return path === href
  return path === href || path.startsWith(href + '/')
}

function Icon({ name }: { name: string }) {
  const p = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'grid':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'users':
      return (
        <svg {...p}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'user':
      return (
        <svg {...p}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    case 'link':
      return (
        <svg {...p}>
          <path d="M10 13a5 5 0 0 0 7.54.54l1.92-1.92a5 5 0 0 0-7.07-7.07L10.7 6.23" />
          <path d="M14 11a5 5 0 0 0-7.54-.54L4.54 12.4a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )
    case 'file':
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      )
    case 'team':
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="16" cy="9" r="2.4" />
          <path d="M3 20v-1a5 5 0 0 1 8-4M14 20v-1.2a4 4 0 0 1 6-3.5" />
        </svg>
      )
    case 'badge':
      return (
        <svg {...p}>
          <path d="M12 15a6 6 0 1 0-6-6 6 6 0 0 0 6 6z" />
          <path d="M8.2 14.4 7 22l5-2.2L17 22l-1.2-7.6" />
        </svg>
      )
    case 'building':
      return (
        <svg {...p}>
          <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M4 21h16M10 9h.01M10 13h.01M14 9h.01M14 13h.01M8 21v-4h8v4" />
        </svg>
      )
    case 'star':
      return (
        <svg {...p}>
          <path d="m12 3 2.6 5.4 6 .9-4.3 4.2 1 5.9L12 16.8 6.7 19.4l1-5.9L3.4 9.3l6-.9z" />
        </svg>
      )
    case 'cal':
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      )
    case 'flag':
      return (
        <svg {...p}>
          <path d="M4 21V4m0 0h10l-1.5 4L14 12H4" />
        </svg>
      )
    case 'list':
      return (
        <svg {...p}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      )
    case 'cap':
      return (
        <svg {...p}>
          <path d="m2 9 10-5 10 5-10 5z" />
          <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
        </svg>
      )
    case 'check':
      return (
        <svg {...p}>
          <path d="M9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      )
    case 'mic':
      return (
        <svg {...p}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
        </svg>
      )
    case 'brief':
      return (
        <svg {...p}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
        </svg>
      )
    case 'image':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="m21 15-5-5-11 9" />
        </svg>
      )
    case 'box':
      return (
        <svg {...p}>
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="M3 8l9 5 9-5M12 13v8" />
        </svg>
      )
    case 'book':
      return (
        <svg {...p}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'panel':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="6" height="16" rx="1.5" />
          <path d="M12 6h9M12 12h9M12 18h6" />
        </svg>
      )
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}

function crumbFor(path: string) {
  if (CRUMB[path]) return CRUMB[path]
  const hit = Object.keys(CRUMB)
    .sort((a, b) => b.length - a.length)
    .find((k) => path.startsWith(k + '/'))
  if (hit) return CRUMB[hit]
  return 'Boshqaruv'
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth()
  const path = usePathname()
  const router = useRouter()
  const [navOpen, setNavOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const apply = () => {
      setIsMobile(mq.matches)
      setNavOpen(!mq.matches)
    }
    apply()
    mq.addEventListener('change', apply)
    try {
      const raw = localStorage.getItem('fa_nav_groups')
      if (raw) setOpenGroups(JSON.parse(raw))
    } catch {
      /* ignore */
    }
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!loading && !user) router.replace('/front-admin/login')
  }, [loading, user, router])

  useEffect(() => {
    if (isMobile) setNavOpen(false)
  }, [path, isMobile])

  const groups = useMemo(() => {
    const next: Record<string, boolean> = { ...openGroups }
    NAV.forEach((g) => {
      if (next[g.id] === undefined) next[g.id] = true
      if (g.items.some((it) => isOn(path, it.href, it.exact))) next[g.id] = true
    })
    return next
  }, [openGroups, path])

  function toggleGroup(id: string) {
    setOpenGroups(() => {
      const next = { ...groups, [id]: !groups[id] }
      localStorage.setItem('fa_nav_groups', JSON.stringify(next))
      return next
    })
  }

  function toggleNav() {
    setNavOpen((v) => !v)
  }

  if (loading || !user) {
    return (
      <div className="fa-boot">
        <span>Yuklanmoqda…</span>
      </div>
    )
  }

  const initials = (user.name || user.email || 'A')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={`fa-root${navOpen ? ' is-nav-open' : ' nav-closed'}`}>
      <div className="fa-side-slot">
        <aside className={`fa-side${navOpen ? ' open' : ''}`}>
          <div className="fa-brand">
            <span>NSU</span>
            <div className="fa-brand-txt">
              <strong>startup-club</strong>
              <small>Boshqaruv</small>
            </div>
          </div>
          <nav>
            {NAV.map((g) => {
              const open = groups[g.id] !== false
              return (
                <div key={g.id} className={`fa-nav-g${open ? ' open' : ''}`}>
                  <button type="button" className="fa-nav-h" onClick={() => toggleGroup(g.id)}>
                    <span>{g.label}</span>
                    <i className="fa-chev" />
                  </button>
                  <div className="fa-nav-items">
                    <div className="fa-nav-inner">
                      {g.items.map((it) => (
                        <Link
                          key={it.href}
                          href={it.href}
                          className={isOn(path, it.href, it.exact) ? 'on' : ''}
                          title={it.label}
                        >
                          <Icon name={it.icon} />
                          <em>{it.label}</em>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>
          <div className="fa-side-foot">
            <div className="fa-userchip">
              <b>{initials}</b>
              <p>
                {user.name}
                <small>{user.role === 'superadmin' ? 'Superadmin' : 'Admin'}</small>
              </p>
            </div>
            <button
              type="button"
              className="fa-out"
              onClick={() => logout().then(() => router.replace('/front-admin/login'))}
            >
              Chiqish
            </button>
          </div>
        </aside>
      </div>
      {navOpen && isMobile && <div className="fa-scrim" onClick={() => setNavOpen(false)} />}
      <div className="fa-main">
        <header className="fa-top">
          <button
            type="button"
            className={`fa-menu${navOpen ? ' open' : ''}`}
            onClick={toggleNav}
            aria-label={navOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            aria-expanded={navOpen}
          >
            <i />
            <i />
            <i />
          </button>
          <div className="fa-crumb">
            <span>NavDU</span>
            <i>/</i>
            <strong>{crumbFor(path)}</strong>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="fa-site">
            Sayt
          </a>
        </header>
        <div className="fa-content">{children}</div>
      </div>
    </div>
  )
}
