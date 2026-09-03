'use client'

import { useCallback, useEffect, useState } from 'react'
import { Img } from '@/components/Img'
import { MOMENTS } from '@/lib/media'

export function MomentsGallery({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  const pool = MOMENTS
  const shown = Math.min(12, pool.length)
  const [slots, setSlots] = useState(() => Array.from({ length: shown }, (_, i) => i))
  const [open, setOpen] = useState<number | null>(null)
  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduce || pool.length <= shown) return
    let t: number
    const tick = () => {
      setSlots((cur) => {
        const used = new Set(cur)
        const free = pool.map((_, i) => i).filter((i) => !used.has(i))
        if (!free.length) return cur
        const next = cur.slice()
        next[Math.floor(Math.random() * next.length)] = free[Math.floor(Math.random() * free.length)]
        return next
      })
      t = window.setTimeout(tick, 1400 + Math.random() * 2000)
    }
    t = window.setTimeout(tick, 1600)
    return () => clearTimeout(t)
  }, [pool.length, shown, reduce])

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + pool.length) % pool.length)),
    [pool.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close, step])

  return (
    <section id="moments" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="page-title mt-5">{title}</h2>
        <div className="moments-grid mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {slots.map((idx, i) => (
            <button
              key={`${i}-${idx}`}
              type="button"
              onClick={() => setOpen(idx)}
              className="moment-tile group relative aspect-square overflow-hidden rounded-2xl border border-black/[0.05] bg-[var(--color-line)]"
              aria-label="Rasmni kattalashtirish"
            >
              <div className="absolute inset-0 overflow-hidden transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]">
                <Img src={pool[idx]} alt="" className="moment-img h-full w-full object-cover" />
              </div>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="pointer-events-none absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white text-brand opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8M3 16.2V21m0 0h4.8M3 21l6-6M21 7.8V3m0 0h-4.8M21 3l-6 6M3 7.8V3m0 0h4.8M3 3l6 6" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>
      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white"
            aria-label="Yopish"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
            className="absolute left-3 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white sm:left-6"
            aria-label="Oldingi"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
            className="absolute right-3 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white sm:right-6"
            aria-label="Keyingi"
          >
            ›
          </button>
          <div className="max-h-[86vh] max-w-5xl overflow-hidden rounded-lg" onClick={(e) => e.stopPropagation()}>
            <Img src={pool[open]} alt="" className="max-h-[86vh] w-auto object-contain" />
          </div>
        </div>
      )}
    </section>
  )
}
