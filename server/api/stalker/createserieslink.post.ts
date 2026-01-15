export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let { portalurl, macaddress, token, cmd, type, id } = body;

  // if cmd already contains stream= then return the cmd
  if (cmd.includes("stream=")) {
    cmd = cmd.replace(/ffmpeg/gi, "");
    if (cmd.includes("extension=")) {
      cmd = cmd.replace(/extension=ts/gi, "extension=m3u8");
    }
    return cmd;
  }

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
      action: "create_link",
      type: type,
      mac: macaddress,
      token: token,
      cmd: cmd,
      series: id,
      JsHttpRequest: "1-xml",
    },
  });

  console.log(data);

  // Handle both string and object responses
  let response;
  if (typeof data === "string") {
    response = JSON.parse(data);
  } else {
    response = data;
  }

  let sourceLink = response.js.cmd;

  // ---- FORCE HLS (.m3u8) ------------------------------------
  // 1) If the command contains an extension param, flip it
  if (sourceLink.includes("extension=")) {
    sourceLink = sourceLink.replace(/extension=ts/gi, "extension=m3u8");
  }
  // remove ffmpeg from the source link
  sourceLink = sourceLink.replace(/ffmpeg/gi, "");

  return sourceLink;
});
