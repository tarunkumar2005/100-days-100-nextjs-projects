import Link from "next/link";
import { TrendingImages } from "@/components/trending-images";
import { fetchTrendingImages } from "@/lib/Helpers";
import SearchBar from "@/components/search-bar";

export default async function Home() {
  const [trendingImages] = await Promise.all([fetchTrendingImages(1, 8)]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Discover Stunning <span className="text-primary">AI-Powered</span> Images
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Search, save, and organize images with AI-generated captions
        </p>
        {/* Client Component for Search */}
        <SearchBar />
      </section>
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Popular Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {["Nature", "Travel", "Food", "Architecture", "Animals", "Technology"].map((category) => (
            <Link
              key={category}
              href={`/search?query=${category.toLowerCase()}`}
              className="flex h-24 items-center justify-center rounded-lg bg-muted p-4 text-center font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>
      <TrendingImages initialTrendingImages={trendingImages} />
    </div>
  );
}