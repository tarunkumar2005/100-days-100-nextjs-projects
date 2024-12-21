'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MovieDetails } from '@/types/movie'

interface CarouselProps {
  movies: MovieDetails[];
}

export function Carousel({ movies }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [movies.length])

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={movie.backdrop_path ? `/api/image-proxy?url=${encodeURIComponent(`https://image.tmdb.org/t/p/original${movie.backdrop_path}`)}` : '/placeholder.jpg'}
            alt={movie.title}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
            <h2 className="text-5xl font-bold mb-4">{movie.title}</h2>
            <p className="text-xl mb-6 line-clamp-3">{movie.overview}</p>
            <Link href={`/movie/${movie.id}`} className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
              Watch Now
            </Link>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-red-600' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}