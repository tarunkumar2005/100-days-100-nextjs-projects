import { NextResponse } from 'next/server';
import { getStockSymbol, getQuoteData } from "@/lib/finnhub";
import { TopMoverStock } from "@/types/app";
import { logger } from '@/lib/logger';

async function fetchAllData(): Promise<{
  gainers: TopMoverStock[],
  losers: TopMoverStock[],
}> {
  try {
    // Get all US stock symbols
    const stockSymbols = await getStockSymbol();

    // Get quotes for first 100 stocks (adjust number based on your needs)
    const quotes = await Promise.all(
      stockSymbols
        .slice(0, 50)
        .map(async (stock) => {
          try {
            const quote = await getQuoteData(stock.symbol);
            return {
              symbol: stock.symbol,
              name: stock.description,
              price: quote.c,
              change: quote.d,
              changePercent: quote.dp
            };
          } catch (error) {
            logger.error(`Failed to get quote for ${stock.symbol}`, error);
            return null;
          }
        })
    );

    // Filter out failed requests and sort by percentage change
    const validQuotes = quotes.filter((quote): quote is TopMoverStock => quote !== null);

    // Separate and sort gainers and losers
    const gainers = validQuotes
      .filter(stock => stock.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 10);

    const losers = validQuotes
      .filter(stock => stock.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 10);

    return {
      gainers,
      losers
    };
  } catch (error) {
    logger.error('Failed to fetch top movers', error);
    return {
      gainers: [],
      losers: []
    };
  }
}

export async function GET() {
  try {
    const topMovers = await fetchAllData();

    return NextResponse.json(topMovers);
  } catch (error) {
    logger.error('Failed to fetch top movers', error);
    return NextResponse.json(
      { error: 'Failed to fetch top movers' },
      { status: 500 }
    );
  }
}