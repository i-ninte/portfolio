import Link from 'next/link'
import { db } from '@/lib/db'
import { posts, categories, tags, postCategories, postTags, likes, comments } from '@/lib/schema'
import { eq, desc, and, like, sql } from 'drizzle-orm'
import BlogCard from '@/components/blog/BlogCard'
import SearchBar from '@/components/blog/SearchBar'

interface BlogPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    tag?: string
    page?: string
  }>
}

async function getPosts(searchParams: { q?: string; category?: string; tag?: string; page?: string }) {
  const { q, category, tag, page = '1' } = searchParams
  const perPage = 9
  const offset = (parseInt(page) - 1) * perPage

  try {
    // Get all posts with counts
    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        excerpt: posts.excerpt,
        coverImage: posts.coverImage,
        published: posts.published,
        createdAt: posts.createdAt,
        views: posts.views,
      })
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt))
      .limit(perPage)
      .offset(offset)

    const allPosts = await query

    // Get categories and tags for each post
    const postsWithMeta = await Promise.all(
      allPosts.map(async (post) => {
        const postCats = await db
          .select({ id: categories.id, name: categories.name, slug: categories.slug })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(eq(postCategories.postId, post.id))

        const postTagsList = await db
          .select({ id: tags.id, name: tags.name, slug: tags.slug })
          .from(postTags)
          .innerJoin(tags, eq(postTags.tagId, tags.id))
          .where(eq(postTags.postId, post.id))

        const likeCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(likes)
          .where(eq(likes.postId, post.id))

        const commentCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(comments)
          .where(eq(comments.postId, post.id))

        return {
          ...post,
          categories: postCats,
          tags: postTagsList,
          _count: {
            likes: likeCount[0]?.count || 0,
            comments: commentCount[0]?.count || 0,
          },
        }
      })
    )

    return postsWithMeta
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

async function getCategories() {
  try {
    return await db.select().from(categories)
  } catch {
    return []
  }
}

async function getTags() {
  try {
    return await db.select().from(tags)
  } catch {
    return []
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const [allPosts, allCategories, allTags] = await Promise.all([
    getPosts(params),
    getCategories(),
    getTags(),
  ])

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <Link href="/" className="text-accent hover:underline mb-4 inline-flex items-center gap-2">
          <i className="fas fa-arrow-left" />
          Back to Portfolio
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mt-4 mb-4">
          Blog & Articles
        </h1>
        <p className="text-gray-400 text-lg">
          Thoughts on AI, Machine Learning, and building intelligent systems.
        </p>
      </div>

      {/* Search and filters */}
      <SearchBar categories={allCategories} tags={allTags} />

      {/* Posts grid */}
      {allPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-secondary flex items-center justify-center">
            <i className="fas fa-newspaper text-4xl text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No articles yet</h2>
          <p className="text-gray-500">
            Check back soon for new content on AI/ML, research, and tech insights.
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-dark-border text-center text-gray-500 text-sm">
        <Link href="/" className="hover:text-accent transition-colors">
          &larr; Back to Portfolio
        </Link>
      </footer>
    </div>
  )
}
