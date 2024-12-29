import MarketOverview from '@/components/MarketOverview'
import TopMovers from '@/components/TopMovers'
import WatchlistPreview from '@/components/WatchlistPreview'
import TradingViewWidget from '@/components/TradingViewWidget'
import MarketIndices from '@/components/MarketIndices'
import RecentNews from '@/components/RecentNews'

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Market Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <MarketOverview />
        </div>
        <div className="md:col-span-2">
          <TradingViewWidget />
        </div>
        <div className="md:row-span-2">
          <TopMovers />
        </div>
        <div>
          <WatchlistPreview />
        </div>
        <div>
          <MarketIndices />
        </div>
        <div className="md:col-span-2">
          <RecentNews />
        </div>
      </div>
    </div>
  )
}