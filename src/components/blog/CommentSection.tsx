'use client'

import { useState, useEffect } from 'react'
import { formatRelativeDate } from '@/lib/utils'
import type { Comment } from '@/lib/schema'

interface CommentSectionProps {
  postSlug: string
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
    // Honeypot field
    website: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postSlug}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments)
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData.website) {
      setError('Spam detected')
      return
    }

    if (!formData.authorName.trim() || !formData.content.trim()) {
      setError('Name and comment are required')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/posts/${postSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: formData.authorName,
          authorEmail: formData.authorEmail,
          content: formData.content,
        }),
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({ authorName: '', authorEmail: '', content: '', website: '' })
        fetchComments()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to post comment')
      }
    } catch (err) {
      setError('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
        <i className="fas fa-comments text-accent" />
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <h4 className="text-lg font-semibold text-white">Leave a comment</h4>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name *</label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="input-dark"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email (optional)</label>
            <input
              type="email"
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
              className="input-dark"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Honeypot - hidden from real users */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <label className="block text-sm text-gray-400 mb-1">Comment *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="textarea-dark"
            placeholder="Share your thoughts..."
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {success && (
          <p className="text-green-400 text-sm">Comment posted successfully!</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-glow disabled:opacity-50"
        >
          {submitting ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2" />
              Posting...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane mr-2" />
              Post Comment
            </>
          )}
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-spinner fa-spin text-2xl mb-2" />
            <p>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="far fa-comment-dots text-4xl mb-2" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-box">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white font-bold">
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-semibold text-white">{comment.authorName}</h5>
                  <p className="text-xs text-gray-500">
                    {formatRelativeDate(comment.createdAt || new Date().toISOString())}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 pl-13">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
