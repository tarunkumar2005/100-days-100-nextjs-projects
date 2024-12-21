"use client";

import { useState, useRef, useCallback } from "react";
import { ImageCard } from "@/components/image-card";
import { Loader2 } from "lucide-react";
import type { TrendingImagesProps } from "@/types/unsplash";
import { fetchTrendingImages } from "@/lib/Helpers";

export function TrendingImages({
  initialTrendingImages,
}: {
  initialTrendingImages: TrendingImagesProps[];
}) {
  const [images, setImages] = useState(initialTrendingImages); // Loaded images
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // If more images are available
  const observer = useRef<IntersectionObserver | null>(null); // IntersectionObserver reference

  // Function to fetch more images
  const loadMoreImages = useCallback(async () => {
    setLoading(true);
    try {
      const nextPage = page + 1; // Increment page
      const newImages = await fetchTrendingImages(nextPage, 8);

      if (newImages.length === 0) {
        setHasMore(false); // Stop if no more images are available
      } else {
        setImages((prevImages) => [...prevImages, ...newImages]); // Append new images
        setPage(nextPage); // Update page number
      }
    } catch (error) {
      console.error("Failed to load more images:", error);
    } finally {
      setLoading(false);
    }
  }, [page]); // Dependencies

  // Callback for the last image element to observe
  const lastImageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return; // Prevent loading if already fetching
      if (observer.current) observer.current.disconnect(); // Disconnect the old observer

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreImages(); // Fetch more images
        }
      });

      if (node) observer.current.observe(node); // Observe the new last image
    },
    [loading, hasMore, loadMoreImages]
  );

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Trending Images</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => {
          // Attach ref to the last image element
          if (index === images.length - 1) {
            return (
              <div key={image.id} ref={lastImageRef}>
                <ImageCard image={image} />
              </div>
            );
          } else {
            return (
              <div key={image.id}>
                <ImageCard image={image} />
              </div>
            );
          }
        })}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* No More Images */}
      {!hasMore && (
        <div className="mt-8 text-center text-muted-foreground">
          No more images to load
        </div>
      )}
    </section>
  );
}
