"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Share2, Download, Bookmark } from "lucide-react";
import { downloadQuote, shareOnTwitter } from "@/lib/utils/quote-actions";
import { Quote } from "@/lib/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface QuoteCardProps {
  quote: Quote;
  onSave?: (quote: Quote) => void;
}

export function QuoteCard({ quote, onSave }: QuoteCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      duration: 2000,
    });
  };

  const handleSave = () => {
    onSave?.(quote);
    toast({
      title: "Quote saved!",
      duration: 2000,
    });
  };

  return (
    <Card className="p-8 backdrop-blur-sm bg-card/50 border-primary/20">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            {quote.category}
          </div>
          <blockquote className="text-2xl md:text-3xl font-serif italic text-center">
            <span>{`"${quote.quote}"`}</span>
          </blockquote>
          <p className="text-center text-muted-foreground">― {quote.author}</p>
        </div>
        <div className="flex justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={isLiked ? "text-red-500" : ""}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => shareOnTwitter({
              text: quote.quote,
              author: quote.author,
            })}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => downloadQuote({
              text: quote.quote,
              author: quote.author,
            })}
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}