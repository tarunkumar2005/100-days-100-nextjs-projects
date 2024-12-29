import RecommendationTrendsClient from './RecommendationTrendsClient'
import { getRecommendationTrends } from '@/lib/finnhub'

interface RecommendationTrendsProps {
  symbol: string
}

export default async function RecommendationTrends({ symbol }: RecommendationTrendsProps) {
  const data = await getRecommendationTrends(symbol)

  return <RecommendationTrendsClient initialData={data} symbol={symbol} />
}