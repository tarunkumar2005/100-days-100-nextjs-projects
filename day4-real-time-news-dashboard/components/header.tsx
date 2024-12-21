'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import debounce from 'lodash/debounce'

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('text') || '')

  const handleSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set('text', value)
      } else {
        params.delete('text')
      }
      router.push(`/?${params.toString()}`)
    }, 300),
    [router, searchParams]
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    handleSearch(value)
    onSearch(value)
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Real Time News</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              className="w-64 pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              value={query}
              onChange={onChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  )
}