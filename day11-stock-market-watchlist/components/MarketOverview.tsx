import { MarketData } from "@/types/app";
import MarketOverviewClient from "./MarketOverviewClient";
import { fetchMarketData } from "@/lib/finnhub";

export default async function MarketOverview() {
  const response = await fetchMarketData();
  const marketData: MarketData = response;

  return (
    <MarketOverviewClient initialData={marketData} />
  )
}