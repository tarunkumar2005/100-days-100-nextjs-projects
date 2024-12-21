"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedOrientation, setSelectedOrientation] = useState(searchParams.get('orientation') || 'all');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || 'all');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearchQuery) params.set("query", debouncedSearchQuery);
    if (selectedOrientation && selectedOrientation !== "all") params.set("orientation", selectedOrientation);
    if (selectedColor && selectedColor !== "all") params.set("color", selectedColor);

    router.push(`/search?${params.toString()}`);
  }, [debouncedSearchQuery, selectedOrientation, selectedColor, router, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The form submission is now handled by the useEffect hook
  };

  return (
    <form className="mb-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          type="search"
          placeholder="Search for images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />

        <Select value={selectedOrientation} onValueChange={setSelectedOrientation}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Orientation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orientations</SelectItem>
            <SelectItem value="landscape">Landscape</SelectItem>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="squarish">Squarish</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            <SelectItem value="black_and_white">Black & White</SelectItem>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
            <SelectItem value="yellow">Yellow</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="blue">Blue</SelectItem>
            <SelectItem value="purple">Purple</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}