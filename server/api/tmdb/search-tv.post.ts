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
    const baseUrl = "https://api.themoviedb.org/3";

    // Search for TV series
    const searchResults = await $fetch(`${baseUrl}/search/tv`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      query: {
        api_key: apiKey,
        query: query,
        first_air_date_year: year || undefined,
      },
    });

    return searchResults;
  } catch (err: any) {
    console.error("TMDB TV Search API error:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Failed to search TV series on TMDB",
    });
  }
});

