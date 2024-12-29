'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowDown, ArrowUp, RefreshCcw } from 'lucide-react';
import { TopMoverStock } from '@/types/app';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';

interface TopMoversData {
  gainers: TopMoverStock[];
  losers: TopMoverStock[];
}

interface TopMoversProps {
  initialData: TopMoversData;
}

async function fetchTopMovers(): Promise<TopMoversData> {
  const response = await fetch('/api/get-top-movers');
  if (!response.ok) {
    throw new Error('Failed to fetch top movers');
  }
  return response.json();
}

export default function TopMovers({ initialData }: TopMoversProps) {
  const [topMovers, setTopMovers] = useState<TopMoversData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const updateData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTopMovers();
        setTopMovers(data);
        setError(null);
        setLastUpdated(new Date());
      } catch (error) {
        logger.error('Failed to update data', error);
        setError('Failed to update data');
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTopMovers();
      setTopMovers(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (error) {
      logger.error('Failed to update data', error);
      setError('Failed to update data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="bg-muted">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Top Market Movers</CardTitle>
            <CardDescription>
              Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRetry}
            disabled={isLoading}
            aria-label="Refresh data"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <div className="p-4 text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <Button onClick={handleRetry} disabled={isLoading}>
              Retry
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="gainers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
              <TabsTrigger value="losers">Top Losers</TabsTrigger>
            </TabsList>
            <TabsContent value="gainers">
              <div className="divide-y">
                {topMovers.gainers.map((stock) => (
                  <StockItem key={stock.symbol} stock={stock} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="losers">
              <div className="divide-y">
                {topMovers.losers.map((stock) => (
                  <StockItem key={stock.symbol} stock={stock} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

function StockItem({ stock }: { stock: TopMoverStock }) {
  const getChangeColor = (change: number) => {
    if (change > 3) return "text-green-600";
    if (change > 0) return "text-green-500";
    if (change < -3) return "text-red-600";
    if (change < 0) return "text-red-500";
    return "text-gray-500";
  };
  const router = useRouter();

  const handleStockClick = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors hover:cursor-pointer" onClick={() => handleStockClick(stock.symbol)}>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{stock.symbol}</Badge>
          <span className="text-sm font-medium truncate">{stock.name}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">${(stock.price || 0).toFixed(2)}</p>
      </div>
      <div className="text-right flex-1">
        <p className={`flex items-center justify-end text-sm font-semibold ${getChangeColor(stock.changePercent)}`}>
          {stock.changePercent >= 0 ? 
            <ArrowUp className="mr-1 h-4 w-4" /> : 
            <ArrowDown className="mr-1 h-4 w-4" />
          }
          {(stock.change || 0).toFixed(2)} ({(stock.changePercent || 0).toFixed(2)}%)
        </p>
        <div className="mt-1 w-full">
          <Progress 
            value={Math.abs(stock.changePercent)} 
            max={10}
            className={`h-1 ${stock.changePercent >= 0 ? 'bg-green-200' : 'bg-red-200'}`}
            data-state={stock.changePercent >= 0 ? 'positive' : 'negative'}
          />
        </div>
      </div>
    </div>
  );
}