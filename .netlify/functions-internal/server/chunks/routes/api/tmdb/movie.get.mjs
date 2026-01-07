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

const movie_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { tmdbId } = query;
    if (!tmdbId) {
      throw createError({
        statusCode: 400,
        message: "TMDB ID is required"
      });
    }
    const apiKey = process.env.TMDB_API_KEY || "your-tmdb-api-key";
    const baseUrl = "https://api.themoviedb.org/3";
    const movieDetails = await $fetch(`${baseUrl}/movie/${tmdbId}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      query: {
        api_key: apiKey,
        append_to_response: "videos,credits,images"
      }
    });
    return movieDetails;
  } catch (err) {
    console.error("TMDB API error:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Failed to fetch movie details from TMDB"
    });
  }
});

export { movie_get as default };
//# sourceMappingURL=movie.get.mjs.map
