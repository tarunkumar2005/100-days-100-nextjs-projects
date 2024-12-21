'use client'

import { useState } from 'react'

export default function Filters() {
  const [category, setCategory] = useState('all')
  const [language, setLanguage] = useState('en')

  return (
    <div className="flex space-x-4">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="glossy text-white bg-transparent border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="all">All Categories</option>
        <option value="business">Business</option>
        <option value="technology">Technology</option>
        <option value="sports">Sports</option>
        <option value="entertainment">Entertainment</option>
      </select>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="glossy text-white bg-transparent border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
    </div>
  )
}