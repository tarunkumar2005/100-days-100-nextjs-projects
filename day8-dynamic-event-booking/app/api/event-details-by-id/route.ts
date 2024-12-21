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
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
  }

  try {
    const response = await axiosInstance.get(`events/${id}`);
    const event = response.data;

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const filteredEvent = {
      id: event.id,
      name: event.name,
      description: event.description || "No description available",
      date: event.dates.start.localDate,
      time: event.dates.start.localTime,
      venue: event._embedded?.venues?.[0]?.name || "Venue not available",
      address: event._embedded?.venues?.[0]?.address?.line1 || "Address not available",
      city: event._embedded?.venues?.[0]?.city?.name || "City not available",
      state: event._embedded?.venues?.[0]?.state?.name || "State not available",
      postalCode: event._embedded?.venues?.[0]?.postalCode || "Postal code not available",
      country: event._embedded?.venues?.[0]?.country?.name || "Country not available",
      image: event.images?.[0]?.url || "/placeholder.jpg",
      minPrice: event.priceRanges?.[0]?.min || "N/A",
      maxPrice: event.priceRanges?.[0]?.max || "N/A",
      currency: event.priceRanges?.[0]?.currency || "USD",
      url: event.url,
      seatmap: event.seatmap?.staticUrl || null,
      pleaseNote: event.pleaseNote || null,
      ticketLimit: event.ticketLimit?.info || null,
      genre: event.classifications?.[0]?.genre?.name || "N/A",
      subGenre: event.classifications?.[0]?.subGenre?.name || "N/A",
    };

    return NextResponse.json({ event: filteredEvent }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}