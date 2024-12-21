import { Suspense } from 'react'
import { EventList } from '@/components/event-list'
import { EventListSkeleton } from '@/components/event-list-skeleton'

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Featured Events</h1>
      <Suspense fallback={<EventListSkeleton />}>
        <EventList initialCity="San Francisco, CA" />
      </Suspense>
    </div>
  )
}