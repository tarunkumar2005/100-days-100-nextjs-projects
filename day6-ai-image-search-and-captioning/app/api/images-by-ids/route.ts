import { NextResponse } from "next/server";
import axios from "axios";
import { TrendingImagesProps } from "@/types/unsplash";

const UNSPLASH_API_URL = "https://api.unsplash.com";
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function fetchImagesByIds(ids: string[]): Promise<TrendingImagesProps[]> {
  const isServer = typeof window === 'undefined';
  const url = isServer ? `${UNSPLASH_API_URL}/photos` : '/api/images-by-ids';

  try {
    const response = await axios.get(url, {
      params: {
        ids: ids.join(','),
      },
      ...(isServer && {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }),
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch images by ids:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",") || [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "IDs parameter is required" }, { status: 400 });
  }

  const images = await fetchImagesByIds(ids);
  return NextResponse.json(images);
}