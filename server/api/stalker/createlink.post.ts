export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    let { portalurl, macaddress, token, cmd, type } = body;

    console.log("📥 CreateLink request:", { 
      portalurl, 
      macaddress, 
      type, 
      cmdPreview: cmd?.substring(0, 50) 
    });

    // Validate required fields
    if (!portalurl || !macaddress || !token || !cmd || !type) {
      console.error("❌ Missing required fields");
      throw createError({
        statusCode: 400,
        message: "Missing required parameters"
      });
    }

    // if cmd already contains stream= then return the cmd
    if (cmd.includes("stream=")) {
      console.log("🎬 Stream URL detected in cmd");
      cmd = cmd.replace(/ffmpeg/gi, "");
      // Let .ts streams through naturally - VideoPlayer will handle fallback
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

    console.log("🌐 Fetching from:", fullUrl);

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

    console.log("📦 Raw response:", JSON.stringify(data).substring(0, 300));

    // Handle both string and object responses
    let response;
    if (typeof data === "string") {
      try {
        response = JSON.parse(data);
      } catch (e) {
        console.error("❌ Failed to parse response as JSON:", data);
        throw createError({
          statusCode: 500,
          message: "Invalid JSON response from portal"
        });
      }
    } else {
      response = data;
    }

    console.log("🔍 Parsed response structure:", {
      hasJs: !!response.js,
      jsType: typeof response.js,
      jsKeys: response.js ? Object.keys(response.js) : null,
      fullResponse: JSON.stringify(response).substring(0, 300)
    });

    // Extract source link with better error handling
    let sourceLink = null;

    if (response.js && response.js.cmd) {
      sourceLink = response.js.cmd;
    } else if (response.js && typeof response.js === 'string') {
      sourceLink = response.js;
    } else if (response.cmd) {
      sourceLink = response.cmd;
    } else if (response.url) {
      sourceLink = response.url;
    } else if (typeof response.js === 'object' && response.js !== null) {
      // Log what properties js has
      console.error("❌ response.js exists but no cmd. Available properties:", Object.keys(response.js));
      throw createError({
        statusCode: 500,
        message: "No stream URL in response.js"
      });
    } else {
      console.error("❌ No valid stream URL found in response");
      throw createError({
        statusCode: 500,
        message: "No stream URL found in portal response"
      });
    }

    console.log("📺 Source link from API:", sourceLink);

    // If we got a tokenized URL directly, return it
    if (sourceLink.startsWith("http://") || sourceLink.startsWith("https://")) {
      console.log("🔗 Tokenized URL from API");
      return sourceLink.replace(/ffmpeg/gi, "");
    }

    // Remove ffmpeg from the source link
    // Keep original format - VideoPlayer will fallback to .m3u8 if .ts fails
    sourceLink = sourceLink.replace(/ffmpeg/gi, "");

    console.log("✅ Final source link:", sourceLink);

    return sourceLink;

  } catch (error: any) {
    console.error("💥 CreateLink error:", error);
    
    // If it's already a createError, just throw it
    if (error.statusCode) {
      throw error;
    }

    // Log the full error for debugging
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    // Otherwise wrap it
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to create stream link"
    });
  }
});