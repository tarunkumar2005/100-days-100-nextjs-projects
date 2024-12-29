'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, RefreshCw } from 'lucide-react'
import { NewsItem } from "@/types/app";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { logger } from '@/lib/logger';

interface RecentNewsProps {
  initialNews: NewsItem[];
}

async function fetchNews(): Promise<NewsItem[]> {
  const response = await fetch('/api/get-recent-news');
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return response.json();
}

export default function RecentNews({ initialNews }: RecentNewsProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateNews = async () => {
    setIsLoading(true);
    try {
      const latestNews = await fetchNews();
      setNews(latestNews);
      setError(null);
      setLastUpdated(new Date());
    } catch (error) {
      logger.error(error);
      setError('Failed to update news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(updateNews, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (!news.length) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          {error || 'No news available'}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Recent News</CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={updateNews}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className="block hover:bg-muted/50 p-3 rounded-md transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="font-semibold flex items-center">
                {item.title}
                <ExternalLink className="ml-1 h-3 w-3" />
              </h3>
              <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                <span>{item.source}</span>
                <span>{item.date}</span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}