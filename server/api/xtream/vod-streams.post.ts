// server/api/xtream/vod-streams.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { serverUrl, username, password, categoryId } = body;

  if (!serverUrl || !username || !password) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameters",
    });
  }

  try {
    let url = `${serverUrl}/player_api.php?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}&action=get_vod_streams`;

    // Add category filter if provided
    if (categoryId) {
      url += `&category_id=${encodeURIComponent(categoryId)}`;
    }

    const response = await $fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Failed to fetch VOD streams:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch VOD streams",
    });
  }
});
