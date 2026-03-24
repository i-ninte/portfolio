import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, categories, tags, postCategories, postTags } from '@/lib/schema'
import { isAuthenticated } from '@/lib/auth'
import { nanoid } from 'nanoid'
import { slugify } from '@/lib/utils'
import { desc, eq } from 'drizzle-orm'

// Get all posts (including drafts)
export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))

    return NextResponse.json({ posts: allPosts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// Create new post
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, content, excerpt, coverImage, published, categoryIds, tagIds } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const id = nanoid()
    const slug = slugify(title)
    const now = new Date().toISOString()

    // Check for slug uniqueness
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    const finalSlug = existingPost.length > 0 ? `${slug}-${nanoid(6)}` : slug

    // Create post
    await db.insert(posts).values({
      id,
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      published: published || false,
      createdAt: now,
      updatedAt: now,
      views: 0,
    })

    // Add categories
    if (categoryIds && categoryIds.length > 0) {
      await db.insert(postCategories).values(
        categoryIds.map((catId: string) => ({
          postId: id,
          categoryId: catId,
        }))
      )
    }

    // Add tags
    if (tagIds && tagIds.length > 0) {
      await db.insert(postTags).values(
        tagIds.map((tagId: string) => ({
          postId: id,
          tagId,
        }))
      )
    }

    return NextResponse.json({
      post: { id, slug: finalSlug },
      message: 'Post created successfully',
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
