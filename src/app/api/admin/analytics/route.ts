import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, likes, comments } from '@/lib/schema'
import { isAuthenticated } from '@/lib/auth'
import { sql, desc } from 'drizzle-orm'

export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Total posts
    const [totalPosts] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)

    // Published posts
    const [publishedPosts] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(sql`published = true`)

    // Total views
    const [totalViews] = await db
      .select({ sum: sql<number>`coalesce(sum(views), 0)` })
      .from(posts)

    // Total likes
    const [totalLikes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)

    // Total comments
    const [totalComments] = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments)

    // Top posts by views
    const topPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        views: posts.views,
      })
      .from(posts)
      .orderBy(desc(posts.views))
      .limit(5)

    return NextResponse.json({
      stats: {
        totalPosts: totalPosts?.count || 0,
        publishedPosts: publishedPosts?.count || 0,
        totalViews: totalViews?.sum || 0,
        totalLikes: totalLikes?.count || 0,
        totalComments: totalComments?.count || 0,
      },
      topPosts,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
