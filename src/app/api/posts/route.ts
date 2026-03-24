import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, categories, tags, postCategories, postTags, likes, comments } from '@/lib/schema'
import { eq, desc, like, sql, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = [eq(posts.published, true)]

    if (q) {
      conditions.push(like(posts.title, `%${q}%`))
    }

    const allPosts = await db
      .select()
      .from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset)

    // Get counts and categories/tags for each post
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

        const [likeCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(likes)
          .where(eq(likes.postId, post.id))

        const [commentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(comments)
          .where(and(eq(comments.postId, post.id), eq(comments.approved, true)))

        return {
          ...post,
          categories: postCats,
          tags: postTagsList,
          _count: {
            likes: likeCount?.count || 0,
            comments: commentCount?.count || 0,
          },
        }
      })
    )

    return NextResponse.json({ posts: postsWithMeta })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
