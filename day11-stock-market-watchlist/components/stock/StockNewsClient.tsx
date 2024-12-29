'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyNews } from '@/types/app'
import { ExternalLink } from 'lucide-react'
import axios from 'axios'
import { logger } from '@/lib/logger';

interface StockNewsClientProps {
  initialData: CompanyNews[]
  symbol: string
}

export default function StockNewsClient({ initialData, symbol }: StockNewsClientProps) {
  const [news, setNews] = useState(initialData)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/stock/${symbol}?type=news`)
        setNews(response.data)
      } catch (error) {
        logger.error('Failed to fetch stock news', error)
      }
    }

    const interval = setInterval(fetchNews, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [symbol])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent News</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {news.slice(0, 5).map((item, index) => (
            <li key={index}>
              <a href={item.url} className="block hover:bg-muted p-2 rounded transition-colors" target="_blank" rel="noopener noreferrer">
                <h3 className="font-semibold flex items-center">
                  {item.headline}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </h3>
                <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                  <span>{item.source}</span>
                  <span>{new Date(item.datetime * 1000).toLocaleDateString()}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}