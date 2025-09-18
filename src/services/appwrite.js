import { ID, Client, Query, TablesDB } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://syd.cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject(PROJECT_ID); // Your project ID

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID, // Remove the <> characters
      tableId: TABLE_ID, // Remove the <> characters
      queries: [Query.equal("searchTerm", searchTerm)],
    });
    // If record exists, update it
    console.log(result);
    if (result.rows.length > 0) {
      const doc = result.rows[0];
      await tablesDB.upsertRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: doc.$id,
        data: {
          searchTerm,
          count: doc.count + 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}` || "No Image",
        },
      });
      // If record does not exist, create it
    } else {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingMovies = async () => {
    try {
      const result = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        queries: [Query.orderDesc("count"), Query.limit(5)],
      });
      return result.rows;
    } catch (error) {
        console.error("Error fetching trending search terms:", error);
    }
}

export default client;
