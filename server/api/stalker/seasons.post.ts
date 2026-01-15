export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { portalurl, macaddress, token, series_id, page } = body;

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
    query: {
      type: "series",
      action: "get_ordered_list",
      movie_id: series_id,
      p: page,
      JsHttpRequest: "1-xml",
    },
  });

  console.log(data);

  // Handle both string and object responses
  if (typeof data === "string") {
    return JSON.parse(data);
  }

  return data;
});
