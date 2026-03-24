import Link from 'next/link'
import { formatDate, getReadingTime, generateExcerpt } from '@/lib/utils'
import type { Post, Category, Tag } from '@/lib/schema'

interface BlogCardProps {
  post: Post & {
    categories?: Category[]
    tags?: Tag[]
    _count?: {
      likes: number
      comments: number
    }
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  const readingTime = getReadingTime(post.content)
  const excerpt = post.excerpt || generateExcerpt(post.content)

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="blog-card group">
        {/* Cover image */}
        {post.coverImage && (
          <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-secondary to-transparent" />
          </div>
        )}

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{excerpt}</p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <i className="far fa-calendar text-xs" />
              {formatDate(post.createdAt || new Date().toISOString())}
            </span>
            <span className="flex items-center gap-1">
              <i className="far fa-clock text-xs" />
              {readingTime} min read
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            {post._count && (
              <>
                <span className="flex items-center gap-1">
                  <i className="far fa-heart text-xs" />
                  {post._count.likes}
                </span>
                <span className="flex items-center gap-1">
                  <i className="far fa-comment text-xs" />
                  {post._count.comments}
                </span>
              </>
            )}
            <span className="flex items-center gap-1">
              <i className="far fa-eye text-xs" />
              {post.views || 0}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-dark-border">
            {post.tags.map((tag) => (
              <span key={tag.id} className="text-xs text-gray-500">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}
