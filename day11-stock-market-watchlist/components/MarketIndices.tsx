import { MarketIndex } from "@/types/app";
import MarketIndicesClient from "./MarketIndicesClient";
import { fetchMarketIndices } from "@/lib/finnhub";

export default async function MarketIndices() {
  const response = await fetchMarketIndices();
  const marketIndices: MarketIndex[] = response;

  return <MarketIndicesClient initialData={marketIndices} />;
}