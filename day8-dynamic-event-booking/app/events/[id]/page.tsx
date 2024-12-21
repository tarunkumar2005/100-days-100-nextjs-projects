import { Suspense } from 'react'
import { EventDetails } from '@/components/event-details'
import { EventDetailsSkeleton } from '@/components/event-details-skeleton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventDetailsPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<EventDetailsSkeleton />}>
        <EventDetails eventId={id} />
      </Suspense>
    </div>
  )
}