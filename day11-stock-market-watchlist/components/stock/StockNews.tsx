import StockNewsClient from './StockNewsClient'
import { getCompanyNews } from '@/lib/finnhub'

interface StockNewsProps {
  symbol: string
}

export default async function StockNews({ symbol }: StockNewsProps) {
  const to = new Date().toISOString().split('T')[0]
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const news = await getCompanyNews(symbol, from, to)

  return <StockNewsClient initialData={news} symbol={symbol} />
}