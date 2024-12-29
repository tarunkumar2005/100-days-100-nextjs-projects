import axios, { AxiosError, AxiosInstance } from 'axios';
import { GetMarketNewsResponse, GetStockSymbolResponse, QuoteData, SearchResponse, CompanyProfile, CompanyNews, StockRecommendation, MarketIndex, MarketData, TopMoverStock } from '@/types/app';
import { cache } from 'react';
import apiKeyManager from './apikeyManager';
import { logger } from '@/lib/logger';

const BASE_URL = 'https://finnhub.io/api/v1';

async function createAxiosInstance() {
  const apiKey = apiKeyManager.getNextAvailableKey();

  if (!apiKey) {
    throw new Error('No API keys available. Please try again later.');
  }

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'X-Finnhub-Token': apiKey
    },
  })
}

async function makeRequest<T>(requestFn: (api: typeof axios | AxiosInstance) => Promise<T>): Promise<T> {
  try {
    const api = await createAxiosInstance();
    const response = await requestFn(api);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 429) {
      // Rate limit reached, block the current key
      const currentKey = error.config?.headers?.['X-Finnhub-Token'];
      if (currentKey) {
        apiKeyManager.blockKey(currentKey as string);
      }
      
      // Retry with a different key
      const api = await createAxiosInstance();
      return await requestFn(api);
    }
    if (error instanceof AxiosError && error.response?.status === 403) {
      throw error;
    }
    throw error;
  }
}

export const getMarketNews = cache(async (): Promise<GetMarketNewsResponse[]> => {
  try {
    const response = await makeRequest(api => 
      api.get('/news?category=general')
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch market news', error);
    return [];
  }
})

export const getStockSymbol = cache(async (): Promise<GetStockSymbolResponse[]> => {
  try {
    const response = await makeRequest(api =>
      api.get('/stock/symbol?exchange=US')
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch stock symbols', error);
    return [];
  }
})

export const getQuoteData = cache(async (symbol: string): Promise<QuoteData> => {
  try {
    const response = await makeRequest(api => 
      api.get(`/quote?symbol=${symbol}`)
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch stock quote data', error);
    throw error;
  }
});

export const search = cache(async (query: string): Promise<SearchResponse[]> => {
  try {
    const response = await makeRequest(api => 
      api.get(`/search?q=${query}`)
    )
    return response.data.result; // Change this line
  } catch (error) {
    logger.error('Failed to search for stock symbols', error);
    return [];
  }
})

export const getStockQuote = cache(async (symbol: string): Promise<QuoteData> => {
  try {
    const response = await makeRequest(api => 
      api.get(`/quote?symbol=${symbol}`)
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch stock quote data', error);
    throw error;
  }
})

export const getCompanyProfile = cache(async (symbol: string): Promise<CompanyProfile> => {
  try {
    const response = await makeRequest(api => 
      api.get(`/stock/profile2?symbol=${symbol}`)
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch company profile', error);
    throw error;
  }
})

export const getCompanyNews = cache(async (symbol: string, from: string, to: string): Promise<CompanyNews[]> => {
  try {
    const response = await makeRequest(api => 
      api.get(`/company-news?symbol=${symbol}&from=${from}&to=${to}`)
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch company news', error);
    return [];
  }
})

export const getRecommendationTrends = cache(async (symbol: string): Promise<StockRecommendation[]> => {
  try {
    const response = await makeRequest(api => 
      api.get(`/stock/recommendation?symbol=${symbol}`)
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch recommendation trends', error);
    return [];
  }
})

// Updated symbols for market indices
const MARKET_INDICES = [
  { name: "S&P 500", symbol: "SPY" },    // S&P 500 ETF
  { name: "Dow Jones", symbol: "DIA" },   // Dow Jones ETF
  { name: "Nasdaq", symbol: "QQQ" },      // Nasdaq ETF
  { name: "Russell 2000", symbol: "IWM" }, // Russell 2000 ETF
];

export async function fetchMarketIndices(): Promise<MarketIndex[]> {
  try {
    // Fetch all quotes in parallel
    const quotes = await Promise.all(
      MARKET_INDICES.map(async (index) => {
        const quote = await getQuoteData(index.symbol);
        return {
          name: index.name,
          symbol: index.symbol,
          value: quote.c || 0, // Add fallback value
          change: quote.dp || 0, // Add fallback value
        };
      })
    );

    return quotes;
  } catch (error) {
    throw error;
  }
}

// Major market indices
const MAJOR_STOCKS = ['^GSPC', '^DJI', '^IXIC'];

export async function fetchMarketData(): Promise<MarketData> {
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

export async function fetchAllData(): Promise<{
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