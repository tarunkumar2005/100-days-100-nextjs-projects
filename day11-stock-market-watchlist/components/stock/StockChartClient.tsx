'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteData } from '@/types/app'
import axios from 'axios'
import { logger } from '@/lib/logger';

interface StockChartProps {
  symbol: string
  initialData: QuoteData
}

export default function StockChartClient({ symbol, initialData }: StockChartProps) {
  const [quoteData, setQuoteData] = useState<QuoteData>(initialData)

  useEffect(() => {
    const fetchQuoteData = async () => {
      try {
        const response = await axios.get<QuoteData>(`/api/stock/${symbol}?type=quote`)
        setQuoteData(response.data)
      } catch (error) {
        logger.error('Failed to fetch stock quote data', error)
      }
    }

    const interval = setInterval(fetchQuoteData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [symbol])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Price</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="text-2xl font-bold">${quoteData.c.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Change</p>
            <p className={`text-2xl font-bold ${quoteData.d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${quoteData.d.toFixed(2)} ({quoteData.dp.toFixed(2)}%)
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">High</p>
            <p className="text-xl">${quoteData.h.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Low</p>
            <p className="text-xl">${quoteData.l.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="text-xl">${quoteData.o.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Previous Close</p>
            <p className="text-xl">${quoteData.pc.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}