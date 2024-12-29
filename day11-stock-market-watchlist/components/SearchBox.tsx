"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from '@/hooks/use-debounce';
import { logger } from '@/lib/logger';

interface SearchResult {
  symbol: string;
  name: string;
  description: string;
  displaySymbol: string;
  type: string;
}

export function SearchBox() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${debouncedSearch}`);
        const data = await response.json();
        setResults(data.results.slice(0, 5) || []); // Limit to 5 results
      } catch (error) {
        logger.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [debouncedSearch]);

  const handleSelect = (symbol: string) => {
    setIsOpen(false);
    router.push(`/stock/${symbol}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < results.length) {
      handleSelect(results[selectedIndex].symbol);
    } else {
      router.push(`/search?q=${search}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search stocks..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsOpen(true);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="w-full"
              />
              <Button type="submit" size="icon">
                <SearchIcon className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandList>
                {loading && (
                  <CommandEmpty>Loading...</CommandEmpty>
                )}
                {!loading && results.length === 0 && (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
                <CommandGroup heading="Stocks">
                  {results.map((result, index) => (
                    <CommandItem
                      key={result.symbol}
                      onSelect={() => handleSelect(result.symbol)}
                      className={selectedIndex === index ? 'bg-accent' : ''}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{result.symbol} - {result.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {result.description}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
}