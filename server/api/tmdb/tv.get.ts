// server/api/tmdb/tv.get.ts
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const tmdbId = query.tmdbId as string;

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
    const commonQuery = { api_key: apiKey };

    // Fetch all data in parallel
    const [details, videos, credits, images] = await Promise.allSettled([
      $fetch(`${baseUrl}/tv/${tmdbId}`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/videos`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/credits`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/images`, { query: commonQuery }),
    ]);

    // Helper to safely extract values
    const safe = <T>(r: PromiseSettledResult<T>, fallback: T): T =>
      r.status === "fulfilled" ? r.value : fallback;

    const seriesDetails = safe(details, null);
    const videosData = safe(videos, { results: [] });
    const creditsData = safe(credits, { cast: [], crew: [] });
    const imagesData = safe(images, { backdrops: [], posters: [], logos: [] });

    // If main details failed, return null for fallback
    if (!seriesDetails) {
      return null;
    }

    return {
      ...seriesDetails,
      videos: videosData,
      credits: creditsData,
      images: imagesData,
    };
  } catch (err: any) {
    console.error("TMDB TV API error:", err);
    return null; // Allow frontend fallback
  }
});
