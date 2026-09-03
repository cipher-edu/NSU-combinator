'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { PageTitle } from '@/components/Chrome'
import { pick, useI18n } from '@/lib/i18n'
import { Img } from '@/components/Img'
import { MOMENTS, mediaUrl } from '@/lib/media'
import type { PortfolioItem, Season } from '@/lib/types'

export default function PortfolioPage() {
  const { t, lang } = useI18n()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [season, setSeason] = useState<Season | null>(null)
  const [track, setTrack] = useState('')
  const [seasonF, setSeasonF] = useState('')

  useEffect(() => {
    api<{ results?: PortfolioItem[] } | PortfolioItem[]>('/api/v1/public/portfolio/')
      .then((d) => setItems(Array.isArray(d) ? d : d.results || []))
      .catch(() => {})
    api<Season>('/api/v1/public/seasons/current').then(setSeason).catch(() => {})
  }, [])

  const filtered = useMemo(
    () =>
      items.filter(
        (i) => (!track || i.track_slug === track) && (!seasonF || i.season_slug === seasonF),
      ),
    [items, track, seasonF],
  )

  return (
    <main className="pb-24">
      <PageTitle title={t.portfolioTitle} lead={t.portfolioLead} />
      <div className="mx-auto flex max-w-6xl gap-3 px-5 sm:px-6">
        <select className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm" value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="">{lang === 'uz' ? 'Yo‘nalish' : 'Track'}</option>
          {season?.tracks.map((tr) => (
            <option key={tr.id} value={tr.slug}>{pick(lang, tr.name_uz, tr.name_en)}</option>
          ))}
        </select>
        <select className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm" value={seasonF} onChange={(e) => setSeasonF(e.target.value)}>
          <option value="">{lang === 'uz' ? 'Mavsum' : 'Season'}</option>
          {season && <option value={season.slug}>{pick(lang, season.name_uz, season.name_en)}</option>}
        </select>
        <p className="self-center text-sm text-muted">{filtered.length} / {items.length}</p>
      </div>
      {filtered.length === 0 ? (
        <div className="mx-auto mt-12 max-w-lg px-5 text-center">
          <div className="overflow-hidden rounded-3xl">
            <Img src={MOMENTS[10]} alt="" className="aspect-[16/10] w-full object-cover" />
          </div>
          <p className="mt-6 font-display text-2xl italic">{t.portfolioEmpty}</p>
          <p className="mt-2 text-sm text-muted">
            {lang === 'uz'
              ? 'Keyingi mavsumda shu ro‘yxatda o‘z jamoangizni ko‘rishingiz mumkin.'
              : 'Next season your team can be on this list.'}
          </p>
        </div>
      ) : (
        <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-6 px-5 sm:grid-cols-3 md:grid-cols-4 sm:px-6">
          {filtered.map((p) => (
            <li key={p.id} className="rounded-2xl border border-black/5 bg-white/70 p-4">
              <div className="mb-3 overflow-hidden rounded-xl bg-cream">
                <Img src={mediaUrl(p.logo) || MOMENTS[0]} alt="" className="aspect-square w-full object-cover" />
              </div>
              <h3 className="font-semibold">{p.team_name}</h3>
              <p className="text-[12px] text-muted">{p.season_slug} · {p.track_slug}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
