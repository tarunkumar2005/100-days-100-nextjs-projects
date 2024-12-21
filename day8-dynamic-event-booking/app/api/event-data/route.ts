import { NextResponse } from "next/server";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://app.ticketmaster.com/discovery/v2/`,
  params: {
    apikey: process.env.TICKETMASTER_API_KEY,
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const page = searchParams.get("page") || "0";

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 });
  }

  try {
    const response = await axiosInstance.get("events.json", {
      params: {
        city,
        page,
        size: 20,
      },
    });

    const events = response.data._embedded?.events.map((event: {
      id: string;
      name: string;
      dates: { start: { localDate: string; localTime: string } };
      _embedded: { venues: { name: string }[] };
      images: { url: string }[];
      priceRanges: { min: number; max: number; currency: string }[];
      url: string;
      classifications: { genre: { name: string }; subGenre: { name: string } }[];
    }) => ({
      id: event.id,
      name: event.name,
      date: event.dates.start.localDate,
      time: event.dates.start.localTime,
      venue: event._embedded?.venues?.[0]?.name || "Venue not available",
      image: event.images?.[0]?.url || "/placeholder.jpg",
      minPrice: event.priceRanges?.[0]?.min || "N/A",
      maxPrice: event.priceRanges?.[0]?.max || "N/A",
      currency: event.priceRanges?.[0]?.currency || "USD",
      url: event.url,
      genre: event.classifications?.[0]?.genre?.name || "N/A",
      subGenre: event.classifications?.[0]?.subGenre?.name || "N/A",
    }));

    return NextResponse.json(
      {
        events,
        page: response.data.page || {},
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}