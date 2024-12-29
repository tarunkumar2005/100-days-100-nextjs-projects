import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import StockHeader from '@/components/stock/StockHeader';
import StockDetails from '@/components/stock/StockDetails';
import StockNews from '@/components/stock/StockNews';
import RecommendationTrends from '@/components/stock/RecommendationTrends';
import StockChart from '@/components/stock/StockChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStockQuote, getCompanyProfile } from '@/lib/finnhub';
import WatchlistButton from '@/components/WatchlistButton';
import { logger } from '@/lib/logger';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;

  try {
    const [quote, profile] = await Promise.all([
      getStockQuote(symbol),
      getCompanyProfile(symbol),
    ]);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <StockHeader
            symbol={symbol}
            name={profile.name}
            price={quote.c}
            change={quote.d}
            changePercent={quote.dp}
          />
          <WatchlistButton
            symbol={symbol}
            name={profile.name}
            price={quote.c}
            change={quote.dp}
            changePercent={quote.dp}
          />
        </div>
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Suspense fallback={<div>Loading details...</div>}>
                <StockDetails symbol={symbol} />
              </Suspense>
              <Suspense fallback={<div>Loading recommendation trends...</div>}>
                <RecommendationTrends symbol={symbol} />
              </Suspense>
            </div>
          </TabsContent>
          <TabsContent value="chart">
            <Suspense fallback={<div>Loading chart...</div>}>
              <StockChart symbol={symbol} />
            </Suspense>
          </TabsContent>
          <TabsContent value="news">
            <Suspense fallback={<div>Loading news...</div>}>
              <StockNews symbol={symbol} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    logger.error(error);
    notFound();
  }
}