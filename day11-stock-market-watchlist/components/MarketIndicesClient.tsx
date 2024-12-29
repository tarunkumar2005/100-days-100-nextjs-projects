'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatNumber, formatPercentage } from "@/lib/utils";
import axios from 'axios';
import { logger } from '@/lib/logger';

interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
}

interface MarketIndicesProps {
  initialData: MarketIndex[];
}

async function fetchIndices(): Promise<MarketIndex[]> {
  const response = await axios.get('/api/get-market-indices');
  if (!response.data) {
    throw new Error('Failed to fetch market indices');
  }
  return response.data;
}

export default function MarketIndices({ initialData }: MarketIndicesProps) {
  const [indices, setIndices] = useState<MarketIndex[]>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function updateIndices() {
      try {
        const data = await fetchIndices();
        setIndices(data);
        setError(null);
      } catch (error) {
        logger.error(error);
        setError('Failed to update market indices');
      }
    }

    const interval = setInterval(updateIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-red-500 text-center">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!indices.length) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 text-center">
          Loading market indices...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Market Indices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {indices.map((index) => (
            <div key={index.symbol} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md transition-colors">
              <div>
                <p className="font-medium">{index.name}</p>
                <p className="text-sm text-muted-foreground">{index.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatNumber(index.value)}</p>
                <p className={`text-sm flex items-center justify-end ${
                  index.change >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {index.change >= 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {formatPercentage(Math.abs(index.change))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}