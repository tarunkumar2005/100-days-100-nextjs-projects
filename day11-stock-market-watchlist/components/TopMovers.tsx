import { TopMoverStock } from "@/types/app";
import TopMoversClient from "./TopMoversClient";
import { fetchAllData } from "@/lib/finnhub";

interface TopMoversData {
  gainers: TopMoverStock[];
  losers: TopMoverStock[];
}

export default async function TopMovers() {
  const response = await fetchAllData();
  const topMovers: TopMoversData = response;

  return (
    <TopMoversClient initialData={topMovers} />
  )
}