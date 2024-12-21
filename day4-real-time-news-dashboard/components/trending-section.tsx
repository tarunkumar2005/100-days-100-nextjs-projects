import { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

interface TrendingNews {
  id: number;
  title: string;
  url: string;
}

export default function TrendingSection() {
  const [trendingNews, setTrendingNews] = useState<TrendingNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/fetch-news`, {
          params: {
            number: 5,
            'source-country': 'in',
            'language': 'en',
            sort: 'relevance',
            'sort-direction': 'DESC',
          },
        })
        setTrendingNews(response.data)
      } catch (error) {
        console.error(error)
        setError('Failed to fetch trending news.')
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingNews()
  }, [])

  if (loading) {
    return (
      <div className="glossy rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Trending Now</h2>
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glossy rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Trending Now</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="glossy rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">Trending Now</h2>
      <ul className="space-y-3">
        {trendingNews.map((news, index) => (
          <li key={news.id} className="flex items-center">
            <span className="text-accent mr-2 font-bold">#{index + 1}</span>
            <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline line-clamp-2">
              {news.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}