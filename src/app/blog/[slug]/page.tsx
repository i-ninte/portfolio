import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { posts, categories, tags, postCategories, postTags, likes, comments } from '@/lib/schema'
import { eq, sql } from 'drizzle-orm'
import { formatDate, getReadingTime } from '@/lib/utils'
import LikeButton from '@/components/blog/LikeButton'
import CommentSection from '@/components/blog/CommentSection'
import BlogContent from '@/components/blog/BlogContent'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (!post || !post.published) return null

    // Increment view count
    await db
      .update(posts)
      .set({ views: (post.views || 0) + 1 })
      .where(eq(posts.id, post.id))

    // Get categories
    const postCats = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(postCategories)
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, post.id))

    // Get tags
    const postTagsList = await db
      .select({ id: tags.id, name: tags.name, slug: tags.slug })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, post.id))

    // Get like count
    const [likeCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(eq(likes.postId, post.id))

    return {
      ...post,
      categories: postCats,
      tags: postTagsList,
      likeCount: likeCount?.count || 0,
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} | Kwabena Obeng`,
    description: post.excerpt || post.content.substring(0, 160),
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const readingTime = getReadingTime(post.content)

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* Back link */}
      <Link href="/blog" className="text-accent hover:underline mb-8 inline-flex items-center gap-2">
        <i className="fas fa-arrow-left" />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="mt-8 mb-12">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                className="px-3 py-1 text-sm font-medium bg-accent/20 text-accent rounded-full hover:bg-accent/30 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
          <span className="flex items-center gap-2">
            <i className="far fa-calendar" />
            {formatDate(post.createdAt || new Date().toISOString())}
          </span>
          <span className="flex items-center gap-2">
            <i className="far fa-clock" />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-2">
            <i className="far fa-eye" />
            {post.views} views
          </span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="tech-badge"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-64 md:h-96 -mx-6 mb-12 overflow-hidden rounded-2xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <BlogContent content={post.content} />

      {/* Like button */}
      <div className="flex items-center justify-center py-8 border-y border-dark-border mb-12">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Did you find this article helpful?</p>
          <LikeButton postSlug={post.slug} initialLikes={post.likeCount} />
        </div>
      </div>

      {/* Author card */}
      <div className="glass-card p-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-2xl font-bold text-white">
            KO
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Kwabena Obeng</h3>
            <p className="text-gray-400 text-sm">AI/ML Engineer & Researcher</p>
            <div className="flex gap-3 mt-2">
              <a href="https://x.com/i_ninte" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent">
                <i className="fab fa-x-twitter" />
              </a>
              <a href="https://github.com/i-ninte" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent">
                <i className="fab fa-github" />
              </a>
              <a href="https://linkedin.com/in/kwabenaobeng" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent">
                <i className="fab fa-linkedin" />
              </a>
              <a href="https://huggingface.co/ninte" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent" title="Hugging Face">
                🤗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection postSlug={post.slug} />

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-dark-border text-center text-gray-500 text-sm">
        <Link href="/blog" className="hover:text-accent transition-colors">
          &larr; Back to Blog
        </Link>
      </footer>
    </article>
  )
}
