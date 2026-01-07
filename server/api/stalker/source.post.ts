export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    portalurl,
    macaddress,
    token,
    media_type,
    page,
    media_id = null,
    category_id = null,
    genre_id = null,
  } = body;

  const params = {
    type: media_type,
    action: "get_link",
  };

  if (media_type === "series") {
    params.episode_id = media_id;
  }

  if (media_type === "vod") {
    params.vod_id = media_id;
  }

  if (media_type === "itv") {
    params.genre_id = genre_id;
  }

  const data = await $fetch(`${portalurl}/server/load.php`, {
    method: "GET",
    headers: {
      "User-Agent": "MAG200 stbapp",
      Cookie: `mac=${macaddress}; stb_lang=en;`,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    query: {
      type: media_type,
      action: media_action,
      media_id: media_id,
    },
  });

  const json = JSON.parse(data);

  return json;
});
