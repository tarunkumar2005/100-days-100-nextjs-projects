import axios from 'axios';
import { TrendingImagesProps } from '@/types/unsplash';

const UNSPLASH_API_URL = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function fetchTrendingImages(page: number = 1, perPage: number = 8): Promise<TrendingImagesProps[]> {
  const isServer = typeof window === 'undefined';
  const url = isServer ? `${UNSPLASH_API_URL}/photos` : '/api/trending-images';

  try {
    const response = await axios.get(url, {
      params: {
        order_by: 'popular',
        page,
        per_page: perPage,
      },
      ...(isServer && {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }),
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending images:', error);
    return [];
  }
}

export async function fetchSearchImages(query: string = "nature", page: number = 1, perPage: number = 8, color?: string, orientation?: string): Promise<TrendingImagesProps[]> {
  const isServer = typeof window === 'undefined';
  const url = isServer ? `${UNSPLASH_API_URL}/search/photos` : '/api/search-images';

  try {
    const response = await axios.get(url, {
      params: {
        query,
        order_by: 'relevant',
        page,
        per_page: perPage,
        ...(color && { color }),
        ...(orientation && { orientation }),
      },
      ...(isServer && {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }),
    });

    return response.data.results;
  } catch (error) {
    console.error('Failed to fetch trending images:', error);
    return [];
  }
}

export async function fetchImagesByIds(ids: string[]): Promise<TrendingImagesProps[]> {
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