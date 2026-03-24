'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="relative mb-12">
      {/* Initials badge */}
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-accent/30">
        KO
      </div>

      {/* Name and title */}
      <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
        Kwabena Obeng
      </h1>
      <p className="text-xl text-gray-400 mb-2">
        AI/ML Engineer building scalable intelligence | Computer Vision & NLP Specialist
      </p>
      <p className="text-gray-500 mb-6 flex items-center gap-2">
        <i className="fas fa-location-dot text-accent" />
        Accra, Ghana
      </p>

      {/* Social links */}
      <div className="flex flex-wrap gap-4 mb-4">
        <a
          href="https://www.linkedin.com/in/kwabenaobeng/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
        >
          <i className="fab fa-linkedin text-lg" />
          <span>LinkedIn</span>
        </a>
        <a
          href="https://x.com/i_ninte/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
        >
          <i className="fab fa-x-twitter text-lg" />
          <span>X</span>
        </a>
        <a
          href="https://github.com/i-ninte"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
        >
          <i className="fab fa-github text-lg" />
          <span>GitHub</span>
        </a>
        <a
          href="https://public.tableau.com/app/profile/kwabena.obeng/vizzes"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
        >
          <i className="fas fa-chart-simple text-lg" />
          <span>Tableau</span>
        </a>
        <a
          href="https://huggingface.co/ninte"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
        >
          <span className="text-lg">🤗</span>
          <span>Hugging Face</span>
        </a>
      </div>

      {/* Contact info */}
      <div className="flex flex-wrap gap-6 text-gray-500 mb-8">
        <span className="flex items-center gap-2">
          <i className="fas fa-envelope text-accent/70" />
          slyobeng111@gmail.com
        </span>
        <span className="flex items-center gap-2">
          <i className="fas fa-phone text-accent/70" />
          +233 593 178 619
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4">
        <a
          href="https://drive.google.com/uc?export=download&id=1myE7nNOTeRcWeVs3o59CsJpMHvMEGxE_"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glow"
        >
          <i className="fas fa-download mr-2" />
          Download CV
        </a>
        <a
          href="https://drive.google.com/file/d/1U4gLTli4a9VGtMmlHYYFrvYa4ZBqKMuh/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          <i className="fas fa-file-alt mr-2" />
          Research Statement
        </a>
        <Link href="/blog" className="btn-outline">
          <i className="fas fa-newspaper mr-2" />
          Blog
        </Link>
      </div>
    </header>
  )
}
