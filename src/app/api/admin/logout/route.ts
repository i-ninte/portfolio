import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession, getSessionToken } from '@/lib/auth'

export async function POST() {
  try {
    const token = await getSessionToken()

    if (token) {
      await deleteSession(token)
    }

    const cookieStore = await cookies()
    cookieStore.delete('admin_session')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
