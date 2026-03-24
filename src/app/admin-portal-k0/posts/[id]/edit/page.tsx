'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUploader from '@/components/admin/ImageUploader'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditPost({ params }: EditPostPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    published: false,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`)
      if (res.status === 401) {
        router.push('/admin-portal-k0')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setFormData({
          title: data.post.title,
          content: data.post.content,
          excerpt: data.post.excerpt || '',
          coverImage: data.post.coverImage || '',
          published: data.post.published,
        })
      } else {
        setError('Post not found')
      }
    } catch (err) {
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required')
      setSaving(false)
      return
    }

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.status === 401) {
        router.push('/admin-portal-k0')
        return
      }

      if (res.ok) {
        router.push('/admin-portal-k0/posts')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update post')
      }
    } catch (err) {
      setError('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <AdminNav />
        <div className="ml-64 flex-1 p-8">
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-accent mb-4" />
            <p className="text-gray-500">Loading post...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminNav />
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Edit Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-dark text-xl font-semibold"
                placeholder="Enter post title"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Excerpt (optional)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="input-dark resize-none h-24"
                placeholder="Brief summary of the post"
              />
            </div>

            {/* Cover Image */}
            <ImageUploader
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              label="Cover Image (optional)"
              placeholder="https://example.com/image.jpg"
            />

            {/* Content */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Content *</label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-border rounded-full peer peer-checked:bg-accent peer-focus:ring-2 peer-focus:ring-accent/20 transition-colors">
                  <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
              <span className="text-gray-300">
                {formData.published ? 'Published' : 'Draft'}
              </span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-glow disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
