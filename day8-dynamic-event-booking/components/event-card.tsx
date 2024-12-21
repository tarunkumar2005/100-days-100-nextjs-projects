import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBookings, getUserId } from "@/lib/localStorage";

type Event = {
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
};

const isEventBooked = (eventId: string) => {
  const bookings = getBookings();
  const userBookings = bookings.filter(
    (booking) => booking.userId === getUserId()
  );
  return userBookings.some((booking) => booking.eventId === eventId);
};

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="overflow-hidden">
      <Image
        src={
          event.image
            ? `/api/image-proxy?url=${encodeURIComponent(event.image)}`
            : "/placeholder.jpg"
        }
        alt={event.name}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <div className="flex items-center justify-between">
        <div>
          <CardTitle className="line-clamp-1">{event.name}</CardTitle>
        </div>
        {isEventBooked(event.id) && (
          <span className="inline-block text-sm bg-green-500 text-white px-2 py-1 rounded-full">
            Booked
          </span>
        )}
        </div>
      </CardHeader>
      <CardContent>
          <p className="text-sm text-gray-500">
            {new Date(`${event.date}T${event.time}`).toLocaleString()}
          </p>
          <p className="text-sm">{event.venue}</p>
          <p className="text-sm mt-2">
            {event.genre} - {event.subGenre}
          </p>
          <p className="text-sm font-semibold mt-2">
            {event.minPrice === event.maxPrice
              ? `${event.currency} ${event.minPrice}`
              : `${event.currency} ${event.minPrice} - ${event.maxPrice}`}
          </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
