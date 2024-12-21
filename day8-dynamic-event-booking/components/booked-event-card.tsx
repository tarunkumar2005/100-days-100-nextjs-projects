import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { Booking } from "@/types/event"

export function BookedEventCard({ booking }: { booking: Booking }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{booking.eventDetails.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-start space-x-4">
        <div className="w-24 h-24 relative flex-shrink-0">
          <Image
            src={booking.eventDetails.image ? `/api/image-proxy?url=${encodeURIComponent(booking.eventDetails.image)}` : '/placeholder.jpg'}
            alt={booking.eventDetails.name || 'Event'}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <div className="flex-grow">
          <p><strong>Date:</strong> {new Date(`${booking.eventDetails.date}T${booking.eventDetails.time}`).toLocaleString()}</p>
          <p><strong>Venue:</strong> {booking.eventDetails.venue}</p>
          <p><strong>Booked on:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
          <Link href={`/events/${booking.eventId}`} className="text-blue-500 hover:underline mt-2 inline-block">
            View Event Details
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}