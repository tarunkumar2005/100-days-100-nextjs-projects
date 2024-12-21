"use client"

import { useState, useEffect, useCallback } from "react"
import { ImageCard } from "@/components/image-card"
import { Loader2 } from 'lucide-react'
import type { TrendingImagesProps } from "@/types/unsplash"
import { fetchSearchImages } from "@/lib/Helpers"
import { useSearchParams } from "next/navigation"

export function SearchImages({
  initialSearchResults,
}: {
  initialSearchResults: TrendingImagesProps[]
}) {
  const [images, setImages] = useState(initialSearchResults)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const searchParams = useSearchParams()
  const query = searchParams.get('query') || 'nature'
  const orientation = searchParams.get('orientation') || ''
  const color = searchParams.get('color') || ''

  const loadImages = useCallback(async (reset: boolean = false) => {
    setLoading(true)
    try {
      const newImages = await fetchSearchImages(query, reset ? 1 : page, 8, color, orientation)
      
      if (!newImages || newImages.length === 0) {
        setHasMore(false)
      } else {
        setImages(prev => reset ? newImages : [...prev, ...newImages])
        setPage(prev => reset ? 2 : prev + 1)
      }
    } catch (error) {
      console.error("Failed to load images:", error)
    } finally {
      setLoading(false)
    }
  }, [query, page, color, orientation])

  useEffect(() => {
    loadImages(true) // Reset and load new images when search params change
  }, [query, color, orientation, loadImages])

  const lastImageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (!node) return
  
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadImages()
        }
      })
  
      observer.observe(node)
      return () => observer.disconnect()
    },
    [loading, hasMore, loadImages]
  )

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Searched Images</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <div key={image.id} ref={index === images.length - 1 ? lastImageRef : null}>
            <ImageCard image={image} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!hasMore && (
        <div className="mt-8 text-center text-muted-foreground">
          No more images to load
        </div>
      )}
    </section>
  )
}