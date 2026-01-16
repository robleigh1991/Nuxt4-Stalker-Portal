// server/api/xtream/vod-categories.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { serverUrl, username, password } = body;

  if (!serverUrl || !username || !password) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameters",
    });
  }

  try {
    const url = `${serverUrl}/player_api.php?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}&action=get_vod_categories`;

    const response = await $fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Failed to fetch VOD categories:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch VOD categories",
    });
  }
});
