import Image from 'next/image'
import Link from 'next/link'
import { Movie } from '@/types/movie'

interface MovieSectionProps {
  title: string;
  movies: Movie[];
}

export function MovieSection({ title, movies }: MovieSectionProps) {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} className="group">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Image
                src={movie.poster_path ? `/api/image-proxy?url=${encodeURIComponent(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)}` : '/placeholder.jpg'}
                alt={movie.title}
                layout="fill"
                objectFit="cover"
                className="transition-opacity duration-300 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold line-clamp-2">{movie.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{new Date(movie.release_date).getFullYear()}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}