'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchBarProps {
  categories?: { id: string; name: string; slug: string }[]
  tags?: { id: string; name: string; slug: string }[]
}

export default function SearchBar({ categories = [], tags = [] }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '')

  const updateSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedTag) params.set('tag', selectedTag)

    router.push(`/blog?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearch()
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedCategory('')
    setSelectedTag('')
    router.push('/blog')
  }

  return (
    <div className="glass-card p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="input-dark pl-12"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
              }}
              className="input-dark flex-1 min-w-[150px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}

          {/* Tag filter */}
          {tags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => {
                setSelectedTag(e.target.value)
              }}
              className="input-dark flex-1 min-w-[150px]"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.slug}>
                  {tag.name}
                </option>
              ))}
            </select>
          )}

          {/* Search button */}
          <button type="submit" className="btn-glow">
            <i className="fas fa-search mr-2" />
            Search
          </button>

          {/* Clear button */}
          {(query || selectedCategory || selectedTag) && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn-outline"
            >
              <i className="fas fa-times mr-2" />
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
