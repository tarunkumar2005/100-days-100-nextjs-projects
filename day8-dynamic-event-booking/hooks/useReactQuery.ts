import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  minPrice: string;
  maxPrice: string;
  currency: string;
  genre: string;
  subGenre: string;
  url: string;
}

interface FetchEventsResponse {
  events: Event[];
  page: {
    number: number;
    totalPages: number;
  };
}

interface EventDetails extends Event {
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  seatmap: string | null;
  pleaseNote: string | null;
  ticketLimit: string | null;
}

const fetchEvents = async (city: string, page: number = 0): Promise<FetchEventsResponse> => {
  const response = await fetch(`/api/event-data?city=${city}&page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return await response.json();
}

export const useEvents = (city: string) => {
  return useQuery({
    queryKey: ["events", city],
    queryFn: () => fetchEvents(city),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useInfiniteEvents = (city: string) => {
  return useInfiniteQuery({
    queryKey: ["events", city],
    queryFn: ({ pageParam = 0 }) => fetchEvents(city, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page.number < lastPage.page.totalPages - 1) {
        return lastPage.page.number + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

async function fetchEventDetails(id: string): Promise<EventDetails> {
  const response = await fetch(`/api/event-details-by-id?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch event details');
  }
  const data = await response.json();
  return data.event;
}

export const useEventDetails = (id: string) => {
  return useQuery({
    queryKey: ['eventDetails', id],
    queryFn: () => fetchEventDetails(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}