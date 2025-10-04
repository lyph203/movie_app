import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
    original_language,
  } = movie;

  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "./no-movie.png"
        }
        alt={title}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <span className="text-amber-300 text-xl">★</span>
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>・</span>
          <p className="lang">{original_language}</p>

          <span>・</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
