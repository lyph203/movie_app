import { apiClient } from "@/services/backend"; // axios instance

export const getWishlist = async () => {
  const res = await apiClient.get(`/wishlist/list-wishlist`);
  return res.data.data;
};

export const addToWishlist = async (movieId) => {
  const res = await apiClient.put(`/wishlist/add-wishlist?movieId=${movieId}`);
  return res.data;
};

export const removeFromWishlist = async (wishlistId) => {
  const res = await apiClient.delete(`/wishlist/delete-wishlist`, {
    params: { wishlistId },
  });
  return res.data;
};

export const shareWishlist = async (email) =>
  apiClient.put(`/wishlist/share`, null, { params: { email } });

export const getPublicWishlist = async (token) =>
  apiClient.get(`/wishlist/public/${token}`);