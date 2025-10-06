import React from "react";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import MovieCard from "@/features/movie/components/MovieCard";

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  if (!wishlist.length) return <p>No movies in wishlist.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {wishlist.map((w) => (
        // <MovieCard key={w.id} movie={w.movie} /> 
        <p>{w.movieId}</p>
        // backend trả về cả object movie hoặc bạn fetch lại detail từ TMDB nếu chỉ có movieId
      ))}
    </div>
  );
};

export default WishlistPage;
