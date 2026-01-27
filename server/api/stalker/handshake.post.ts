export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Validate request body (StalkerAuthSchema and validateBody are auto-imported from server/utils)
  const { portalurl, macaddress, endpoint } = validateBody(StalkerAuthSchema, body);

  let fullUrl;
  let isStalkerPortal = false;

  // Check if this is a stalker_portal type URL
  if (portalurl.includes("/stalker_portal/c")) {
    const baseUrl = portalurl.replace("/c", "");
    fullUrl = `${baseUrl}/${endpoint || "server/load.php"}`;
    isStalkerPortal = true;
  } else if (portalurl.endsWith("/c")) {
    const baseUrl = portalurl.replace(/\/c$/, "");
    fullUrl = `${baseUrl}/${endpoint || "portal.php"}`;
  } else {
    fullUrl = `${portalurl}/${endpoint || "portal.php"}`;
  }

  try {
    // Step 1: Handshake
    const data = await $fetch(fullUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3",
        "X-User-Agent": "Model: MAG250; Link: WiFi",
        Cookie: `mac=${macaddress}; stb_lang=en; timezone=GMT`,
        "Content-Type": "application/json",
        Referer: portalurl.endsWith("/c") ? portalurl + "/" : portalurl,
      },
      query: {
        type: "stb",
        action: "handshake",
        JsHttpRequest: "1-xml",
      },
    });

    // Handle both string and object responses
    let json;
    if (typeof data === "string") {
      json = JSON.parse(data);
    } else {
      json = data;
    }

    const token = json.js.token;
    const random = json.js.random;

    // Step 2: If it's a stalker_portal, call get_profile to authenticate the session
    if (isStalkerPortal) {
      const timestamp = Math.floor(Date.now() / 1000);
      const sn = "ABCDEFGH123456"; // Serial number
      const deviceId1 = macaddress
        .replace(/:/g, "")
        .toLowerCase()
        .padEnd(32, "0");
      const deviceId2 = macaddress
        .replace(/:/g, "")
        .toUpperCase()
        .padEnd(32, "0");
      const signature = "1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P";

      const metrics = JSON.stringify({
        mac: macaddress,
        sn: sn,
        model: "MAG250",
        type: "STB",
        uid: "",
        random: random,
      });

      await $fetch(fullUrl, {
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
          type: "stb",
          action: "get_profile",
          hd: 1,
          ver: "ImageDescription: 0.2.18-r14-pub-250; ImageDate: Fri Jan 15 15:20:44 EET 2016; PORTAL version: 5.1.0; API Version: JS API version: 328; STB API version: 134; Player Engine version: 0x566",
          num_banks: 2,
          sn: sn,
          stb_type: "MAG250",
          image_version: 218,
          video_out: "hdmi",
          device_id: deviceId1,
          device_id2: deviceId2,
          signature: signature,
          auth_second_step: 1,
          hw_version: "1.7-BD-00",
          not_valid_token: 0,
          client_type: "STB",
          hw_version_2: "08e10744513ba2b4847402b6718c0eae",
          timestamp: timestamp,
          api_signature: "263",
          metrics: metrics,
          JsHttpRequest: "1-xml",
        },
      });
    }

    return token;
  } catch (error) {
    console.error(`Failed to handshake with ${fullUrl}:`, error);
    throw error;
  }
});
