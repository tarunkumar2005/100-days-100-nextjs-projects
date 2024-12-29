'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Plus, Minus } from 'lucide-react'
import { TopMoverStock } from '@/types/app';

interface WatchlistButtonProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}
export default function WatchlistButton({ symbol, name, price, change, changePercent }: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.some((stock: TopMoverStock) => stock.symbol === symbol));
  }, [symbol]);

  const handleWatchlistToggle = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (isInWatchlist) {
      const updatedWatchlist = watchlist.filter((stock: TopMoverStock) => stock.symbol !== symbol);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      const newStock: TopMoverStock = { symbol, name, price, change, changePercent };
      watchlist.push(newStock);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
    setIsInWatchlist(!isInWatchlist);
  };

  return (
    <Button onClick={handleWatchlistToggle} variant={isInWatchlist ? "destructive" : "default"}>
      {isInWatchlist ? (
        <>
          <Minus className="mr-2 h-4 w-4" /> Remove from Watchlist
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" /> Add to Watchlist
        </>
      )}
    </Button>
  );
}