import { createContext, useContext, useState, useEffect } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/api/wishlist";
import { toast } from "react-toastify";
import { useAuth } from "@/features/auth/AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      getWishlist()
        .then(setWishlist)
        .catch((err) =>
          console.error("Wishlist API error:", err.response || err)
        );
    }
  }, [user, wishlist]);

  const add = async (movieId) => {
    try {
      const item = await addToWishlist(movieId);
      setWishlist((prev) => [...prev, item]);
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed to add wishlist");
    }
  };

  const remove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);
      setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
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
