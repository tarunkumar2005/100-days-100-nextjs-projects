import { Metadata } from "next";
import { MovieSection } from "@/components/MovieSection";
import { searchMovies } from "@/lib/tmdb";
import { SearchBar } from "@/components/SearchBar";

type SearchPageProps = Promise<{ q ?: string }>;

// Generating metadata for search results
export async function generateMetadata({ searchParams }: { searchParams : SearchPageProps }): Promise<Metadata> {
  const query = (await searchParams).q;
  return {
    title: `Search results for "${query}" - Movie Database`,
  };
}

// Search results page component
export default async function SearchResults({ searchParams }: { searchParams: SearchPageProps }) {
  const query = await (await searchParams).q;

  // Return search UI when no query is provided
  if (!query) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Search Movies</h1>
        <SearchBar />
      </div>
    );
  }

  // Fetch movies based on the query
  const movies = await searchMovies(query);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for &quot;{query}&quot;
      </h1>
      <SearchBar initialQuery={query} />
      {movies.length > 0 ? (
        <MovieSection title="Results" movies={movies} />
      ) : (
        <p className="text-xl mt-8">
          No movies found for &quot;{query}&quot;. Try another search term.
        </p>
      )}
    </div>
  );
}