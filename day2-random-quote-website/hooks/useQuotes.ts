"use client";

import { useState, useCallback } from 'react';
import { Quote, QuoteState } from '@/lib/types';
import { useToast } from './use-toast';
import axios from 'axios';

const QUOTES_LIMIT = 10;

// Mock quotes generator - Replace this with actual API calls
const generateNewQuote = async (category: string): Promise<Quote> => {
  const response = await axios.get(`/api/getQuote?category=${category}`);
  return response.data;
}

export function useQuotes() {
  const [state, setState] = useState<QuoteState>({
    currentQuote: null,
    remainingQuotes: QUOTES_LIMIT,
    selectedCategory: "random",
    isWaiting: false
  });
  
  const { toast } = useToast();

  const getNewQuote = useCallback((category: string) => {
    if (state.remainingQuotes <= 0) {
      toast({
        title: "Quote limit reached",
        description: "You've reached your limit of 10 quotes. Try again later!",
        variant: "destructive"
      });
      return;
    }

    setState({
      ...state,
      isWaiting: true
    });

    generateNewQuote(category).then(newQuote => {
      setState(prev => ({
        ...prev,
        currentQuote: newQuote,
        remainingQuotes: prev.remainingQuotes - 1,
        selectedCategory: category
      }));
    });
  }, [state.remainingQuotes, toast]);

  const resetQuotes = useCallback(() => {
    setState({
      currentQuote: null,
      remainingQuotes: QUOTES_LIMIT,
      selectedCategory: "random",
      isWaiting: false
    });
    toast({
      title: "Quotes reset",
      description: "You can now get 10 new quotes!"
    });
  }, [toast]);

  return {
    quote: state.currentQuote,
    remainingQuotes: state.remainingQuotes,
    selectedCategory: state.selectedCategory,
    isWaiting: state.isWaiting,
    getNewQuote,
    resetQuotes
  };
}