'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Tab = 'about' | 'experience' | 'research' | 'education' | 'projects'

interface TabNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'about', label: 'About', icon: 'fa-user' },
  { id: 'experience', label: 'Experience', icon: 'fa-briefcase' },
  { id: 'research', label: 'Research', icon: 'fa-flask' },
  { id: 'education', label: 'Education', icon: 'fa-graduation-cap' },
  { id: 'projects', label: 'Projects', icon: 'fa-code' },
]

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-dark-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'tab-btn flex items-center gap-2',
            activeTab === tab.id && 'active'
          )}
        >
          <i className={`fas ${tab.icon} text-sm`} />
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export type { Tab }
