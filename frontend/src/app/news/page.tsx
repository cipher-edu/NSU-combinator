'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { PageTitle } from '@/components/Chrome'
import { pick, useI18n } from '@/lib/i18n'
import { Img } from '@/components/Img'
import { newsCover } from '@/lib/media'
import type { NewsItem } from '@/lib/types'

export default function NewsPage() {
  const { t, lang } = useI18n()
  const [items, setItems] = useState<NewsItem[]>([])
  useEffect(() => {
    api<{ results?: NewsItem[] } | NewsItem[]>('/api/v1/public/news')
      .then((d) => setItems(Array.isArray(d) ? d : d.results || []))
      .catch(() => {})
  }, [])
  return (
    <main className="pb-24">
      <PageTitle title={t.navNews} lead={t.newsLead} />
      <p className="mx-auto mb-8 max-w-5xl px-5 text-[13px] text-muted sm:px-6">
        {items.length} / {items.length}
      </p>
      <ul className="stagger-rise mx-auto grid max-w-5xl gap-10 px-5 sm:grid-cols-2 sm:px-6">
        {items.map((n) => (
          <li key={n.id} className="group">
            <Link href={`/news/${n.slug}`} className="block">
              <div className="relative mb-3 overflow-hidden rounded-2xl">
                <Img
                  src={newsCover(n.slug, n.cover)}
                  alt=""
                  className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                {n.youtube_url && (
                  <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="absolute inset-0 bg-black/25" />
                    <span className="relative grid h-14 w-14 place-items-center rounded-full bg-white/95">
                      <svg viewBox="0 0 24 24" className="ml-[2px] h-6 w-6 fill-ink"><path d="M8 5.5v13l11-6.5z" /></svg>
                    </span>
                  </span>
                )}
                <span className="sweep-blur pointer-events-none absolute inset-0" />
              </div>
              <p className="kicker mb-1">
                {n.published_at ? new Date(n.published_at).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-GB') : ''}
              </p>
              <h2 className="font-display text-2xl italic leading-snug">{pick(lang, n.title_uz, n.title_en)}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
