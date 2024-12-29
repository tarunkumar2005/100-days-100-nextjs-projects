import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMarketNews } from "@/lib/finnhub"
import Link from 'next/link'

export default async function RecentNews() {
  const news = await getMarketNews();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent News</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {news.slice(0, 50).map((item, index) => (
            <li key={index}>
              <Link href={item.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-muted p-2 rounded-md">
                <h3 className="font-semibold">{item.headline}</h3>
                <p className="text-sm text-muted-foreground">{item.source} - {new Date(item.datetime * 1000).toLocaleDateString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}