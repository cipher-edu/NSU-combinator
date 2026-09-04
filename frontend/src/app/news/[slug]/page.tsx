'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { pick, useI18n } from '@/lib/i18n'
import { Img } from '@/components/Img'
import { newsCover } from '@/lib/media'
import type { NewsItem } from '@/lib/types'

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang, t } = useI18n()
  const [item, setItem] = useState<NewsItem | null>(null)
  useEffect(() => {
    api<NewsItem>(`/api/v1/public/news/${slug}`).then(setItem).catch(() => setItem(null))
  }, [slug])
  if (!item) {
    return (
      <main className="px-5 py-24 text-center text-muted">
        Yangilik topilmadi yoki hali nashr qilinmagan.
      </main>
    )
  }
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-6">
      <Link href="/news" className="kicker text-brand">{t.navNews}</Link>
      <p className="mt-4 kicker">
        {item.published_at ? new Date(item.published_at).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-GB') : ''}
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">{pick(lang, item.title_uz, item.title_en)}</h1>
      <div className="mt-6 overflow-hidden rounded-2xl">
        <Img src={newsCover(item.slug, item.cover)} alt="" className="aspect-[16/9] w-full object-cover" />
      </div>
      <article
        className="news-body mt-8 max-w-none text-[16px] leading-relaxed text-muted"
        dangerouslySetInnerHTML={{ __html: pick(lang, item.body_uz || '', item.body_en) }}
      />
      {item.youtube_url && (
        <a href={item.youtube_url} className="mt-8 inline-block text-brand" target="_blank" rel="noreferrer">
          YouTube →
        </a>
      )}
    </main>
  )
}
