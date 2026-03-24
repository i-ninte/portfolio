import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, comments } from '@/lib/schema'
import { eq, and, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { sanitizeInput, isSpam } from '@/lib/utils'

export async function GET(
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

    // Get approved comments
    const postComments = await db
      .select()
      .from(comments)
      .where(and(eq(comments.postId, post.id), eq(comments.approved, true)))
      .orderBy(desc(comments.createdAt))

    return NextResponse.json({ comments: postComments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const { authorName, authorEmail, content } = body

    // Validation
    if (!authorName || !content) {
      return NextResponse.json(
        { error: 'Name and comment are required' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(authorName).substring(0, 100)
    const sanitizedContent = sanitizeInput(content).substring(0, 2000)
    const sanitizedEmail = authorEmail ? sanitizeInput(authorEmail).substring(0, 255) : null

    // Check for spam
    if (isSpam(sanitizedContent)) {
      return NextResponse.json(
        { error: 'Comment flagged as spam' },
        { status: 400 }
      )
    }

    // Get the post
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Create comment
    const newComment = {
      id: nanoid(),
      postId: post.id,
      authorName: sanitizedName,
      authorEmail: sanitizedEmail,
      content: sanitizedContent,
      approved: true, // Auto-approve for now
      createdAt: new Date().toISOString(),
    }

    await db.insert(comments).values(newComment)

    return NextResponse.json({
      comment: newComment,
      message: 'Comment posted successfully',
    })
  } catch (error) {
    console.error('Error posting comment:', error)
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}
