'use client'

import { useState } from 'react'
import Header from '@/components/header'
import NewsGrid from '@/components/news-grid'
import TrendingSection from '@/components/trending-section'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header onSearch={handleSearch} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <NewsGrid searchQuery={searchQuery} />
          </div>
          <div className="lg:w-1/4">
            <TrendingSection />
          </div>
        </div>
      </div>
    </main>
  )
}