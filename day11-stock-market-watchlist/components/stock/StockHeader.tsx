import { ArrowDown, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface StockHeaderProps {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export default function StockHeader({ symbol, name, price, change, changePercent }: StockHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div>
        <h1 className="text-3xl font-bold">{name} ({symbol})</h1>
        <div className="flex items-center mt-2">
          <span className="text-4xl font-bold mr-4">{formatCurrency(price)}</span>
          <span className={`text-lg flex items-center ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change >= 0 ? <ArrowUp className="mr-1 h-5 w-5" /> : <ArrowDown className="mr-1 h-5 w-5" />}
            {formatCurrency(change)} ({changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      <div className="flex space-x-4 mt-4 md:mt-0">
        <Button className="bg-green-600 hover:bg-green-700">Buy</Button>
        <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">Sell</Button>
      </div>
    </div>
  )
}