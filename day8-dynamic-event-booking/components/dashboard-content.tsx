'use client'

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookedEventCard } from "@/components/booked-event-card"
import { getBookings, getUserId } from "@/lib/localStorage"
import { Booking } from "@/types/event"

function fetchUserBookings(): Promise<Booking[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allBookings = getBookings();
      const userBookings = allBookings.filter(booking => booking.userId === getUserId());
      resolve(userBookings);
    }, 1000)
  })
}

export function DashboardContent() {
  const { data: bookings, error, isLoading } = useQuery<Booking[], Error>({
    queryKey: ['bookings', getUserId()],
    queryFn: fetchUserBookings,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!bookings) return <p>No bookings data available</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <BookedEventCard booking={booking} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Event Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Events Booked: {bookings.length}</p>
        </CardContent>
      </Card>
    </div>
  )
}