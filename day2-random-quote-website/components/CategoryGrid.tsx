"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIES } from "@/lib/types";

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
  selectedCategory?: string;
}

export function CategoryGrid({ onSelectCategory, selectedCategory }: CategoryGridProps) {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="h-24 flex flex-col gap-2 capitalize"
            onClick={() => onSelectCategory(category)}
          >
            <span>{category}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}