import { getMovieDetail } from "@/api/tmdb";

export const enrichWithMovieDetails = async (items) => {
  return Promise.all(
    items.map(async (item) => {
      try {
        const movie = await getMovieDetail(item.movieId);
        return { ...item, movie };
      } catch (error) {
        console.error("TMDB fetch failed for", item.movieId, error);
        return item;
      }
    })
  );
};
