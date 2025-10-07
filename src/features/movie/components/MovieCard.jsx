import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const MovieCard = ({ movie }) => {
  const {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
    original_language,
  } = movie;
  const { wishlist, add, remove } = useWishlist();

  const inWishlist = wishlist.some((w) => Number(w.movieId) === Number(id));
  const wishlistItem = wishlist.find((w) => Number(w.movieId) === Number(id));

  const handleClick = (e) => {
    e.preventDefault(); // chặn redirect khi click icon
    if (inWishlist) {
      remove(wishlistItem.id);
    } else {
      add(id);
    }
  };

  return (
    <div className="relative">
      <Link to={`/movie/${id}`} className="movie-card block">
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

      {/* Wishlist icon */}
      <button
        onClick={handleClick}
        className="absolute top-2 right-2 text-2xl cursor-pointer"
      >
        {inWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
    </div>
  );
};

export default MovieCard;
