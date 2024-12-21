export interface Quote {
  quote: string;
  author: string;
  category: string;
  id: string;
}

export interface SavedQuote extends Quote {
  savedAt: string;
}

export interface QuoteState {
  currentQuote: Quote | null;
  remainingQuotes: number;
  selectedCategory: string | null;
  isWaiting: boolean;
}

export const CATEGORIES = [
  'age', 'alone', 'amazing', 'anger', 'architecture', 'art', 'attitude', 'beauty',
  'best', 'birthday', 'business', 'car', 'change', 'communication', 'computers',
  'cool', 'courage', 'dad', 'dating', 'death', 'design', 'dreams', 'education',
  'environmental', 'equality', 'experience', 'failure', 'faith', 'family',
  'famous', 'fear', 'fitness', 'food', 'forgiveness', 'freedom', 'friendship',
  'funny', 'future', 'god', 'good', 'government', 'graduation', 'great',
  'happiness', 'health', 'history', 'home', 'hope', 'humor', 'imagination',
  'inspirational', 'intelligence', 'jealousy', 'knowledge', 'leadership',
  'learning', 'legal', 'life', 'love', 'marriage', 'medical', 'men', 'mom',
  'money', 'morning', 'movies', 'success', 'random'
];