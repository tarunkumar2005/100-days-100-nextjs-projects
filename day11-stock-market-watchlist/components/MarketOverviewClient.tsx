'use client';

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarketData } from "@/types/app"
import { TrendingDown, TrendingUp, DollarSign, BarChart2, Activity } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { formatPercentage } from "@/lib/utils"
import axios from 'axios'
import { logger } from '@/lib/logger';

interface MarketOverviewProps {
  initialData: MarketData;
}
   
async function fetchMarketOverview(): Promise<MarketData> {
  const response = await axios.get('/api/get-market-overview');
  if (!response.data) {
    throw new Error('Failed to fetch market overview');
  }
  return response.data;
}

export default function MarketOverview({ initialData }: MarketOverviewProps) {
  const [marketData, setMarketData] = useState<MarketData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function updateData() {
      setLoading(true);
      try {
        const data = await fetchMarketOverview();
        if (data && Object.values(data).some(v => v !== 0)) {
          setMarketData(data);
          setError(null);
        } else {
          setError('Unable to fetch valid market data');
        }
      } catch (error) {
        logger.error(error);
        setError('Failed to update market data');
      } finally {
        setLoading(false);
      }
    }

    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6">
          <p className="text-center">Loading market data...</p>
        </CardContent>
      </Card>
    )
  }

  const formatValue = (value: number, type: 'percentage' | 'number' | 'currency'): string => {
    if (!Number.isFinite(value)) return '0';
    
    switch (type) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'number':
        return value.toLocaleString();
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
          maximumFractionDigits: 1
        }).format(value);
      default:
        return value.toString();
    }
  };

  const overviewItems = [
    {
      title: "Market Sentiment",
      value: formatValue(Math.abs(marketData.overallSentiment || 0), 'percentage'),
      change: marketData.overallSentiment || 0,
      icon: Activity,
      color: (marketData.overallSentiment || 0) >= 0 ? "text-green-500" : "text-red-500",
    },
    {
      title: "Trading Volume",
      value: formatValue(marketData.tradingVolume || 0, 'number'),
      change: marketData.volumeChange || 0,
      icon: BarChart2,
      color: "text-blue-500",
    },
    {
      title: "Market Cap",
      value: formatValue(marketData.totalMarketCap || 0, 'currency'),
      change: marketData.marketCapChange || 0,
      icon: DollarSign,
      color: "text-green-500",
    },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {overviewItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="text-3xl font-bold mb-2">{item.value}</div>
                <div className="flex items-center">
                  {item.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <Badge variant={item.change >= 0 ? "default" : "destructive"}>
                    {formatPercentage(item.change)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}