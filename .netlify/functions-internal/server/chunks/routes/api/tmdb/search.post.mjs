import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
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

const search_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { query, year } = body;
    if (!query) {
      throw createError({
        statusCode: 400,
        message: "Search query is required"
      });
    }
    const apiKey = process.env.TMDB_API_KEY || "your-tmdb-api-key";
    console.log(apiKey);
    const baseUrl = "https://api.themoviedb.org/3";
    const searchResults = await $fetch(`${baseUrl}/search/movie`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      query: {
        api_key: apiKey,
        query,
        year: year || void 0
      }
    });
    return searchResults;
  } catch (err) {
    console.error("TMDB Search API error:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Failed to search movies on TMDB"
    });
  }
});

export { search_post as default };
//# sourceMappingURL=search.post.mjs.map
