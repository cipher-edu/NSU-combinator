'use client'

import { useEffect, useRef } from 'react'

type Name = { name: string; slug?: string }

export function HeroGlobe({
  applied = 900,
  names = [],
}: {
  applied?: number
  names?: Name[]
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const GOLDEN = Math.PI * (3 - Math.sqrt(5))
    const TWO_PI = Math.PI * 2
    const count = Math.max(720, Math.min(1600, Math.round(applied) || 900))
    const accepted = names.slice(0, 48)

    const rnd = (() => {
      let t = 0x13527db
      return () => {
        t = (t + 0x6d2b79f5) >>> 0
        let e = Math.imul(t ^ (t >>> 15), 1 | t)
        e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e
        return ((e ^ (e >>> 14)) >>> 0) / 0x100000000
      }
    })()

    const taken = new Set<number>()
    {
      for (let i = 0; i < Math.max(accepted.length, 1); i++) {
        const y = 1 - ((i + 0.5) / Math.max(accepted.length, 1)) * 2
        const ang = (i * GOLDEN * 1.618) % TWO_PI
        const guess = Math.round(((1 - y) / 2) * (count - 1))
        let best = -1
        let bestD = Infinity
        for (let t = Math.max(0, guess - 44); t <= Math.min(count - 1, guess + 44); t++) {
          if (taken.has(t)) continue
          let d = Math.abs(((t * GOLDEN) % TWO_PI) - ang)
          if (d > Math.PI) d = TWO_PI - d
          if (d < bestD) {
            bestD = d
            best = t
          }
        }
        if (best >= 0) taken.add(best)
      }
    }

    let gotIndex = 0
    const dots = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / Math.max(1, count - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const a = i * GOLDEN
      const got = taken.has(i)
      return {
        sx: Math.cos(a) * r,
        sy: y,
        sz: Math.sin(a) * r,
        got,
        gotIndex: got ? gotIndex++ : 0,
        alpha: 0.72 + 0.28 * rnd(),
      }
    })

    let w = 0
    let h = 0
    let rot = 0.35
    let raf = 0
    let last = 0
    let dragging = false
    let dragStartX = 0
    let dragStartRot = 0
    let mx = -9999
    let my = -9999
    let cx = 0
    let cy = 0
    let radius = 160
    let hover = 0

    const field = () => document.querySelector<HTMLElement>('[data-hero-field]')

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const box = field()?.getBoundingClientRect()
      if (!box || box.width < 2) return
      const claim = document.querySelector<HTMLElement>('[data-claim-slot]')?.getBoundingClientRect()
      const seasonBox =
        document.querySelector<HTMLElement>('[data-hero-season]')?.getBoundingClientRect() ||
        document.querySelector<HTMLElement>('[data-hero-legend]')?.getBoundingClientRect()
      const overlap = !!claim && claim.bottom > box.top + 8
      cx = box.left + box.width * (overlap ? 0.74 : 0.5)
      cy = box.top + box.height * 0.5
      radius = Math.max(
        0.18 * box.height,
        Math.min(
          0.46 * box.height,
          0.44 * box.width,
          overlap && claim ? cx - (claim.right + 14) : box.width * 0.42,
          seasonBox && seasonBox.top > cy ? seasonBox.top - 34 - cy : Infinity,
        ),
      )
      const scale = Math.min(1, Math.max(0.4, radius / 294))
      const cos = Math.cos(rot)
      const sin = Math.sin(rot)
      if (seasonBox && seasonBox.width > 2) {
        const lx = seasonBox.left + seasonBox.width * 0.5
        const ly = seasonBox.top - 6
        const dx = lx - cx
        const dy = ly - cy
        const len = Math.hypot(dx, dy) || 1
        const edgeY = cy + (dy / len) * (radius + 10)
        if (edgeY < ly - 4) {
          ctx.globalAlpha = 0.4
          ctx.strokeStyle = '#fb6a00'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(Math.round(cx + (dx / len) * (radius + 10)) + 0.5, Math.round(edgeY) + 0.5)
          ctx.lineTo(Math.round(lx) + 0.5, Math.round(ly) + 0.5)
          ctx.stroke()
          ctx.globalAlpha = 0.75
          ctx.fillStyle = '#fb6a00'
          ctx.fillRect(Math.round(lx) - 2, Math.round(ly) - 2, 4, 4)
          ctx.globalAlpha = 1
        }
      }
      ctx.fillStyle = '#fb6a00'
      let lastA = -1
      const labels: { x: number; y: number; depth: number; name: string; d: number }[] = []

      for (const d of dots) {
        const x = d.sx * cos + d.sz * sin
        const depth = (d.sz * cos - d.sx * sin + 1) / 2
        const px = cx + x * radius
        const py = cy - d.sy * radius
        if (px < -8 || px > w + 8 || py < -8 || py > h + 8) continue
        const fadeX = Math.min(1, Math.max(0, (px - box.left) / Math.max(1, box.width) / 0.26))
        const edge = overlap ? fadeX * fadeX * (3 - 2 * fadeX) : 1
        const alpha = Math.min(1, d.alpha * (0.5 + 0.5 * depth)) * edge
        if (alpha <= 0.012) continue
        const a = Math.round(50 * alpha) / 50
        if (a !== lastA) {
          ctx.globalAlpha = a
          lastA = a
        }
        const size = ((d.got ? 3.4 : 1.9) + 1.1 * depth) * scale
        ctx.fillRect(Math.round(px), Math.round(py), size, size)
        if (d.got && hover > 0.01) {
          const name = accepted[d.gotIndex]?.name
          if (name) labels.push({ x: px, y: py, depth, name, d: Math.hypot(px - mx, py - my) })
        }
      }

      ctx.globalAlpha = 1
      if (hover > 0.01 && accepted.length) {
        ctx.font = '800 12px system-ui, sans-serif'
        ctx.textBaseline = 'middle'
        const vis = labels.filter((l) => l.depth > 0.52).sort((a, b) => a.d - b.d)
        const boxes: { x0: number; y0: number; x1: number; y1: number }[] = []
        for (const l of vis) {
          const tw = ctx.measureText(l.name).width
          const tx = l.x < cx ? l.x - 7 - tw : l.x + 7
          const ty = l.y + 1
          const boxL = { x0: tx - 6, y0: ty - 11, x1: tx + tw + 6, y1: ty + 11 }
          if (boxL.x0 < 4 || boxL.x1 > w - 4) continue
          if (boxes.some((b) => boxL.x0 < b.x1 && boxL.x1 > b.x0 && boxL.y0 < b.y1 && boxL.y1 > b.y0)) continue
          boxes.push(boxL)
          const hot = l.d < 26
          ctx.globalAlpha = hover * (hot ? 1 : 0.8)
          ctx.strokeStyle = 'rgba(245,245,238,0.92)'
          ctx.lineWidth = 3
          ctx.strokeText(l.name, tx, ty)
          ctx.fillStyle = hot ? '#fb6a00' : '#16140f'
          ctx.fillText(l.name, tx, ty)
          ctx.fillStyle = '#fb6a00'
          ctx.fillRect(Math.round(l.x) - 2, Math.round(l.y) - 2, 5, 5)
        }
        ctx.globalAlpha = 1
      }
    }

    const inside = () => {
      if (!radius) return false
      const dx = mx - cx
      const dy = my - cy
      if (dx * dx + dy * dy >= (1.28 * radius) ** 2) return false
      const hit = document.elementFromPoint(mx, my)
      if (hit?.closest('a, button, header, nav, input, select, [role="button"]')) return false
      return true
    }

    let targetHover = 0
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      if (!reduce && !dragging) rot += 0.1 * dt
      hover += (targetHover - hover) * 0.12
      draw()
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      if (dragging) {
        rot = dragStartRot + (e.clientX - dragStartX) * 0.005
        return
      }
      targetHover = inside() ? 1 : 0
      document.body.style.cursor = inside() ? 'grab' : ''
    }
    const onDown = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!inside()) return
      dragging = true
      dragStartX = e.clientX
      dragStartRot = rot
      document.body.style.cursor = 'grabbing'
    }
    const onUp = () => {
      dragging = false
      document.body.style.cursor = inside() ? 'grab' : ''
    }

    resize()
    if (reduce) {
      draw()
    } else {
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.body.style.cursor = ''
    }
  }, [applied, names.map((n) => n.name).join('|')])

  return (
    <canvas
      ref={ref}
      data-hero-dots="true"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}
