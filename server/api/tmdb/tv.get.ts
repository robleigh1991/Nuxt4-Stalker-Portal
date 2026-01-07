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
        message: "TMDB API key missing",
      });
    }

    const baseUrl = "https://api.themoviedb.org/3";
    const commonQuery = { api_key: apiKey };

    const [details, videos, credits, images] = await Promise.allSettled([
      $fetch(`${baseUrl}/tv/${tmdbId}`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/videos`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/credits`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/images`, { query: commonQuery }),
    ]);

    const safe = <T>(r: PromiseSettledResult<T>, fallback: T): T =>
      r.status === "fulfilled" ? r.value : fallback;

    const seriesDetails = safe(details, null);
    const videosData = safe(videos, { results: [] });
    const creditsData = safe(credits, { cast: [], crew: [] });
    const imagesData = safe(images, { backdrops: [], posters: [], logos: [] });

    // If all failed, return null to let frontend fallback
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
    console.error("TMDB API error:", {
      status: err?.response?.status,
      message: err?.message,
    });

    return null; // fallback handled in frontend
  }
});
