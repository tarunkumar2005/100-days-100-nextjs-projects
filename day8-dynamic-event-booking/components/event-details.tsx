'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { addBooking, getBookings, getUserId } from '@/lib/localStorage'
import { useEventDetails } from '@/hooks/useReactQuery'
import { EventDetailsSkeleton } from './event-details-skeleton'
import { Event, Booking } from "@/types/event"

interface EventDetailsProps {
  eventId: string
}

async function bookEvent(eventId: string, userId: string, eventDetails: Partial<Event>): Promise<Booking> {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API delay
  const booking: Booking = {
    id: `booking_${Math.random().toString(36).substr(2, 9)}`,
    eventId,
    userId,
    eventDetails,
    bookingDate: new Date().toISOString(),
  }
  addBooking(booking)
  return booking
}

export function EventDetails({ eventId }: EventDetailsProps) {
  const [isBooking, setIsBooking] = useState(false)
  const [isBooked, setIsBooked] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data: event, error, isLoading } = useEventDetails(eventId)

  useEffect(() => {
    const checkBookingStatus = () => {
      const bookings = getBookings()
      const userBookings = bookings.filter(booking => booking.userId === getUserId())
      const hasBooked = userBookings.some(booking => booking.eventId === eventId)
      setIsBooked(hasBooked)
    }
    checkBookingStatus()
  }, [eventId])

  const bookingMutation = useMutation({
    mutationFn: () => {
      if (!event) throw new Error("Event details are not available");
      return bookEvent(eventId, getUserId(), event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast({
        title: "Event Booked!",
        description: "You have successfully booked this event.",
      })
      setIsBooked(true)
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "An error occurred while booking the event.",
        variant: "destructive",
      })
    },
    onSettled: () => setIsBooking(false),
  })

  const handleBooking = () => {
    if (isBooked) {
      toast({
        title: "Already Booked",
        description: "You have already booked this event.",
        variant: "default",
      })
      return
    }
    setIsBooking(true)
    bookingMutation.mutate()
  }

  if (isLoading) return <EventDetailsSkeleton />
  if (error) return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>
  if (!event) return <div>No event found</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        {event.name}
        {isBooked && (
          <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">
            Booked
          </span>
        )}
      </h1>
      <div className="aspect-video relative overflow-hidden rounded-lg">
        <Image
          src={event.image ? `/api/image-proxy?url=${encodeURIComponent(event.image)}` : '/placeholder.jpg'}
          alt={event.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-2">Event Details</h2>
          <p><strong>Date:</strong> {new Date(`${event.date}T${event.time}`).toLocaleString()}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Address:</strong> {event.address}, {event.city}, {event.state} {event.postalCode}</p>
          <p><strong>Genre:</strong> {event.genre} - {event.subGenre}</p>
          <p><strong>Price Range:</strong> {event.currency} {event.minPrice} - {event.maxPrice}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p>{event.description}</p>
          {event.pleaseNote && (
            <div className="mt-4">
              <h3 className="font-semibold">Please Note:</h3>
              <p>{event.pleaseNote}</p>
            </div>
          )}
          {event.ticketLimit && (
            <div className="mt-4">
              <h3 className="font-semibold">Ticket Limit:</h3>
              <p>{event.ticketLimit}</p>
            </div>
          )}
        </div>
      </div>
      {event.seatmap && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Seating Chart</h2>
          <Image 
            src={event.seatmap ? `/api/image-proxy?url=${encodeURIComponent(event.seatmap)}` : '/placeholder.jpg'}
            alt="Seating Chart" 
            width={600} 
            height={400} 
            className="rounded-lg" 
          />
        </div>
      )}
      <div className="flex space-x-4">
        {isBooked ? (
          <Button disabled className="bg-green-500 hover:bg-green-600">
            Booked
          </Button>
        ) : (
          <Button onClick={handleBooking} disabled={isBooking}>
            {isBooking ? 'Booking...' : 'Book Now'}
          </Button>
        )}
        <Button variant="outline" asChild>
          <a href={event.url} target="_blank" rel="noopener noreferrer">View on Ticketmaster</a>
        </Button>
      </div>
    </div>
  )
}