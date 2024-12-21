"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Download, X, ZoomIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { TrendingImagesProps } from "@/types/unsplash"
import { cn } from "@/lib/utils"

interface ImageCardProps {
  image: TrendingImagesProps
}

export function ImageCard({ image }: ImageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(image.id))
  }, [image.id])

  const proxyUrl = (url: string) => `/api/proxy-image?url=${encodeURIComponent(url)}`

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newFavoriteStatus = !isFavorite
    setIsFavorite(newFavoriteStatus)
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (newFavoriteStatus) {
      favorites.push(image.id)
    } else {
      const index = favorites.indexOf(image.id)
      if (index > -1) {
        favorites.splice(index, 1)
      }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites))

    toast({
      title: newFavoriteStatus ? "Added to favorites" : "Removed from favorites",
      description: `Image ${newFavoriteStatus ? "added to" : "removed from"} your favorites list.`,
    })
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(proxyUrl(image.links.download))
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${image.alt_description || 'image'}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast({
        title: "Download started",
        description: "Your image download has begun.",
      })
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <div>
          <Image
            src={proxyUrl(image.urls.small)}
            alt={image.alt_description}
            width={400}
            height={300}
            className="h-64 w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="mb-2 text-sm font-medium text-white">{image.user.name}</p>
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full",
                  isFavorite && "bg-red-500 text-white hover:bg-red-600"
                )}
                onClick={handleFavorite}
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to favorites</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download image</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{image.alt_description}</DialogTitle>
            <DialogDescription>By {image.user.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={proxyUrl(image.urls.regular)}
                alt={image.alt_description}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full",
                    isFavorite && "bg-red-500 text-white hover:bg-red-600"
                  )}
                  onClick={handleFavorite}
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Add to favorites</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download image</span>
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => window.open(image.links.html, '_blank')}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                View full size
              </Button>
            </div>
            {image.description && (
              <p className="text-sm text-muted-foreground">{image.description}</p>
            )}
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}