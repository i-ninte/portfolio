import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { db } from './db'
import { adminSessions, adminUser } from './schema'
import { eq, lt } from 'drizzle-orm'

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const RESET_TOKEN_DURATION = 60 * 60 * 1000 // 1 hour
const ADMIN_EMAIL = 'slyobeng111@gmail.com'
const DEFAULT_PASSWORD = 'admin123' // Initial password, should be changed

// Initialize admin user if not exists
export async function initializeAdmin(): Promise<void> {
  try {
    const existing = await db
      .select()
      .from(adminUser)
      .where(eq(adminUser.email, ADMIN_EMAIL))
      .limit(1)

    if (existing.length === 0) {
      const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12)
      await db.insert(adminUser).values({
        id: nanoid(),
        email: ADMIN_EMAIL,
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      console.log('Admin user initialized with default password')
    }
  } catch (error) {
    console.error('Error initializing admin:', error)
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  try {
    // Initialize admin if not exists
    await initializeAdmin()

    const admin = await db
      .select()
      .from(adminUser)
      .where(eq(adminUser.email, ADMIN_EMAIL))
      .limit(1)

    if (admin.length === 0) {
      console.error('Admin user not found')
      return false
    }

    return bcrypt.compare(password, admin[0].passwordHash)
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function updatePassword(newPassword: string): Promise<boolean> {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 12)
    await db
      .update(adminUser)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adminUser.email, ADMIN_EMAIL))
    return true
  } catch (error) {
    console.error('Error updating password:', error)
    return false
  }
}

export async function generateResetToken(): Promise<string | null> {
  try {
    const resetToken = nanoid(32)
    const expiry = new Date(Date.now() + RESET_TOKEN_DURATION).toISOString()

    await db
      .update(adminUser)
      .set({
        resetToken,
        resetTokenExpiry: expiry,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adminUser.email, ADMIN_EMAIL))

    return resetToken
  } catch (error) {
    console.error('Error generating reset token:', error)
    return null
  }
}

export async function verifyResetToken(token: string): Promise<boolean> {
  try {
    const admin = await db
      .select()
      .from(adminUser)
      .where(eq(adminUser.email, ADMIN_EMAIL))
      .limit(1)

    if (admin.length === 0 || !admin[0].resetToken || !admin[0].resetTokenExpiry) {
      return false
    }

    if (admin[0].resetToken !== token) {
      return false
    }

    if (new Date(admin[0].resetTokenExpiry) < new Date()) {
      return false
    }

    return true
  } catch (error) {
    console.error('Error verifying reset token:', error)
    return false
  }
}

export async function createSession(): Promise<string> {
  const token = nanoid(32)
  const id = nanoid()
  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString()

  await db.insert(adminSessions).values({
    id,
    token,
    expiresAt,
  })

  return token
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) return false

  try {
    const sessions = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.token, token))
      .limit(1)

    if (sessions.length === 0) return false

    const session = sessions[0]
    const expiresAt = new Date(session.expiresAt)

    if (expiresAt < new Date()) {
      await db.delete(adminSessions).where(eq(adminSessions.id, session.id))
      return false
    }

    return true
  } catch (error) {
    console.error('Error validating session:', error)
    return false
  }
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(adminSessions).where(eq(adminSessions.token, token))
}

export async function cleanExpiredSessions(): Promise<void> {
  const now = new Date().toISOString()
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, now))
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value || null
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionToken()
  if (!token) return false
  return validateSession(token)
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL
}
