'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber, formatCurrency } from "@/lib/utils"
import { QuoteData, CompanyProfile } from '@/types/app'
import axios from 'axios'
import { logger } from '@/lib/logger';

interface StockDetailsProps {
  initialData: {
    symbol: string
    quote: QuoteData
    profile: CompanyProfile
  }
}

export default function StockDetailsClient({ initialData }: StockDetailsProps) {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quoteResponse, profileResponse] = await Promise.all([
          axios.get(`/api/stock/${data.symbol}?type=quote`),
          axios.get(`/api/stock/${data.symbol}?type=profile`)
        ])
        setData(prevData => ({
          ...prevData,
          quote: quoteResponse.data,
          profile: profileResponse.data
        }))
      } catch (error) {
        logger.error('Failed to fetch stock details', error)
      }
    }

    const interval = setInterval(fetchData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [data.symbol])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="font-medium">{formatCurrency(data.quote.o)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Previous Close</p>
            <p className="font-medium">{formatCurrency(data.quote.pc)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Day&apos;s Range</p>
            <p className="font-medium">{formatCurrency(data.quote.l)} - {formatCurrency(data.quote.h)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatNumber(data.profile.marketCapitalization * 1000000)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Shares Outstanding</p>
            <p className="font-medium">{formatNumber(data.profile.shareOutstanding)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Industry</p>
            <p className="font-medium">{data.profile.finnhubIndustry}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}