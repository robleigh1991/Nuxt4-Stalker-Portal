export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const {
      portalurl,
      macaddress,
      token,
      media_type,
      media_action,
      page,
      media_id = null,
      category_id = null,
      genre_id = null,
    } = body;

    const params = {
      type: media_type,
      action: media_action,
      p: page,
    };

    if (media_type === "series") {
      params.category = category_id;
    }

    if (media_type === "vod") {
      params.category = category_id;
    }

    if (media_type === "itv") {
      params.genre = genre_id;
    }

    const data = await $fetch(`${portalurl}/server/load.php`, {
      method: "GET",
      headers: {
        "User-Agent": "MAG200 stbapp",
        Cookie: `mac=${macaddress}; stb_lang=en;`,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      query: params,
    });

    const json = JSON.parse(data);
    return json.js;
  } catch (err) {
    console.error("Portal request failed:", err);

    return {
      success: false,
      message: "Unable to fetch data from portal",
      error: err?.message || err,
    };
  }
});
