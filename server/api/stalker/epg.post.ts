export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { portalurl, macaddress, token, channelId } = body;

    if (!portalurl || !macaddress || !token || !channelId) {
        throw createError({
            statusCode: 400,
            message: "Missing required parameters",
        });
    }

    let fullUrl;
    if (portalurl.includes("/stalker_portal/c")) {
        const baseUrl = portalurl.replace("/c", "");
        fullUrl = `${baseUrl}/server/load.php`;
    } else if (portalurl.endsWith("/c")) {
        const baseUrl = portalurl.replace(/\/c$/, "");
        fullUrl = `${baseUrl}/portal.php`;
    } else {
        fullUrl = `${portalurl}/portal.php`;
    }

    try {
        const data = await $fetch(fullUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3",
                "X-User-Agent": "Model: MAG250; Link: WiFi",
                "Authorization": `Bearer ${token}`,
                "Cookie": `mac=${macaddress}; stb_lang=en; timezone=GMT`,
                "Referer": portalurl.endsWith("/c") ? portalurl + "/" : portalurl,
            },
            query: {
                type: "itv",
                action: "get_short_epg",
                ch_id: channelId,
                JsHttpRequest: "1-xml",
            },
        });

        // Stalker often returns a string that needs parsing
        if (typeof data === "string") {
            if (data.trim().startsWith("{") || data.trim().startsWith("[")) {
                return JSON.parse(data);
            }
            return { js: data };
        }

        return data;
    } catch (error: any) {
        console.error("Stalker EPG request failed:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch Stalker EPG",
        });
    }
});
