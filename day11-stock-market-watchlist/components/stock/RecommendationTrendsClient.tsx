'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { StockRecommendation } from '@/types/app'
import axios from 'axios'
import { logger } from '@/lib/logger';

interface RecommendationTrendsProps {
  initialData: StockRecommendation[]
  symbol: string
}

export default function RecommendationTrendsClient({ initialData, symbol }: RecommendationTrendsProps) {
  const [trends, setTrends] = useState(initialData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/stock/${symbol}?type=recommendations`)
        setTrends(response.data)
      } catch (error) {
        logger.error('Failed to fetch recommendation trends:', error)
      }
    }

    const interval = setInterval(fetchData, 3600000) // Update every hour
    fetchData() // Initial fetch
    
    return () => clearInterval(interval)
  }, [symbol])

  if (trends.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyst Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="strongBuy" stackId="a" fill="#22c55e" name="Strong Buy" />
            <Bar dataKey="buy" stackId="a" fill="#86efac" name="Buy" />
            <Bar dataKey="hold" stackId="a" fill="#fde047" name="Hold" />
            <Bar dataKey="sell" stackId="a" fill="#fca5a5" name="Sell" />
            <Bar dataKey="strongSell" stackId="a" fill="#ef4444" name="Strong Sell" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}