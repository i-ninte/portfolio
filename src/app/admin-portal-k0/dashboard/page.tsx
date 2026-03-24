'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'

interface Stats {
  totalPosts: number
  publishedPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

interface TopPost {
  id: string
  title: string
  slug: string
  views: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [topPosts, setTopPosts] = useState<TopPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      if (res.status === 401) {
        router.push('/admin-portal-k0')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setTopPosts(data.topPosts)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <AdminNav />
        <div className="ml-64 flex-1 p-8">
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-accent mb-4" />
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminNav />
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon="fa-newspaper"
              label="Total Posts"
              value={stats?.totalPosts || 0}
              color="blue"
            />
            <StatCard
              icon="fa-check-circle"
              label="Published"
              value={stats?.publishedPosts || 0}
              color="green"
            />
            <StatCard
              icon="fa-eye"
              label="Total Views"
              value={stats?.totalViews || 0}
              color="purple"
            />
            <StatCard
              icon="fa-heart"
              label="Total Likes"
              value={stats?.totalLikes || 0}
              color="red"
            />
            <StatCard
              icon="fa-comment"
              label="Comments"
              value={stats?.totalComments || 0}
              color="yellow"
            />
          </div>

          {/* Quick actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/admin-portal-k0/posts/new"
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-tertiary hover:bg-accent/20 transition-colors"
                >
                  <i className="fas fa-plus text-accent" />
                  <span className="text-white">Create New Post</span>
                </Link>
                <Link
                  href="/admin-portal-k0/posts"
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-tertiary hover:bg-accent/20 transition-colors"
                >
                  <i className="fas fa-edit text-accent" />
                  <span className="text-white">Manage Posts</span>
                </Link>
                <Link
                  href="/blog"
                  target="_blank"
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-tertiary hover:bg-accent/20 transition-colors"
                >
                  <i className="fas fa-external-link-alt text-accent" />
                  <span className="text-white">View Live Blog</span>
                </Link>
              </div>
            </div>

            {/* Top posts */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Top Posts by Views</h2>
              {topPosts.length > 0 ? (
                <div className="space-y-3">
                  {topPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-dark-tertiary"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-sm flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-white text-sm truncate max-w-[200px]">
                          {post.title}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {post.views} views
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No posts yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: number
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow'
}) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    red: 'from-red-500/20 to-red-600/20 text-red-400',
    yellow: 'from-yellow-500/20 to-yellow-600/20 text-yellow-400',
  }

  return (
    <div className={`glass-card p-4 bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        <i className={`fas ${icon}`} />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  )
}
