import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMMM d, yyyy')
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  const stripped = stripHtml(content)
  return truncateText(stripped, maxLength)
}

export function getReadingTime(content: string): number {
  const text = stripHtml(content)
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Generate a simple fingerprint from request headers
export function generateFingerprint(
  ip: string | null,
  userAgent: string | null
): string {
  const data = `${ip || 'unknown'}-${userAgent || 'unknown'}`
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

// Check if content contains spam patterns
export function isSpam(content: string): boolean {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|click here|buy now)\b/i,
    /(.)\1{10,}/, // Repeated characters
    /(https?:\/\/[^\s]+){3,}/, // Multiple URLs
  ]
  return spamPatterns.some(pattern => pattern.test(content))
}

// Basic profanity filter (can be expanded)
const profanityList = ['badword1', 'badword2'] // Add actual words
export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase()
  return profanityList.some(word => lower.includes(word))
}

// Sanitize user input (basic XSS prevention)
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}
