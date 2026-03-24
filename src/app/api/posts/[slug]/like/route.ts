import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, likes } from '@/lib/schema'
import { eq, and, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { generateFingerprint } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Get the post
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Generate fingerprint from request
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    const fingerprint = generateFingerprint(ip, userAgent)

    // Check if already liked
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, post.id), eq(likes.fingerprint, fingerprint)))
      .limit(1)

    if (existingLike.length > 0) {
      // Already liked, return current count
      const [likeCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(likes)
        .where(eq(likes.postId, post.id))

      return NextResponse.json({
        likes: likeCount?.count || 0,
        message: 'Already liked',
      })
    }

    // Add like
    await db.insert(likes).values({
      id: nanoid(),
      postId: post.id,
      fingerprint,
      createdAt: new Date().toISOString(),
    })

    // Get new count
    const [likeCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(eq(likes.postId, post.id))

    return NextResponse.json({
      likes: likeCount?.count || 0,
      message: 'Liked successfully',
    })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }
}
