import { d as defineEventHandler, a as getQuery, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';

const tv_get = defineEventHandler(async (event) => {
  var _a;
  try {
    const query = getQuery(event);
    const tmdbId = query.tmdbId;
    if (!tmdbId) {
      throw createError({
        statusCode: 400,
        message: "TMDB ID is required"
      });
    }
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: "TMDB API key missing"
      });
    }
    const baseUrl = "https://api.themoviedb.org/3";
    const commonQuery = { api_key: apiKey };
    const [details, videos, credits, images] = await Promise.allSettled([
      $fetch(`${baseUrl}/tv/${tmdbId}`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/videos`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/credits`, { query: commonQuery }),
      $fetch(`${baseUrl}/tv/${tmdbId}/images`, { query: commonQuery })
    ]);
    const safe = (r, fallback) => r.status === "fulfilled" ? r.value : fallback;
    const seriesDetails = safe(details, null);
    const videosData = safe(videos, { results: [] });
    const creditsData = safe(credits, { cast: [], crew: [] });
    const imagesData = safe(images, { backdrops: [], posters: [], logos: [] });
    if (!seriesDetails) {
      return null;
    }
    return {
      ...seriesDetails,
      videos: videosData,
      credits: creditsData,
      images: imagesData
    };
  } catch (err) {
    console.error("TMDB API error:", {
      status: (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status,
      message: err == null ? void 0 : err.message
    });
    return null;
  }
});

export { tv_get as default };
//# sourceMappingURL=tv.get.mjs.map
