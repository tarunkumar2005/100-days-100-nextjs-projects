import StockDetailsClient from './StockDetailsClient'
import { getStockQuote, getCompanyProfile } from '@/lib/finnhub'

interface StockDetailsProps {
  symbol: string
}

export default async function StockDetails({ symbol }: StockDetailsProps) {
  const [quote, profile] = await Promise.all([
    getStockQuote(symbol),
    getCompanyProfile(symbol)
  ])

  return <StockDetailsClient initialData={{ symbol, quote, profile }} />
}
