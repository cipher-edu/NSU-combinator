'use client'

import { useEffect, useRef, useState } from 'react'
import { MOMENTS } from '@/lib/media'

export function Img({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (el?.complete && el.naturalWidth > 0) setLoaded(true)
  }, [src])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`img-blur-up ${loaded ? 'is-loaded' : ''} ${className || ''}`}
      onLoad={() => setLoaded(true)}
      onError={(e) => {
        const el = e.currentTarget
        if (el.dataset.fallback) return
        el.dataset.fallback = '1'
        el.src = MOMENTS[0]
      }}
    />
  )
}
