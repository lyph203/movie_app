import { createContext, useContext, useState, useEffect } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/api/wishlist";
import { toast } from "react-toastify";
import { useAuth } from "@/features/auth/AuthContext";
import { enrichWithMovieDetails } from "./MovieUtils";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const list = await getWishlist(); // [{id, movieId}]
          const detailed = await enrichWithMovieDetails(list);
          setWishlist(detailed);
        } catch (err) {
          console.error("Wishlist API error:", err.response || err);
        }
      })();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const refreshWishlist = async () => {
    try {
      const list = await getWishlist();
      const detailed = await enrichWithMovieDetails(list);
      setWishlist(detailed);
    } catch (err) {
      console.error("Wishlist refresh failed:", err);
    }
  };

  const add = async (movieId) => {
    try {
      await addToWishlist(movieId);
      await refreshWishlist(); // refetch sau khi thêm
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed to add wishlist");
    }
  };

  const remove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);
      await refreshWishlist(); // refetch sau khi xóa
      toast.info("Removed from wishlist");
    } catch {
      toast.error("Failed to remove wishlist");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, add, remove }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
