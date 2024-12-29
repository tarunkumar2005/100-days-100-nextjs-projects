import { NewsItem } from "@/types/app";
import RecentNewsClient from "./RecentNewsClient";
import { getMarketNews } from "@/lib/finnhub";

export default async function MarketOverview() {
  const response = await getMarketNews();
  const processedNews = response
  .slice(0, 10)
  .map(item => ({
    title: item.headline,
    source: item.source,
    url: item.url,
    date: new Date(item.datetime * 1000).toLocaleDateString(),
  }));
  const newsData: NewsItem[] = processedNews;

  return (
    <RecentNewsClient initialNews={newsData} />
  )
}