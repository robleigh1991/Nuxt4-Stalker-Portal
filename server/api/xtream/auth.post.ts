export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Validate request body (XtreamAuthSchema and validateBody are auto-imported from server/utils)
  const { serverUrl, username, password } = validateBody(XtreamAuthSchema, body);

  try {
    const url = `${serverUrl}/get.php?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}&type=m3u&output=ts`;

    const response = await $fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    // Validate response
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response from server");
    }

    return response;
  } catch (error: any) {
    console.error("Xtream auth error:", error);
    throw createError({
      statusCode: 401,
      message: "Authentication failed",
    });
  }
});
