import StockChartClient from './StockChartClient'
import { getStockQuote } from '@/lib/finnhub'

interface StockChartProps {
  symbol: string
}

export default async function StockChart({ symbol }: StockChartProps) {
  const quoteData = await getStockQuote(symbol)
  return <StockChartClient symbol={symbol} initialData={quoteData} />
}