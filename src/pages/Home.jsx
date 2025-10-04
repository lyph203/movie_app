import Search from "../components/common/Search";
import Spinner from "../components/common/Spinner";
import MovieCard from "../features/movie/components/MovieCard";
import { useMovies } from "../features/movie/hooks/useMovies";
import { useEffect, useState } from "react";
import { getTrendingMovies } from "../services/appwrite";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const Home = () => {
  const {
    searchTerm,
    setSearchTerm,
    movies,
    isLoading,
    error,
    sortBy,
    setSortBy,
  } = useMovies();
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    getTrendingMovies().then(setTrendingMovies).catch(console.error);
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img
                    src={movie.poster_url || "./no-movie.png"}
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <div className="flex items-center justify-between mb-4">
            <h2>All Movies</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-gray-800 text-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-300">
                <SelectItem value="popularity.desc">Popularity ↓</SelectItem>
                <SelectItem value="popularity.asc">Popularity ↑</SelectItem>
                <SelectItem value="release_date.desc">
                  Release Date ↓
                </SelectItem>
                <SelectItem value="release_date.asc">Release Date ↑</SelectItem>
                <SelectItem value="vote_average.desc">Rating ↓</SelectItem>
                <SelectItem value="vote_average.asc">Rating ↑</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;
