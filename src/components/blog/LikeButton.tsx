'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  postSlug: string
  initialLikes: number
}

export default function LikeButton({ postSlug, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if user already liked this post
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    setLiked(likedPosts.includes(postSlug))
  }, [postSlug])

  const handleLike = async () => {
    if (liked || loading) return

    setLoading(true)
    try {
      const res = await fetch(`/api/posts/${postSlug}/like`, {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes)
        setLiked(true)

        // Save to localStorage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
        localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, postSlug]))
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={cn(
        'like-btn',
        liked && 'liked',
        loading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <i className={cn('text-lg', liked ? 'fas fa-heart' : 'far fa-heart')} />
      <span className="font-medium">{likes}</span>
      {liked && <span className="text-xs ml-1">Liked!</span>}
    </button>
  )
}
