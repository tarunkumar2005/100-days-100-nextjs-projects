import { NextResponse } from "next/server";
import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com";
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Fetch search results from Unsplash
async function fetchSearchImages(query: string = "nature", page: number = 1, perPage: number = 10, color?: string, orientation?: string) {
  try {
    if (!query) throw new Error("Query parameter is required");

    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
      params: { query, page, per_page: perPage, ...(color && { color }), ...(orientation && { orientation }) },
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });

    return response.data; // Unsplash returns search results in "results"
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch search results:", error.message);
    } else {
      console.error("Failed to fetch search results:", error);
    }
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || searchParams.get("category") || "nature"; // Default query
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "8");
  const color = searchParams.get("color") || undefined;
  const orientation = searchParams.get("orientation") || undefined;

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  const images = await fetchSearchImages(query, page, perPage, color, orientation);
  return NextResponse.json(images);
}