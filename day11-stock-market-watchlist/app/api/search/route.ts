import { NextResponse } from 'next/server';
import { search } from '@/lib/finnhub';
import { SearchResponse } from '@/types/app';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || ''; 

    if (!query) {
      return NextResponse.json({ results: [] });
    }
    try {
      const response = await search(query);

      const results = response.map((item: SearchResponse) => ({
        symbol: item.symbol,
        name: item.description,
        description: item.description,
        displaySymbol: item.displaySymbol,
        type: item.type
      }));

      return NextResponse.json({ results })
    } catch (error) {
      logger.error('Failed to search', error);
      return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
    }
}