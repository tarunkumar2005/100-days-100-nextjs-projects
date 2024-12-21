import { fetchSearchImages } from "@/lib/Helpers";
import { SearchImages } from "@/components/search-images";
import SearchFilters from "@/components/search-filters";

type SearchParams = Promise<{
  query?: string;
  orientation?: string;
  color?: string;
}>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const query = (await searchParams).query || "nature";
  const orientation = (await searchParams).orientation || "";
  const color = (await searchParams).color || "";

  // Fetch initial results server-side
  const initialSearchResults = await fetchSearchImages(query, 1, 12, color, orientation);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Search Images</h1>

      {/* Pass filters to client component */}
      <SearchFilters />

      {/* Child Component for displaying images */}
      <SearchImages initialSearchResults={initialSearchResults} />
    </div>
  );
}