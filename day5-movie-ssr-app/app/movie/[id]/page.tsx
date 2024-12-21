import { Metadata } from 'next'
import Image from 'next/image'
import { getMovieDetails, getMovieCast, getMovieReviews, getSimilarMovies } from '@/lib/tmdb'
import { CastMember, Review } from '@/types/movie'
import { SearchBar } from '@/components/SearchBar'
import { MovieSection } from '@/components/MovieSection'

type Params = Promise<{ id: string }>;

// Next.js requires `params` directly, no promise needed here
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(parseInt(id))
  return {
    title: `${movie.title} - Movie Database`,
    description: movie.overview,
  }
}

function CastSection({ cast }: { cast: CastMember[] }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Cast</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {cast.map((member) => (
          <div key={member.id} className="flex-none w-32">
            <Image
              src={
                member.profile_path
                  ? `/api/image-proxy?url=${encodeURIComponent(`https://image.tmdb.org/t/p/w185${member.profile_path}`)}`
                  : '/placeholder-avatar.jpg'
              }
              alt={member.name}
              width={128}
              height={192}
              className="rounded-lg shadow-lg mb-2"
            />
            <p className="font-semibold text-sm">{member.name}</p>
            <p className="text-sm text-gray-400">{member.character}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewSection({ reviews }: { reviews: Review[] }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 p-4 rounded-lg">
              <p className="font-semibold">{review.author}</p>
              <p className="text-sm text-gray-400 mb-2">{new Date(review.created_at).toLocaleDateString()}</p>
              <p className="text-sm line-clamp-3">{review.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available for this movie.</p>
      )}
    </div>
  )
}

// Ensure params is properly typed to avoid TypeScript errors
export default async function MoviePage({ params }: { params: Params }) {
  const { id } = await params;
  const movieId = parseInt(id);
  const [movie, cast, reviews, similarMovies] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCast(movieId),
    getMovieReviews(movieId),
    getSimilarMovies(movieId),
  ])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-[70vh]">
        <Image
          src={
            movie.backdrop_path
              ? `/api/image-proxy?url=${encodeURIComponent(`https://image.tmdb.org/t/p/original${movie.backdrop_path}`)}`
              : '/placeholder.jpg'
          }
          alt={movie.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        <div className="absolute top-4 left-4 right-4">
          <SearchBar />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Image
              src={
                movie.poster_path
                  ? `/api/image-proxy?url=${encodeURIComponent(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)}`
                  : '/placeholder.jpg'
              }
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 mr-2">★</span>
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <p className="text-lg mb-8">{movie.overview}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Release Date</h2>
                <p>{movie.release_date}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Runtime</h2>
                <p>{movie.runtime} minutes</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Genres</h2>
                <p>{movie.genres.map((genre) => genre.name).join(', ')}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Status</h2>
                <p>{movie.status}</p>
              </div>
            </div>
          </div>
        </div>

        <CastSection cast={cast} />
        <ReviewSection reviews={reviews} />
        <MovieSection title="Similar Movies" movies={similarMovies} />
      </div>
    </div>
  )
}