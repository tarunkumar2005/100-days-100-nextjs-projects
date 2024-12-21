export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export interface MovieDetails extends Movie {
  overview: string;
  backdrop_path: string | null;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
}