"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SavedQuote } from "@/lib/types";
import { QuoteCard } from "./QuoteCard";

interface SavedQuotesProps {
  quotes: SavedQuote[];
}

export function SavedQuotes({ quotes }: SavedQuotesProps) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-6">
        {quotes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No saved quotes yet. Start saving your favorite quotes!
          </div>
        ) : (
          quotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))
        )}
      </div>
    </ScrollArea>
  );
}