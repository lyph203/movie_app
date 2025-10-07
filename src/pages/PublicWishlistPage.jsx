import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicWishlist } from "@/api/wishlist";
import { enrichWithMovieDetails } from "@/features/wishlist/MovieUtils";
import MovieCard from "@/features/movie/components/MovieCard";

export default function PublicWishlistPage() {
  const { token } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPublicWishlist(token);
        const detailed = await enrichWithMovieDetails(res.data); // 🎯 thêm bước này
        setMovies(detailed);
      } catch (err) {
        console.error("Invalid or expired share link:", err);
      }
    })();
  }, [token]);

  return (
    <div className="p-4 bg-black">
      <h2 className="text-2xl font-semibold mt-4 text-indigo-500 text-center">Shared Wishlist</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 m-10 w-9/12 mx-auto">
        {movies.map((w) => (
          <MovieCard key={w.id} movie={w.movie} />
        ))}
      </div>
    </div>
  );
}
