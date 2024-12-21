'use client'

import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { EventCard } from '@/components/event-card'
import { Button } from '@/components/ui/button'
import { useInfiniteEvents } from '@/hooks/useReactQuery'

export function EventList({ initialCity }: { initialCity: string }) {
  const { ref, inView } = useInView()
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteEvents(initialCity);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <>
      {status === 'pending' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <p>Error: {error instanceof Error ? error.message : 'An error occurred'}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.pages.map((page) =>
              page.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
          <div ref={ref} className="mt-8 text-center">
            {isFetchingNextPage ? (
              <p>Loading more...</p>
            ) : hasNextPage ? (
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Load More
              </Button>
            ) : (
              <p>No more events to load</p>
            )}
          </div>
        </>
      )}
    </>
  )
}