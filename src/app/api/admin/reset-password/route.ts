import { NextRequest, NextResponse } from 'next/server'
import { generateResetToken, verifyResetToken, updatePassword, getAdminEmail } from '@/lib/auth'

// Request password reset (generates token and would normally send email)
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

      // In production, you would send an email here
      // For now, we'll return the reset link directly (only for development)
      const resetLink = `/admin-portal-k0/reset-password?token=${resetToken}`

      console.log(`Password reset requested for ${getAdminEmail()}`)
      console.log(`Reset link: ${resetLink}`)

      // Return success - in production, don't expose the token
      return NextResponse.json({
        success: true,
        message: 'Password reset link generated',
        // Only include token in development
        ...(process.env.NODE_ENV !== 'production' && { resetLink }),
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
