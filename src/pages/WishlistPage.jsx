import React from "react";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import MovieCard from "@/features/movie/components/MovieCard";
import { shareWishlist } from "@/api/wishlist";
import { useAuth } from "@/features/auth/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineShareAlt } from "react-icons/ai";

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const [shareUrl, setShareUrl] = useState("");

  if (!wishlist.length) return <p>No movies in wishlist.</p>;

  const handleShare = async () => {
    try {
      console.log(user);
      const res = await shareWishlist(user);
      const url = res.data.shareUrl;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied!");
    } catch {
      toast.error("Failed to share wishlist");
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-indigo-600">Wishlist</h1>
      <button
        onClick={handleShare}
        className="p-4 bg-indigo-500 cursor-pointer rounded-3xl absolute right-1/12"
      >
        <AiOutlineShareAlt />
      </button>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-9/12 mx-auto">
        {wishlist.map((w) => (
          <MovieCard key={w.id} movie={w.movie} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
