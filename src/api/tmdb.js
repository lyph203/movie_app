import { API_BASE_URL, API_OPTIONS } from "../services/config";

// Popular
export const getPopularMovies = async () => {
  const res = await fetch(`${API_BASE_URL}/movie/popular`, API_OPTIONS);
  return res.json();
};

// Detail
export const getMovieDetail = async (id) => {
  const res = await fetch(
    `${API_BASE_URL}/movie/${id}?append_to_response=credits,similar`,
    API_OPTIONS
  );
  return res.json();
};

// Providers
export const getMovieProviders = async (id, country = "US") => {
  const res = await fetch(
    `${API_BASE_URL}/movie/${id}/watch/providers`,
    API_OPTIONS
  );
  const data = await res.json();
  return (
    data.results?.[country]?.flatrate ||
    data.results?.[country]?.buy ||
    data.results?.[country]?.rent ||
    []
  );
};

// Search
export const searchMovies = async (query, sortBy = "popularity.desc") => {
  const endpoint = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&language=en-US&page=1`
    : `${API_BASE_URL}/discover/movie?sort_by=${sortBy}&language=en-US&page=1`;

  const response = await fetch(endpoint, API_OPTIONS);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to fetch movies: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data || [];
};

// Upcoming
export const getUpcomingMovies = async (country = "US") => {
  const res = await fetch(
    `${API_BASE_URL}/movie/upcoming?region=${country}`,
    API_OPTIONS
  );
  return res.json();
};