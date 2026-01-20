export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let { portalurl, macaddress, token, cmd, type } = body;

  // if cmd already contains stream= then return the cmd
  if (cmd.includes("stream=")) {
    cmd = cmd.replace(/ffmpeg/gi, "");
    if (cmd.includes("extension=")) {
      cmd = cmd.replace(/extension=ts/gi, "extension=m3u8");
    }
    return cmd;
  }

  // If cmd is already a full HTTP URL (tokenized stream), return it directly
  if (cmd.startsWith("http://") || cmd.startsWith("https://")) {
    console.log("🔗 Direct tokenized URL detected:", cmd);
    
    // These are usually already valid stream URLs
    // Just ensure we're not getting a .ts segment URL
    if (cmd.match(/\.ts$/i) && !cmd.includes('.m3u8')) {
      console.warn("⚠️ Direct .ts file detected - may need playlist");
    }
    
    return cmd.replace(/ffmpeg/gi, "");
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
        "Mozilla/5.0 (QtEmbedded; Linux; U) AppleWebKit/537.3 (KHTML, like Gecko) MAG254 stbapp ver: 4 rev: 1812 Safari/537.3",
      "X-User-Agent": "Model: MAG254; Link: Ethernet",
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
      JsHttpRequest: "1-xml",
    },
  });

  // Handle both string and object responses
  let response;
  if (typeof data === "string") {
    response = JSON.parse(data);
  } else {
    response = data;
  }

  let sourceLink = response.js.cmd;

  console.log("📺 Source link from API:", sourceLink);

  // If we got a tokenized URL directly, return it
  if (sourceLink.startsWith("http://") || sourceLink.startsWith("https://")) {
    console.log("🔗 Tokenized URL from API");
    return sourceLink.replace(/ffmpeg/gi, "");
  }

  // ---- FORCE HLS (.m3u8) ------------------------------------
  // 1) If the command contains an extension param, flip it
  if (sourceLink.includes("extension=")) {
    sourceLink = sourceLink.replace(/extension=ts/gi, "extension=m3u8");
  }
  
  // remove ffmpeg from the source link
  sourceLink = sourceLink.replace(/ffmpeg/gi, "");

  console.log("✅ Final source link:", sourceLink);

  return sourceLink;
});
