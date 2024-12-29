import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote, getCompanyProfile, getCompanyNews, getRecommendationTrends } from '@/lib/finnhub';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
): Promise<NextResponse> {
  const { symbol } = await params;
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'details':
        const [quote, profile] = await Promise.all([
          getStockQuote(symbol),
          getCompanyProfile(symbol),
        ]);
        return NextResponse.json({ quote, profile });

      case 'news':
        const to = new Date().toISOString().split('T')[0];
        const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const news = await getCompanyNews(symbol, from, to);
        return NextResponse.json(news);

      case 'profile':
        const companyProfile = await getCompanyProfile(symbol);
        return NextResponse.json(companyProfile);

      case 'quote':
        const stockQuote = await getStockQuote(symbol);
        return NextResponse.json(stockQuote);

      case 'recommendations':
        const recommendations = await getRecommendationTrends(symbol);
        return NextResponse.json(recommendations);

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    logger.error(`Failed to fetch ${type} data for ${symbol}`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${type} data` },
      { status: 500 }
    );
  }
}