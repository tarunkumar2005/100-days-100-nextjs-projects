"use client";

import { Quote } from "@/lib/types";
import { QuoteCard } from "./QuoteCard";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface QuoteDisplayProps {
  quote?: Quote | null;
  onReload: () => void;
  remainingQuotes: number;
  onSave?: (quote: Quote) => void;
  isWaiting: boolean;
}

export function QuoteDisplay({ 
  quote, 
  onReload, 
  remainingQuotes,
  onSave,
  isWaiting
}: QuoteDisplayProps) {
  return (
    <div className="space-y-6">
      {quote || !isWaiting ? (
        <>
          <QuoteCard quote={quote ? quote : {
            quote: "Loading...",
            author: "Error",
            category: "error",
            id: "error"
          }} onSave={onSave} />
          <div className="flex items-center justify-between">
            <Button
              onClick={onReload}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              New Quote
            </Button>
            <span className="text-sm text-muted-foreground">
              {remainingQuotes} quotes remaining
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-32">
          {/* Animated loader */}
          <motion.div
            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              ease: "linear",
              repeat: Infinity,
            }}
          ></motion.div>
        </div>
      )}
    </div>
  );
}