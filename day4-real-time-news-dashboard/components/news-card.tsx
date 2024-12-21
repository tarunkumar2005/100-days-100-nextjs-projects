import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'

interface Article {
  id: number
  title: string
  summary: string
  url: string
  image: string | null
  publish_date: string
  categories: string[]
  source_country: string
}

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="glossy rounded-lg overflow-hidden transition-transform hover:scale-105 flex flex-col h-full">
      <Image 
        src={article.image ? `/api/image-proxy?url=${encodeURIComponent(article.image)}` : '/news.webp'} 
        alt={article.title} 
        width={500}
        height={200}    
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = '/news.webp'
        }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-2">
          {article.categories?.slice(0, 2).map((category, index) => (
            <span key={index} className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-accent rounded-full">
              {category}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-300">
            {formatDistanceToNow(new Date(article.publish_date), { addSuffix: true })}
          </span>
          <span className="text-xs text-gray-300">{article.source_country.toUpperCase()}</span>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-white line-clamp-2">{article.title}</h2>
        <p className="text-gray-200 line-clamp-3 flex-grow">{article.summary}</p>
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-4 inline-block text-accent hover:underline"
        >
          Read more
        </a>
      </div>
    </div>
  )
}