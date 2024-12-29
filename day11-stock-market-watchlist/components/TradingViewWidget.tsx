'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define types for TradingView widget instance
interface TradingViewWidget {
  remove(): void;
}

// Define types for TradingView
declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewConfig) => TradingViewWidget;
    };
  }
}

interface TradingViewConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: "light" | "dark";
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  container_id: string;
  studies?: string[];
  save_image?: boolean;
  hide_side_toolbar?: boolean;
}

// Popular market indices
const MARKET_INDICES = [
  { symbol: "NASDAQ:AAPL", name: "Apple Inc." },
  { symbol: "NASDAQ:MSFT", name: "Microsoft" },
  { symbol: "NYSE:JPM", name: "JP Morgan" },
  { symbol: "NASDAQ:GOOGL", name: "Google" },
  { symbol: "NYSE:BAC", name: "Bank of America" },
] as const;

// Time intervals
const TIME_INTERVALS = [
  { value: "1", label: "1 min" },
  { value: "5", label: "5 min" },
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "60", label: "1 hour" },
  { value: "D", label: "1 day" },
  { value: "W", label: "1 week" },
] as const;

export default function TradingViewWidget() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(MARKET_INDICES[0].symbol);
  const [selectedInterval, setSelectedInterval] = useState("D");
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<TradingViewWidget | null>(null);

  const initializeWidget = useCallback(() => {
    if (!containerRef.current || !window.TradingView) return;

    containerRef.current.innerHTML = '';
    
    const config: TradingViewConfig = {
      autosize: true,
      symbol: selectedSymbol,
      interval: selectedInterval,
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tradingview-widget",
      studies: ["Volume@tv-basicstudies"],
      save_image: true,
      hide_side_toolbar: false,
    };

    widgetRef.current = new window.TradingView.widget(config);
  }, [selectedSymbol, selectedInterval]);

  useEffect(() => {
    const container = containerRef.current;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = initializeWidget;
    document.head.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
      document.head.removeChild(script);
      widgetRef.current = null;
    };
  }, [initializeWidget]);

  useEffect(() => {
    if (window.TradingView) {
      initializeWidget();
    }
  }, [initializeWidget]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Market Chart</CardTitle>
          <div className="flex gap-4">
            <Select
              value={selectedSymbol}
              onValueChange={setSelectedSymbol}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Symbol" />
              </SelectTrigger>
              <SelectContent>
                {MARKET_INDICES.map((index) => (
                  <SelectItem key={index.symbol} value={index.symbol}>
                    {index.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedInterval}
              onValueChange={setSelectedInterval}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                {TIME_INTERVALS.map((interval) => (
                  <SelectItem key={interval.value} value={interval.value}>
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          id="tradingview-widget" 
          ref={containerRef}
          className="h-[500px] w-full"
        />
      </CardContent>
    </Card>
  );
}