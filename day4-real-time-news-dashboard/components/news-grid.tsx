import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import NewsCard from './news-card'
import { Loader2 } from 'lucide-react'

interface News {
  id: number;
  title: string;
  text: string;
  summary: string;
  url: string;
  image: string;
  publish_date: string;
  language: string;
  categories: string[];
  source_country: string;
}

interface NewsGridProps {
  searchQuery: string;
}

export default function NewsGrid({ searchQuery }: NewsGridProps) {
  const [newsArticles, setNewsArticles] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(5)
  const [filters, setFilters] = useState({
    sourceCountry: 'in',
    language: 'en',
    category: ''
  })

  const fetchNews = useCallback(async () => {
    console.log('Fetching news...');
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/fetch-news', {
        params: {
          ...filters,
          text: searchQuery,
        },
      })
      setNewsArticles(response.data)
    } catch (error: unknown) {
      if (retry > 0 && axios.isAxiosError(error) && error.response?.status === 429) {
        setRetry(prev => prev - 1)
        return fetchNews()
      }
      console.error(error)
      setError('Failed to fetch news. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [filters, searchQuery, retry])

  useEffect(() => {
    fetchNews();
    const interval: NodeJS.Timeout = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <select
          name="sourceCountry"
          onChange={handleFilterChange}
          value={filters.sourceCountry}
          className="glossy text-white bg-transparent border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="us">United States</option>
          <option value="gb">United Kingdom</option>
          <option value="in">India</option>
          <option value="au">Australia</option>
        </select>
        <select
          name="language"
          onChange={handleFilterChange}
          value={filters.language}
          className="glossy text-white bg-transparent border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
        <select
          name="category"
          onChange={handleFilterChange}
          value={filters.category}
          className="glossy text-white bg-transparent border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All Categories</option>
          <option value="business">Business</option>
          <option value="entertainment">Entertainment</option>
          <option value="politics">Politics</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
          <option value="health">Health</option>
          <option value="world">World</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article: News) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}