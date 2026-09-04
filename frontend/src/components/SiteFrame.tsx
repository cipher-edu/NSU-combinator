'use client'

import { usePathname } from 'next/navigation'
import { Aurora, Footer, Header } from '@/components/Chrome'
import { Lattice } from '@/components/Lattice'

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname() || ''
  if (path.startsWith('/front-admin') || path.startsWith('/r/')) {
    return <>{children}</>
  }
  return (
    <>
      <Aurora />
      <Lattice />
      <Header />
      <div className="animate-page-in">{children}</div>
      <Footer />
    </>
  )
}
