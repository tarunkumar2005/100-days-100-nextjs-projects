import { NextResponse } from 'next/server';
import { getQuoteData } from "@/lib/finnhub";
import { MarketIndex } from "@/types/app";

// Updated symbols for market indices
const MARKET_INDICES = [
  { name: "S&P 500", symbol: "SPY" },    // S&P 500 ETF
  { name: "Dow Jones", symbol: "DIA" },   // Dow Jones ETF
  { name: "Nasdaq", symbol: "QQQ" },      // Nasdaq ETF
  { name: "Russell 2000", symbol: "IWM" }, // Russell 2000 ETF
];

async function fetchMarketIndices(): Promise<MarketIndex[]> {
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

export async function GET() {
  try {
    const indices = await fetchMarketIndices();
    return NextResponse.json(indices);
  } catch (error) {
    return NextResponse.json(
      { error: error || 'Failed to fetch market indices' },
      { status: 500 }
    );
  }
}