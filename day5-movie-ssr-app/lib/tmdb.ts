import axios from 'axios'
import { Movie, MovieDetails, CastMember, Review } from '@/types/movie'
import { cache } from 'react'

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
  timeout: 5000
})

export const fetchMovies = cache(async (endpoint: string, params = {}): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get(endpoint, { params })
    return response.data.results
  } catch (error) {
    console.error(`Failed to fetch movies from ${endpoint}:`, error)
    return []
  }
})

export const getMovieDetails = cache(async (movieId: number): Promise<MovieDetails> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch details for movie with ID ${movieId}:`, error)
    throw error
  }
})

export const searchMovies = cache(async (query: string): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get('/search/movie', { params: { query } })
    return response.data.results
  } catch (error) {
    console.error(`Failed to fetch movies for query "${query}":`, error)
    return []
  }
})

export const getMovieCast = cache(async (movieId: number): Promise<CastMember[]> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`)
    return response.data.cast.slice(0, 10) // Return top 10 cast members
  } catch (error) {
    console.error(`Failed to fetch cast for movie with ID ${movieId}:`, error)
    return []
  }
})

export const getMovieReviews = cache(async (movieId: number): Promise<Review[]> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/reviews`)
    return response.data.results
  } catch (error) {
    console.error(`Failed to fetch reviews for movie with ID ${movieId}:`, error)
    return []
  }
})

export const getSimilarMovies = cache(async (movieId: number): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`)
    return response.data.results
  } catch (error) {
    console.error(`Failed to fetch similar movies for movie with ID ${movieId}:`, error)
    return []
  }
})