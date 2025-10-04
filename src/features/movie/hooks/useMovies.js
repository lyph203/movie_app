import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { searchMovies } from "../../../api/tmdb";
import { updateSearchCount } from "../../../services/appwrite";

export const useMovies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  useDebounce(() => setDebouncedSearch(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await searchMovies(debouncedSearch, sortBy);
        if (!data.results || data.results.length === 0) {
          setError("No movies found.");
          setMovies([]);
          return;
        }
        setMovies(data.results);

        if (debouncedSearch && data.results.length > 0) {
          await updateSearchCount(debouncedSearch, data.results[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, sortBy]);

  return { searchTerm, setSearchTerm, movies, isLoading, error, sortBy, setSortBy };
};
