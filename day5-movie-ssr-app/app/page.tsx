import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Carousel } from '@/components/Carousel'
import { MovieSection } from '@/components/MovieSection'
import { SearchBar } from '@/components/SearchBar'
import { fetchMovies, getMovieDetails } from '@/lib/tmdb'

export const metadata: Metadata = {
  title: 'Movie App - Tarun Kumar',
  description: 'Explore the latest movies and TV shows',
}

export default async function Home() {
  const [trendingMovies, actionMovies, comedyMovies, dramaMovies] = await Promise.all([
    fetchMovies('/trending/movie/week'),
    fetchMovies('/discover/movie', { with_genres: 28 }), // Action
    fetchMovies('/discover/movie', { with_genres: 35 }), // Comedy
    fetchMovies('/discover/movie', { with_genres: 18 }), // Drama
  ]);

  const carouselMovies = await Promise.all(trendingMovies.slice(0, 5).map(movie => getMovieDetails(movie.id)));

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent p-4">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Movie Database Logo" width={100} height={50} />
          </Link>
          <SearchBar />
        </nav>
      </header>

      <Carousel movies={carouselMovies} />

      <div className="container mx-auto px-4 py-12 space-y-16">
        <MovieSection title="Trending Now" movies={trendingMovies} />
        <MovieSection title="Action Movies" movies={actionMovies} />
        <MovieSection title="Comedy Movies" movies={comedyMovies} />
        <MovieSection title="Drama Movies" movies={dramaMovies} />
      </div>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <p className="text-center">&copy; 2023 Movie Database. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}