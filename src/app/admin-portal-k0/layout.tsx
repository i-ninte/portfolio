import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The login page doesn't need auth check
  // Layout is used for all admin pages

  return (
    <div className="min-h-screen bg-dark-primary">
      {children}
    </div>
  )
}
