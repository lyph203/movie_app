import { useEffect, useState } from "react";
import { getMovieDetail, getMovieProviders } from "../../../api/tmdb";
import { API_BASE_URL, API_OPTIONS } from "../../../services/config";

export const useMovieDetail = (id, country = "US") => {
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 🎬 Fetch detail
        const detail = await getMovieDetail(id);
        setMovie(detail);

        // 📺 Fetch providers
        const provs = await getMovieProviders(id, country);
        setProviders(provs);

        // 🎥 Fetch videos (to get trailer)
        const res = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
        if (res.ok) {
          const data = await res.json();
          const trailer = data.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );
          setTrailerKey(trailer?.key || null);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch movie detail");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, country]);

  return { movie, providers, trailerKey, isLoading, error };
};
