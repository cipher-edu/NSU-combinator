'use client'

import { Img } from '@/components/Img'
import { mediaUrl } from '@/lib/media'
import type { Partner } from '@/lib/types'

function Mark({ p }: { p: Partner }) {
  const src = mediaUrl(p.logo)
  return (
    <span className="flex h-10 w-[148px] shrink-0 items-center justify-center">
      {src ? (
        <Img src={src} alt={p.name} className="max-h-8 w-full object-contain opacity-50 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0" />
      ) : (
        <span className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted opacity-70 transition hover:opacity-100">
          {p.name}
        </span>
      )}
    </span>
  )
}

export function PartnerMarquee({ partners, kicker }: { partners: Partner[]; kicker?: string }) {
  if (!partners.length) return null
  const loop = [...partners, ...partners]
  return (
    <div className="mt-14">
      {kicker && <p className="hero-trust text-muted">{kicker}</p>}
      <div className="marquee-mask mt-5 overflow-hidden">
        <div className="animate-marquee-slow flex w-max items-center gap-12 pr-12">
          {loop.map((p, i) => (
            <Mark key={p.id + String(i)} p={p} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function PartnerGrid({ partners, title }: { partners: Partner[]; title: string }) {
  if (!partners.length) return null
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <h2 className="page-title">{title}</h2>
      <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {partners.map((p) => (
          <li key={p.id} className="flex items-center justify-center">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noreferrer" className="block">
                <Mark p={p} />
              </a>
            ) : (
              <Mark p={p} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
