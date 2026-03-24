'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // If no token, show request reset form
  const [email, setEmail] = useState('')
  const [resetLink, setResetLink] = useState('')

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request' }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Password reset link generated!')
        if (data.resetLink) {
          setResetLink(data.resetLink)
        }
      } else {
        setError(data.error || 'Failed to request reset')
      }
    } catch (err) {
      setError('Failed to request reset')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', token, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Password updated successfully!')
        setTimeout(() => {
          router.push('/admin-portal-k0')
        }, 2000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center">
              <i className="fas fa-key text-2xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {token ? 'Set New Password' : 'Reset Password'}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {token
                ? 'Enter your new password below'
                : 'Generate a password reset link'}
            </p>
          </div>

          {token ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-dark"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-dark"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-glow disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {!resetLink ? (
                <form onSubmit={handleRequestReset} className="space-y-6">
                  <p className="text-gray-400 text-sm">
                    Click the button below to generate a password reset link for the admin account.
                  </p>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-glow disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-envelope mr-2" />
                        Generate Reset Link
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                    <p className="text-green-400 text-sm mb-2">Reset link generated!</p>
                    <p className="text-gray-400 text-xs">Click the link below to reset your password:</p>
                  </div>
                  <Link
                    href={resetLink}
                    className="block w-full btn-glow text-center"
                  >
                    <i className="fas fa-key mr-2" />
                    Reset Password Now
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/admin-portal-k0" className="text-accent hover:underline text-sm">
              <i className="fas fa-arrow-left mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
