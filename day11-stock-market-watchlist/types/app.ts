export type GetMarketNewsResponse = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related?: string;
  source: string;
  summary: string;
  url: string;
}

export type GetStockSymbolResponse = {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
}

export type QuoteData = {
  c: number;    // Current price
  d: number;    // Change
  dp: number;   // Percent change
  h: number;    // High price of the day
  l: number;    // Low price of the day
  o: number;    // Open price of the day
  pc: number;   // Previous close price
  t: number;    // Timestamp
}

export interface MarketData {
  overallSentiment: number;
  tradingVolume: number;
  volumeChange: number;
  totalMarketCap: number;
  marketCapChange: number;
}

export interface TopMoverStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  date: string;
}

export interface SearchResponse {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export interface CompanyNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related?: string;
  source: string;
  summary: string;
  url: string;
}

export interface StockRecommendation {
  buy: number;
  hold: number;
  period: string;
  sell: number;
  strongBuy: number;
  strongSell: number;
  symbol: string;
}