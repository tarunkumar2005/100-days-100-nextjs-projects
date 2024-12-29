'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, Search, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function WatchlistComponent() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('symbol');

  useEffect(() => {
    const storedWatchlist = localStorage.getItem('watchlist');
    if (storedWatchlist) {
      setStocks(JSON.parse(storedWatchlist));
    }
  }, []);

  const removeStock = (symbol: string) => {
    const updatedStocks = stocks.filter(stock => stock.symbol !== symbol);
    setStocks(updatedStocks);
    localStorage.setItem('watchlist', JSON.stringify(updatedStocks));
  };

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'change') return b.changePercent - a.changePercent;
    return a.symbol.localeCompare(b.symbol);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="symbol">Symbol</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="change">Change %</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedStocks.map((stock) => (
          <Card key={stock.symbol} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{stock.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStock(stock.symbol)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold">${stock.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Change</p>
                  <p className={`font-semibold flex items-center ${
                    stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {stock.changePercent >= 0 ? 
                      <ArrowUp className="mr-1 h-3 w-3" /> : 
                      <ArrowDown className="mr-1 h-3 w-3" />
                    }
                    {stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stocks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Your watchlist is empty</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add stocks to your watchlist to track them here
          </p>
        </div>
      )}
    </div>
  );
}