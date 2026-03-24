'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
  views: number
}

export default function AdminPosts() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts')
      if (res.status === 401) {
        router.push('/admin-portal-k0')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex">
      <AdminNav />
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Posts</h1>
            <Link href="/admin-portal-k0/posts/new" className="btn-glow">
              <i className="fas fa-plus mr-2" />
              New Post
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-accent mb-4" />
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <i className="fas fa-newspaper text-5xl text-gray-600 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No posts yet</h2>
              <p className="text-gray-500 mb-6">Create your first blog post to get started.</p>
              <Link href="/admin-portal-k0/posts/new" className="btn-glow">
                <i className="fas fa-plus mr-2" />
                Create Post
              </Link>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Views</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-dark-border hover:bg-dark-tertiary/50">
                      <td className="p-4">
                        <Link
                          href={`/admin-portal-k0/posts/${post.id}/edit`}
                          className="text-white hover:text-accent transition-colors"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            post.published
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{post.views || 0}</td>
                      <td className="p-4 text-gray-400">{formatDate(post.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 text-gray-500 hover:text-accent transition-colors"
                              title="View"
                            >
                              <i className="fas fa-external-link-alt" />
                            </Link>
                          )}
                          <Link
                            href={`/admin-portal-k0/posts/${post.id}/edit`}
                            className="p-2 text-gray-500 hover:text-accent transition-colors"
                            title="Edit"
                          >
                            <i className="fas fa-edit" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deleting === post.id}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === post.id ? (
                              <i className="fas fa-spinner fa-spin" />
                            ) : (
                              <i className="fas fa-trash" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
