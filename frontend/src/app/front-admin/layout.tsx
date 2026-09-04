'use client'

import './admin.css'
import { usePathname } from 'next/navigation'
import { AdminAuthProvider } from '@/lib/admin-auth'
import { AdminShell } from '@/components/admin/shell'

export default function FrontAdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  return (
    <AdminAuthProvider>
      {path === '/front-admin/login' ? children : <AdminShell>{children}</AdminShell>}
    </AdminAuthProvider>
  )
}
