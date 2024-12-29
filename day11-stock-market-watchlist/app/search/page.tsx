import { CardTitle, Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { search } from '@/lib/finnhub';

async function getSearchResults(query: string) {
  return await search(query);
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q: query } = await searchParams;
  const results = await getSearchResults(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for &quot;{query}&quot;</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((stock) => (
          <Card key={stock.symbol}>
            <CardHeader>
              <CardTitle>{stock.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href={`/stock/${stock.symbol}`} 
                className="block hover:bg-muted p-2 rounded transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{stock.symbol}</span>
                  <span className="text-sm text-muted-foreground">{stock.type}</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}