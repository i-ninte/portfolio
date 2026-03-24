'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin-portal-k0/dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { href: '/admin-portal-k0/posts', label: 'Posts', icon: 'fa-newspaper' },
  { href: '/admin-portal-k0/posts/new', label: 'New Post', icon: 'fa-plus' },
  { href: '/admin-portal-k0/analytics', label: 'Analytics', icon: 'fa-chart-bar' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin-portal-k0')
  }

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-dark-secondary border-r border-dark-border p-6 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-sm">
            KO
          </span>
          Admin Panel
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'admin-nav-item',
              pathname === item.href && 'active'
            )}
          >
            <i className={`fas ${item.icon}`} />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-dark-border space-y-2">
        <Link
          href="/blog"
          className="admin-nav-item"
          target="_blank"
        >
          <i className="fas fa-external-link-alt" />
          View Blog
        </Link>
        <button
          onClick={handleLogout}
          className="admin-nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <i className="fas fa-sign-out-alt" />
          Logout
        </button>
      </div>
    </nav>
  )
}
