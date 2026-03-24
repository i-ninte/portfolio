import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const resetLink = `${baseUrl}/admin-portal-k0/reset-password?token=${resetToken}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; margin: 0; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #141414; border-radius: 12px; padding: 40px; border: 1px solid #2a2a2a;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 24px;">🔐</span>
          </div>
          <h1 style="color: #f5f5f5; font-size: 24px; margin: 0;">Password Reset Request</h1>
        </div>

        <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          You requested to reset your admin password. Click the button below to set a new password. This link will expire in 1 hour.
        </p>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
        </p>

        <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 30px 0;">

        <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
          If the button doesn't work, copy and paste this link:<br>
          <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
        </p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Password Reset - Portfolio Admin',
    html,
  })
}
