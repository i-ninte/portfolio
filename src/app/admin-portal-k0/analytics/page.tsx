'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function AdminAnalytics() {
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
            <p className="text-gray-500">Loading analytics...</p>
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
          <h1 className="text-3xl font-bold text-white mb-8">Analytics</h1>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon="fa-newspaper"
              label="Total Posts"
              value={stats?.totalPosts || 0}
              description="All posts (drafts + published)"
            />
            <StatCard
              icon="fa-check-circle"
              label="Published"
              value={stats?.publishedPosts || 0}
              description="Live on your blog"
            />
            <StatCard
              icon="fa-eye"
              label="Total Views"
              value={stats?.totalViews || 0}
              description="Across all posts"
            />
            <StatCard
              icon="fa-heart"
              label="Total Likes"
              value={stats?.totalLikes || 0}
              description="Reader engagement"
            />
            <StatCard
              icon="fa-comment"
              label="Comments"
              value={stats?.totalComments || 0}
              description="Reader feedback"
            />
          </div>

          {/* Top performing posts */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-chart-line text-accent mr-2" />
              Top Performing Posts
            </h2>

            {topPosts.length > 0 ? (
              <div className="space-y-4">
                {topPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-dark-tertiary hover:bg-dark-border/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        idx === 0
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : idx === 1
                          ? 'bg-gray-400/20 text-gray-300'
                          : idx === 2
                          ? 'bg-amber-600/20 text-amber-500'
                          : 'bg-dark-border text-gray-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{post.title}</h3>
                        <p className="text-sm text-gray-500">/blog/{post.slug}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">{post.views}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-chart-bar text-5xl text-gray-600 mb-4" />
                <p className="text-gray-500">No data yet. Publish some posts to see analytics!</p>
              </div>
            )}
          </div>

          {/* Engagement metrics */}
          {stats && stats.totalViews > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-4">Engagement Rate</h3>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-4 border-accent flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">
                      {(((stats.totalLikes + stats.totalComments) / stats.totalViews) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">
                      Based on likes and comments per view
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {stats.totalLikes + stats.totalComments} engagements / {stats.totalViews} views
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-4">Average Per Post</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Views</span>
                    <span className="text-white font-semibold">
                      {Math.round(stats.totalViews / (stats.publishedPosts || 1))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Likes</span>
                    <span className="text-white font-semibold">
                      {Math.round(stats.totalLikes / (stats.publishedPosts || 1))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Comments</span>
                    <span className="text-white font-semibold">
                      {Math.round(stats.totalComments / (stats.publishedPosts || 1))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: string
  label: string
  value: number
  description: string
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <i className={`fas ${icon} text-accent`} />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}
