import { NextRequest, NextResponse } from 'next/server'
import { generateResetToken, verifyResetToken, updatePassword, getAdminEmail } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, token, newPassword } = body

    if (action === 'request') {
      // Generate reset token
      const resetToken = await generateResetToken()
      if (!resetToken) {
        return NextResponse.json({ error: 'Failed to generate reset token' }, { status: 500 })
      }

      // Get admin email from database
      const adminEmail = getAdminEmail()

      // Send reset email
      const emailSent = await sendPasswordResetEmail(adminEmail, resetToken)

      if (!emailSent) {
        return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
      }

      console.log(`Password reset email sent to ${adminEmail}`)

      return NextResponse.json({
        success: true,
        message: 'Password reset link sent to your email',
      })
    }

    if (action === 'reset') {
      if (!token || !newPassword) {
        return NextResponse.json({ error: 'Token and new password required' }, { status: 400 })
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
      }

      // Verify token
      const isValid = await verifyResetToken(token)
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
      }

      // Update password
      const updated = await updatePassword(newPassword)
      if (!updated) {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Password updated successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Password reset failed' }, { status: 500 })
  }
}
