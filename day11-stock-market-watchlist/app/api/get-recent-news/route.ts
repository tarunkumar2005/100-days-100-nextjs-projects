import { NextResponse } from 'next/server';
import { getMarketNews } from "@/lib/finnhub";
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const news = await getMarketNews();
    
    const processedNews = news
      .slice(0, 10)
      .map(item => ({
        title: item.headline,
        source: item.source,
        url: item.url,
        date: new Date(item.datetime * 1000).toLocaleDateString(),
      }));

    return NextResponse.json(processedNews);
  } catch (error) {
    logger.error('Failed to fetch news', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}