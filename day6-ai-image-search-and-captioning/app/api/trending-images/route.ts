import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const UNSPLASH_API_URL = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '10';

  try {
    const response = await axios.get(`${UNSPLASH_API_URL}/photos`, {
      params: {
        order_by: 'popular',
        page,
        per_page: perPage,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching trending images:', error);
    return NextResponse.json({ error: 'Failed to fetch trending images' }, { status: 500 });
  }
}