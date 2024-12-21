import { Skeleton } from '@/components/ui/skeleton'

export function EventDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  )
}