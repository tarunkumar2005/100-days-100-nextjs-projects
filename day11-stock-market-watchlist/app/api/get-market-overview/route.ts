import { NextResponse } from 'next/server';
import { getStockSymbol, getQuoteData } from "@/lib/finnhub";
import { MarketData } from "@/types/app";
import { logger } from "@/lib/logger";

// Major market indices
const MAJOR_STOCKS = ['^GSPC', '^DJI', '^IXIC'];

async function fetchMarketData(): Promise<MarketData> {
  try {
    // Get quotes for major indices first
    const majorStockQuotes = await Promise.all(
      MAJOR_STOCKS.map(async (symbol) => {
        try {
          const quote = await getQuoteData(symbol);
          return { symbol, quote };
        } catch (error) {
          logger.error(`Failed to fetch quote for ${symbol}`, error);
          return null;
        }
      })
    );

    // Get other stock symbols
    const allStockSymbols = await getStockSymbol();
    const activeStocks = allStockSymbols
      .filter(stock => stock.type === 'Common Stock')
      .slice(0, 50);

    // Get quotes for active stocks
    const activeStockQuotes = await Promise.all(
      activeStocks.map(async (stock) => {
        try {
          const quote = await getQuoteData(stock.symbol);
          return { symbol: stock.symbol, quote };
        } catch (error) {
          logger.error(`Failed to fetch quote for ${stock.symbol}`, error);
          return null;
        }
      })
    );

    // Filter out failed requests and null values
    const validQuotes = [...majorStockQuotes, ...activeStockQuotes]
    .filter(q => 
      q && q.quote && 
      q.quote.dp !== null && 
      q.quote.dp !== undefined && 
      q.quote.c > 0
    );

    // Calculate market metrics
    const metrics = {
      // Overall sentiment based on major indices
      overallSentiment: validQuotes.reduce((acc, item) => acc + item!.quote.dp, 0) / validQuotes.length,

      tradingVolume: validQuotes.reduce((acc, item) => acc + (item!.quote.t || 0), 0),
      volumeChange: validQuotes.reduce((acc, item) => {
        const current = item!.quote.t || 0;
        const previous = item!.quote.t ? item!.quote.t * 0.9 : 0;
        return acc + ((current - previous) / (previous || 1));
      }, 0) / validQuotes.length * 100,
      totalMarketCap: validQuotes.reduce((acc, item) =>
        acc + ((item?.quote?.c || 0) * (item?.quote?.t || 1)), 0),
      marketCapChange: validQuotes.reduce((acc, item) => {
        const current = (item?.quote?.c || 0) * (item?.quote?.t || 1);
        const previous = (item?.quote?.pc || 0) * (item?.quote?.t || 1);
        return acc + ((current - previous) / (previous || 1)) * 100;
      }, 0) / validQuotes.length,
    };

    // Validate metrics
    const cleanMetrics = {
      overallSentiment: Number.isFinite(metrics.overallSentiment) ? metrics.overallSentiment : 0,
      tradingVolume: Number.isFinite(metrics.tradingVolume) ? metrics.tradingVolume : 0,
      volumeChange: Number.isFinite(metrics.volumeChange) ? metrics.volumeChange : 0,
      totalMarketCap: Number.isFinite(metrics.totalMarketCap) ? metrics.totalMarketCap : 0,
      marketCapChange: Number.isFinite(metrics.marketCapChange) ? metrics.marketCapChange : 0,
    };

    return cleanMetrics;

  } catch (error) {
    throw error;
  }
}

export async function GET() {
  try {
    const marketData = await fetchMarketData();
    
    // Additional validation
    if (!marketData || Object.values(marketData).every(v => v === 0)) {
      throw new Error('Failed to calculate valid market metrics');
    }
    
    return NextResponse.json(marketData);
  } catch (error) {
    logger.error('Failed to fetch market data', error);
    // Return fallback data
    return NextResponse.json({
      overallSentiment: 0,
      tradingVolume: 0,
      volumeChange: 0,
      totalMarketCap: 0,
      marketCapChange: 0,
    }, { status: 500 });
  }
}