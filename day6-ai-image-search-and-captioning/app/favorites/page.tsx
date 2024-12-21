"use client"

import { useState, useEffect } from 'react'
import { ImageCard } from '@/components/image-card'
import { TrendingImagesProps } from '@/types/unsplash'
import { fetchImagesByIds } from '@/lib/Helpers'
import { Loader2 } from 'lucide-react'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<TrendingImagesProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      try {
        const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]')
        if (favoriteIds.length === 0) {
          setFavorites([])
          setLoading(false)
          return
        }

        const favoriteImages = await fetchImagesByIds(favoriteIds)
        setFavorites(favoriteImages)
      } catch (err) {
        console.error('Error fetching favorites:', err)
        setError('Failed to load favorites. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Your Favorites</h1>
        <p className="text-center text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-muted-foreground">You haven&apos;t added any favorites yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      )}
    </div>
  )
}