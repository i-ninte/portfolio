import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, postCategories, postTags } from '@/lib/schema'
import { isAuthenticated } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { slugify } from '@/lib/utils'
import { nanoid } from 'nanoid'

// Get single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

// Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, excerpt, coverImage, published, categoryIds, tagIds } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check if post exists
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1)

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Update slug if title changed
    let newSlug = existingPost.slug
    if (title !== existingPost.title) {
      newSlug = slugify(title)
      // Check uniqueness
      const slugExists = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, newSlug))
        .limit(1)

      if (slugExists.length > 0 && slugExists[0].id !== id) {
        newSlug = `${newSlug}-${nanoid(6)}`
      }
    }

    // Update post
    await db
      .update(posts)
      .set({
        title,
        slug: newSlug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        published: published || false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, id))

    // Update categories
    await db.delete(postCategories).where(eq(postCategories.postId, id))
    if (categoryIds && categoryIds.length > 0) {
      await db.insert(postCategories).values(
        categoryIds.map((catId: string) => ({
          postId: id,
          categoryId: catId,
        }))
      )
    }

    // Update tags
    await db.delete(postTags).where(eq(postTags.postId, id))
    if (tagIds && tagIds.length > 0) {
      await db.insert(postTags).values(
        tagIds.map((tagId: string) => ({
          postId: id,
          tagId,
        }))
      )
    }

    return NextResponse.json({
      post: { id, slug: newSlug },
      message: 'Post updated successfully',
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    await db.delete(posts).where(eq(posts.id, id))

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
