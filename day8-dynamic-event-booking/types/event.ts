export interface Event {
  id: string;
  name: string;
  image?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  genre: string;
  subGenre: string;
  currency: string;
  minPrice: number | string;
  maxPrice: number | string;
  description: string;
  pleaseNote?: string | null;
  ticketLimit?: number | string | null;
  url: string;
  seatmap?: string | null;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  eventDetails: Partial<Event>;
  bookingDate: string;
}