import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovieDetail";
import MovieCard from "./MovieCard";
import ProviderList from "./ProviderList";
import Spinner from "../../../components/common/Spinner";

const MovieDetailPage = () => {
  const { id } = useParams();
  const { movie, providers, trailerKey, isLoading, error } = useMovieDetail(id, "US");
  const [showTrailer, setShowTrailer] = useState(false);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;
  if (!movie) return <p className="text-gray-400">Movie not found</p>;

  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const writers = movie.credits?.crew?.filter((c) => c.department === "Writing") || [];
  const stars = movie.credits?.cast?.slice(0, 3) || [];

  return (
    <div className="flex bg-gray-900 text-white">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {/* 🎬 Backdrop + Trailer */}
          <div className="relative">
            {showTrailer && trailerKey ? (
              <iframe
                className="w-full h-96"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <img
                  src={
                    movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                      : "./no-movie.png"
                  }
                  alt={movie.title}
                  className="w-full h-96 object-cover"
                />
                {trailerKey && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-lg font-medium"
                  >
                    ▶ Watch Trailer
                  </button>
                )}
              </>
            )}
          </div>

          {/* 📖 Movie Details */}
          <div className="p-6">
            <h2 className="text-lg font-semibold">
              {movie.title}{" "}
              <span className="text-gray-400">
                • {movie.release_date?.split("-")[0]} • {movie.runtime}m
              </span>
            </h2>

            {/* Genres */}
            <div className="flex space-x-2 mt-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-lg"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              {movie.overview}
            </p>

            {/* Crew & Cast */}
            <div className="mt-3 space-y-1 text-sm">
              {director && (
                <p>
                  Director:{" "}
                  <span className="text-cyan-400">{director.name}</span>
                </p>
              )}
              {writers.length > 0 && (
                <p>
                  Writers:{" "}
                  <span className="text-cyan-400">
                    {writers.map((w) => w.name).join(", ")}
                  </span>
                </p>
              )}
              {stars.length > 0 && (
                <p>
                  Stars:{" "}
                  <span className="text-cyan-400">
                    {stars.map((s) => s.name).join(", ")}
                  </span>
                </p>
              )}
            </div>

            {/* Buttons & Rating */}
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center space-x-1 text-yellow-400">
                <span className="text-lg">★</span>
                <span className="font-medium">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">
                  {movie.vote_count}
                </span>
              </div>
            </div>

            {/* ✅ Providers */}
            <ProviderList providers={providers} />

            {/* 🎥 Similar Movies */}
            <div className="mt-6">
              <h3 className="text-gray-400 text-sm mb-3">Similar Movies</h3>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {movie.similar?.results?.slice(0, 5).map((m) => (
                  <MovieCard
                    key={m.id}
                    movie={{
                      id: m.id,
                      title: m.title,
                      poster_path: m.poster_path,
                      vote_average: m.vote_average,
                      release_date: m.release_date,
                      original_language: m.original_language,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailPage;
