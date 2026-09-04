'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { pick, useI18n } from '@/lib/i18n'
import { Img } from '@/components/Img'
import { HeroGlobe } from '@/components/HeroGlobe'
import { KnowledgeNews } from '@/components/Knowledge'
import { MomentsGallery } from '@/components/Moments'
import { PartnerGrid, PartnerMarquee } from '@/components/Partners'
import { FALLBACK_PARTNERS, MOMENTS, mediaUrl } from '@/lib/media'
import type { GalleryItem, NewsItem, Partner, PortfolioItem, Season } from '@/lib/types'

const GLOBE_NAMES = [
  'NavLab',
  'HemisTrack',
  'DormShare',
  'CampusPay',
  'AgroNav',
  'EduMesh',
  'SanoatAI',
  'KonTech',
  'GreenNav',
  'TalabaGo',
  'KimyoKit',
  'QishloqNet',
]

export default function HomePage() {
  const { t, lang } = useI18n()
  const [season, setSeason] = useState<Season | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  useEffect(() => {
    api<Season>('/api/v1/public/seasons/current').then(setSeason).catch(() => setSeason(null))
    api<{ results?: NewsItem[] } | NewsItem[]>('/api/v1/public/news')
      .then((d) => setNews(Array.isArray(d) ? d : d.results || []))
      .catch(() => {})
    api<Partner[]>('/api/v1/public/partners').then(setPartners).catch(() => {})
    api<{ results?: PortfolioItem[] } | PortfolioItem[]>('/api/v1/public/portfolio/')
      .then((d) => setPortfolio(Array.isArray(d) ? d : d.results || []))
      .catch(() => {})
    api<GalleryItem[]>('/api/v1/public/gallery')
      .then((d) => setGallery(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const open = season?.status === 'applications_open'
  const apps = season?.stats_override?.applications ?? 0
  const accepted = season?.stats_override?.accepted ?? 0
  const weeks = season?.curriculum?.length ? season.curriculum : []
  const shownPartners = partners.length ? partners : FALLBACK_PARTNERS
  const globeNames = useMemo(() => {
    const fromPf = portfolio.map((p) => ({ name: p.team_name, slug: p.slug }))
    const extra = GLOBE_NAMES.filter((n) => !fromPf.some((p) => p.name === n)).map((name) => ({ name }))
    return [...fromPf, ...extra].slice(0, 24)
  }, [portfolio])
  const globeDots = Math.max(apps, 900)
  const galleryUrls = gallery
    .filter((g) => g.show_in_gallery && g.image)
    .map((g) => mediaUrl(g.image))
  const placed = (slot: string, fallback: string) =>
    mediaUrl(gallery.find((g) => g.placement === slot)?.image) || fallback
  const aboutImg = placed('about', galleryUrls[2] || MOMENTS[2])
  const demoImg = placed('demo', galleryUrls[galleryUrls.length - 1] || MOMENTS[18])
  const applyImg = placed('apply', '/images/apply-hero.jpg')

  return (
    <>
      <HeroGlobe applied={globeDots} names={globeNames} />
      <main className="relative z-10">
      <section className="relative flex min-h-[100svh] flex-col items-stretch justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:flex-row lg:items-center lg:px-8">
        <div
          aria-hidden
          data-hero-field="true"
          className="pointer-events-none relative order-last mt-8 h-[68vw] max-h-[420px] w-full sm:h-[52vw] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:max-h-none lg:w-[70%]"
        />
        <div
          data-hero-legend="true"
          className="pointer-events-none relative z-10 order-last mt-6 lg:absolute lg:bottom-8 lg:left-8 lg:right-8 lg:mt-0 lg:flex lg:items-baseline lg:justify-end lg:gap-x-7"
        >
          <p data-hero-season="true" className="hero-legend-head shrink-0 text-muted">
            {t.legendSeason}
          </p>
          <p className="hero-legend-l mt-1 shrink-0 text-muted/70 lg:mt-0">{t.legendDot}</p>
          <ul className="mt-2 space-y-1.5 lg:mt-0 lg:flex lg:items-baseline lg:gap-x-7 lg:space-y-0">
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="h-[3px] w-[3px] shrink-0 bg-brand/55" />
              <span className="hero-legend-n text-ink">{apps.toLocaleString()}</span>
              <span className="hero-legend-l text-muted">{t.legendApps}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="h-[5px] w-[5px] shrink-0 bg-brand" />
              <span className="hero-legend-n text-ink">{accepted.toLocaleString()}</span>
              <span className="hero-legend-l text-muted">{t.legendAccepted}</span>
            </li>
          </ul>
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[8fr_4fr] lg:gap-12">
          <div className="min-w-0 rise-in">
            <p className="eyebrow">{t.heroKicker}</p>
            <h1 className="hero-claim mt-5" data-claim-slot="true">
              {t.heroTitle} <span className="block">{t.heroTitle2}</span>
            </h1>
            <p className="hero-lede mt-6 max-w-xl text-[var(--color-muted)]">{t.heroLead}</p>
            <Link href="/cabinet/apply" className="btn-primary cta-urgent mt-10 inline-flex h-12 px-7 text-[15px]">
              {t.apply}
            </Link>
            <PartnerMarquee partners={shownPartners} kicker={t.partnersTitle} />
          </div>
        </div>
      </section>

      <section className="band mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:grid-cols-2 sm:px-8">
        <div className="group relative overflow-hidden rounded-[28px]">
          <Img src={aboutImg} alt="" className="aspect-[4/5] w-full object-cover lg:aspect-square" />
          <span className="sweep-blur pointer-events-none absolute inset-0" />
        </div>
        <div className="rise-in self-center">
          <p className="eyebrow">{t.aboutKicker}</p>
          <h2 className="page-title mt-4">{t.aboutTitle}</h2>
          <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-muted">
            <p>{t.aboutP1}</p>
            <p>{t.aboutP2}</p>
            <p>{t.aboutP3}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <ol className="stagger-rise grid gap-4 sm:grid-cols-3">
          <li className="season-card">
            <p className="eyebrow">1-mavsum</p>
            <p className="mt-6 season-n">{open ? t.seasonOpen : apps.toLocaleString()}</p>
            <p className="mt-1 text-[13px] text-muted">{open ? t.seasonNext : t.legendApps}</p>
            <div className="mt-6 flex gap-8">
              <div>
                <p className="season-n text-[28px]">{apps.toLocaleString()}</p>
                <p className="text-[13px] text-muted">{t.legendApps}</p>
              </div>
              <div>
                <p className="season-n text-[28px]">{accepted.toLocaleString()}</p>
                <p className="text-[13px] text-muted">{t.legendAccepted}</p>
              </div>
            </div>
          </li>
          <li className="season-card">
            <p className="eyebrow">2-mavsum</p>
            <p className="mt-6 font-display text-[28px] italic">{t.seasonSoon}</p>
            <p className="mt-1 text-[13px] text-muted">{t.seasonNext}</p>
          </li>
          <li className="season-card">
            <p className="eyebrow">{t.seasonTotal}</p>
            <div className="mt-6 flex gap-8">
              <div>
                <p className="season-n">{apps.toLocaleString()}</p>
                <p className="text-[13px] text-muted">{t.legendApps}</p>
              </div>
              <div>
                <p className="season-n">{accepted.toLocaleString()}</p>
                <p className="text-[13px] text-muted">{t.legendAccepted}</p>
              </div>
            </div>
          </li>
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="eyebrow">{t.howKicker}</p>
        <h2 className="page-title mt-4">{t.howTitle}</h2>
        <ol className="stagger-rise mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {t.steps.map((s, i) => (
            <li key={s}>
              <p className="eyebrow text-brand">0{i + 1}</p>
              <h3 className="mt-3 font-display text-[22px] italic">{s}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{t.stepBodies[i]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="band mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <p className="eyebrow">{t.weeksKicker}</p>
        <h2 className="page-title mt-4">{t.weeksTitle}</h2>
        <ol className="stagger-rise mt-12 grid gap-3 sm:grid-cols-2">
          {weeks.map((w) => (
            <li key={w.slug} className="rounded-2xl border border-[var(--color-line)] bg-white/70 p-5 transition hover:border-[#d4d4d8] hover:shadow-[0_2px_8px_#10182812]">
              <p className="eyebrow">{String(w.week).padStart(2, '0')}</p>
              <h3 className="mt-2 font-display text-xl italic">{pick(lang, w.title_uz, w.title_en)}</h3>
              {w.outcome_uz && <p className="mt-1 text-[14px] text-muted">{w.outcome_uz}</p>}
            </li>
          ))}
        </ol>
      </section>

      <MomentsGallery eyebrow={t.galleryTitle} title={t.galleryLead} images={galleryUrls} />

      <section className="band mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <p className="eyebrow">04  Demo Day</p>
        <h2 className="page-title mt-4">{t.demoTitle}</h2>
        <p className="hero-lede mt-4 max-w-xl text-muted">{t.demoLead}</p>
        <div className="group relative mt-10 overflow-hidden rounded-[28px]">
          <Img src={demoImg} alt="" className="aspect-[16/7] w-full object-cover" />
          <span className="sweep-blur pointer-events-none absolute inset-0" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-8">
            <p className="font-display text-3xl italic text-white sm:text-5xl">{t.seasonSoon}</p>
          </div>
        </div>
      </section>

      <PartnerGrid partners={shownPartners} title={t.partnersTitle} />

      <KnowledgeNews news={news} />

      <section className="relative mx-auto mb-8 max-w-6xl overflow-hidden rounded-[32px] px-5 sm:px-8">
        <Img src={applyImg} alt="" className="aspect-[16/7] w-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a73] px-6 text-center text-white">
          <p className="soon-word">{open ? t.ctaOpen : t.ctaClosed}</p>
          <p className="mt-3 text-white/80">{t.ctaTitle}</p>
          {open && (
            <Link href="/cabinet/apply" className="btn-primary cta-urgent mt-8 inline-flex h-12 px-8">
              {t.apply}
            </Link>
          )}
        </div>
      </section>
    </main>
    </>
  )
}
