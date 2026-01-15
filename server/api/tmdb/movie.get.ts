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

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: "TMDB_API_KEY not configured in environment variables",
      });
    }

    const baseUrl = "https://api.themoviedb.org/3";

    // Fetch movie details with all extras
    const movieDetails = await $fetch(`${baseUrl}/movie/${tmdbId}`, {
      method: "GET",
      query: {
        api_key: apiKey,
        append_to_response: "videos,credits,images",
      },
    });

    return movieDetails;
  } catch (err: any) {
    console.error("TMDB movie API error:", err);

    // Return null for 404s to allow fallback
    if (err.statusCode === 404) {
      return null;
    }

    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Failed to fetch movie details from TMDB",
    });
  }
});
