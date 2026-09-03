'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Img } from '@/components/Img'
import { pick, useI18n } from '@/lib/i18n'
import { newsCover } from '@/lib/media'
import type { NewsItem } from '@/lib/types'

function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <span className="absolute inset-0 rounded-xl bg-black/25" />
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-[0_8px_28px_rgba(0,0,0,0.28)]">
        <svg viewBox="0 0 24 24" className="ml-[2px] h-6 w-6 fill-ink" aria-hidden>
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>
    </span>
  )
}

function Cover({ post }: { post: NewsItem }) {
  const { lang } = useI18n()
  const title = pick(lang, post.title_uz, post.title_en)
  const inner = (
    <>
      <span className="block aspect-video w-full overflow-hidden rounded-xl bg-black/[0.04]">
        <Img
          src={newsCover(post.slug, post.cover)}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </span>
      {post.youtube_url && <PlayBadge />}
    </>
  )
  if (post.youtube_url) {
    return (
      <a href={post.youtube_url} target="_blank" rel="noopener noreferrer" aria-label={title} className="group relative block">
        {inner}
      </a>
    )
  }
  return (
    <Link href={`/news/${post.slug}`} aria-label={title} className="group relative block">
      {inner}
    </Link>
  )
}

export function KnowledgeNews({ news }: { news: NewsItem[] }) {
  const { t, lang } = useI18n()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const withCover = news.filter((n) => newsCover(n.slug, n.cover))
  const rotate = withCover.length > 4

  useEffect(() => {
    if (!rotate || paused) return
    const id = setInterval(() => setI((x) => (x + 1) % withCover.length), 7000)
    return () => clearInterval(id)
  }, [rotate, paused, withCover.length])

  if (!news.length) return null

  const at = (off: number) => withCover[(i + off) % withCover.length]
  const feature = withCover.length ? at(0) : news[0]
  const side = withCover.length > 1 ? [1, 2, 3].map(at).filter(Boolean) : []
  const used = new Set([feature?.id, ...side.map((s) => s.id)])
  const rail = news.filter((n) => !used.has(n.id)).slice(0, 8)

  return (
    <section id="news" className="px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
      <div className="mx-auto flex max-w-[1240px] items-end justify-between">
        <h2 className="page-title">{t.newsTitle}</h2>
        <Link href="/news" className="link-hover text-[14px] text-brand">
          {t.newsAll}
        </Link>
      </div>
      <div className="mx-auto mt-[60px] grid max-w-[1240px] gap-10 lg:grid-cols-[280fr_584fr_280fr] lg:gap-12">
        <div className="flex flex-col gap-6" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {side.map((p, idx) => (
            <div key={p.id} className={idx >= 2 ? 'hidden lg:block' : undefined}>
              <Cover post={p} />
              <Link
                href={`/news/${p.slug}`}
                className="mt-[7px] block min-h-[36px] overflow-hidden text-[15px] font-light leading-snug text-ink hover:opacity-60"
              >
                {pick(lang, p.title_uz, p.title_en)}
              </Link>
            </div>
          ))}
        </div>
        <article className="min-w-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <Cover post={feature} />
          <span className="mt-[23px] block h-[21px]">
            {feature.youtube_url && (
              <span className="inline-block bg-ink px-[10px] py-[4px] text-[11px] font-light uppercase tracking-[0.05em] text-white">
                Video
              </span>
            )}
          </span>
          <Link
            href={`/news/${feature.slug}`}
            className="mt-2 block font-display text-[28px] italic leading-tight text-ink hover:opacity-70 sm:text-[32px]"
          >
            {pick(lang, feature.title_uz, feature.title_en)}
          </Link>
        </article>
        <div>
          {rail.length > 0 && (
            <>
              <em className="block font-display text-[18px] italic leading-[28px] text-ink">{t.newsLatest}</em>
              <ul className="mt-4 flex flex-col gap-3">
                {rail.map((n, idx) => (
                  <li key={n.id} className={idx >= 5 ? 'hidden lg:list-item' : undefined}>
                    <Link href={`/news/${n.slug}`} className="group text-[16px] font-light leading-[22px] text-ink hover:opacity-60">
                      {pick(lang, n.title_uz, n.title_en)}
                      <span aria-hidden className="ml-1 inline-block opacity-50">
                        ›
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
