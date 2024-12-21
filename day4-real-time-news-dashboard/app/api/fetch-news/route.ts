import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getWorkingApiKey } from '@/app/middleware';

interface News {
  id: number;
  title: string;
  text: string;
  summary: string;
  url: string;
  image: string;
  publish_date: string;
  language: string;
  categories: string[];
  source_country: string;
}

interface SearchNewsResponse {
  news: News[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sourceCountry = searchParams.get('sourceCountry') || 'in';
  const language = searchParams.get('language') || 'en';
  const category = searchParams.get('category') || '';

  const apiKey = await getWorkingApiKey();

  if (!apiKey) {
    return NextResponse.json({ error: "No working API key available" }, { status: 503 });
  }

  const params: Record<string, string> = {
    "api-key": apiKey,
    "number": "9",
    "sort": "publish-time",
    "sort-direction": "DESC",
    "source-countries": sourceCountry,
    "language": language,
  };

  if (category) params["categories"] = category;

  try {
    const { data } = await axios.get<SearchNewsResponse>('https://api.worldnewsapi.com/search-news', {
      params,
      timeout: 10000, // Set a timeout to avoid hanging
    });

    return NextResponse.json(data.news, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching news:", error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data || "Failed to fetch news" },
        { status: error.response?.status || 500 }
      );
    } else {
      console.error("Error fetching news:", (error as Error).message);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}