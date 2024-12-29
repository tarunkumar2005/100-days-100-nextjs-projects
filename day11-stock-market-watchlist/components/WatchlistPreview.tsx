'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { TopMoverStock } from '@/types/app';
import { useRouter } from 'next/navigation';

export default function WatchlistPreview() {
  const [watchlistStocks, setWatchlistStocks] = useState<TopMoverStock[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedWatchlist = localStorage.getItem('watchlist');
    if (storedWatchlist) {
      setWatchlistStocks(JSON.parse(storedWatchlist));
    }
  }, []);

  const handleStockClick = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Watchlist</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/watchlist">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {watchlistStocks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Stocks
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {watchlistStocks.slice(0, 5).map((stock) => (
              <div 
                key={stock.symbol} 
                onClick={() => handleStockClick(stock.symbol)}
                className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md cursor-pointer"
              >
                <div>
                  <p className="font-semibold">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stock.change >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                    {stock.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}