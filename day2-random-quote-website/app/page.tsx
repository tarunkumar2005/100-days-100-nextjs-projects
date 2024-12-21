"use client";

import { useEffect, useState } from "react";
import { SavedQuote } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SavedQuotes } from "@/components/SavedQuotes";
import { QuoteDisplay } from "@/components/QuoteDisplay";
import { useQuotes } from "@/hooks/useQuotes";
import { Sword } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Quote } from "@/lib/types";

export default function Home() {
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const { 
    quote, 
    remainingQuotes, 
    getNewQuote, 
    selectedCategory,
    isWaiting
  } = useQuotes();

  useEffect(() => {
    if (quote === null) {
      getNewQuote("random");
    }
  }, [quote, getNewQuote]);

  const handleSaveQuote = (quote: Quote) => {
    setSavedQuotes((prev) => {
      const savedQuote: SavedQuote = {
        ...quote,
        savedAt: new Date().toISOString(),
      };
      return [...prev, savedQuote];
    });
  };

  const handleCategorySelect = (category: string) => {
    getNewQuote(category);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center mb-6">
            <Sword className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            NinjaQuotes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Swift wisdom for the modern warrior. Discover, collect, and share
            powerful quotes that inspire and enlighten.
          </p>
        </div>

        {/* Main Quote Display */}
        <div className="max-w-4xl mx-auto mb-16">
          <QuoteDisplay
            quote={quote}
            onReload={() => selectedCategory && getNewQuote(selectedCategory)}
            remainingQuotes={remainingQuotes}
            onSave={handleSaveQuote}
            isWaiting={isWaiting}
          />
        </div>

        {/* Categories and Saved Quotes */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="categories">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="saved">Saved Quotes</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
              <CategoryGrid
                onSelectCategory={handleCategorySelect}
                selectedCategory={selectedCategory || undefined}
              />
            </TabsContent>
            <TabsContent value="saved">
              <SavedQuotes quotes={savedQuotes} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </main>
  );
}