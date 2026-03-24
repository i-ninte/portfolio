'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import TabNavigation, { type Tab } from '@/components/TabNavigation'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Research from '@/components/sections/Research'
import Education from '@/components/sections/Education'
import Projects from '@/components/sections/Projects'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('about')

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <About />
      case 'experience':
        return <Experience />
      case 'research':
        return <Research />
      case 'education':
        return <Education />
      case 'projects':
        return <Projects />
      default:
        return <About />
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div key={activeTab} className="min-h-[60vh]">
        {renderContent()}
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-dark-border text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Kwabena Obeng</p>
      </footer>
    </div>
  )
}
