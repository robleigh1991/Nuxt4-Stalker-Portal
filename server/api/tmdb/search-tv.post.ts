// server/api/tmdb/search-tv.post.ts
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

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: "TMDB_API_KEY not configured in environment variables",
      });
    }

    const baseUrl = "https://api.themoviedb.org/3";

    // Search for TV series
    const searchResults = await $fetch(`${baseUrl}/search/tv`, {
      method: "GET",
      query: {
        api_key: apiKey,
        query: query,
        first_air_date_year: year || undefined,
        language: "en-US",
      },
    });

    return searchResults;
  } catch (err: any) {
    console.error("TMDB TV search API error:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Failed to search TV series on TMDB",
    });
  }
});
