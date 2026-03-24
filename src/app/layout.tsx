import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kwabena Obeng | AI/ML Engineer',
  description: 'AI/ML Engineer building scalable intelligence | Computer Vision & NLP Specialist',
  keywords: ['AI', 'ML', 'Machine Learning', 'Computer Vision', 'NLP', 'Python', 'Deep Learning'],
  authors: [{ name: 'Kwabena Obeng' }],
  openGraph: {
    title: 'Kwabena Obeng | AI/ML Engineer',
    description: 'AI/ML Engineer building scalable intelligence | Computer Vision & NLP Specialist',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kwabena Obeng | AI/ML Engineer',
    description: 'AI/ML Engineer building scalable intelligence | Computer Vision & NLP Specialist',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen">
        <div className="relative">
          {/* Background effects */}
          <div className="fixed inset-0 grid-bg pointer-events-none" />
          <div className="fixed inset-0 noise-overlay pointer-events-none" />

          {/* Main content */}
          <main className="relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
