export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { tmdbId } = query;

    if (!tmdbId) {
      throw createError({
        statusCode: 400,
        message: "TMDB ID is required",
      });
    }

    // Get TMDB API key from environment or use a default (you should set this in .env)
    const apiKey = process.env.TMDB_API_KEY || "your-tmdb-api-key";
    const baseUrl = "https://api.themoviedb.org/3";

    // Fetch movie details
    const movieDetails = await $fetch(`${baseUrl}/movie/${tmdbId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      query: {
        api_key: apiKey,
        append_to_response: "videos,credits,images",
      },
    });

    return movieDetails;
  } catch (err: any) {
    console.error("TMDB API error:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Failed to fetch movie details from TMDB",
    });
  }
});

