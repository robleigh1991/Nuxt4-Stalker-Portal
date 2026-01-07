export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { query, year } = body;

    if (!query) {
      throw createError({
        statusCode: 400,
        message: "Search query is required",
      });
    }

    // Get TMDB API key from environment
    const apiKey = process.env.TMDB_API_KEY || "your-tmdb-api-key";

    console.log(apiKey);
    const baseUrl = "https://api.themoviedb.org/3";

    // Search for movies
    const searchResults = await $fetch(`${baseUrl}/search/movie`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      query: {
        api_key: apiKey,
        query: query,
        year: year || undefined,
      },
    });

    return searchResults;
  } catch (err: any) {
    console.error("TMDB Search API error:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Failed to search movies on TMDB",
    });
  }
});
