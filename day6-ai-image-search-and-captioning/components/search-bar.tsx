"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(debouncedSearchQuery.trim())}`);
    }
  }, [debouncedSearchQuery, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto flex max-w-lg flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
    >
      <Input
        type="search"
        placeholder="Search for images..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      <Button type="submit" size="lg">
        Search
      </Button>
    </form>
  );
}