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

    let fullUrl;

    // Check if this is a stalker_portal type URL
    if (portalurl.includes("/stalker_portal/c")) {
      const baseUrl = portalurl.replace("/c", "");
      fullUrl = `${baseUrl}/server/load.php`;
    } else if (portalurl.endsWith("/c")) {
      const baseUrl = portalurl.replace(/\/c$/, "");
      fullUrl = `${baseUrl}/portal.php`;
    } else {
      fullUrl = `${portalurl}/portal.php`;
    }

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

    const data = await $fetch(fullUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3",
        "X-User-Agent": "Model: MAG250; Link: WiFi",
        Authorization: `Bearer ${token}`,
        Cookie: `mac=${macaddress}; stb_lang=en; timezone=GMT`,
        Referer: portalurl.endsWith("/c") ? portalurl + "/" : portalurl,
      },
      query: params,
      sHttpRequest: "1-xml",
    });

    // Handle both string and object responses
    let json;
    if (typeof data === "string") {
      json = JSON.parse(data);
    } else {
      json = data;
    }

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
