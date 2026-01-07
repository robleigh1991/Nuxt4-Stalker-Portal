export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { portalurl, macaddress, token, series_id, page } = body;

  // make a post request to the portalurl with the body to get the token action should be handshake
  const data = await $fetch(`${portalurl}/server/load.php`, {
    method: "GET",
    headers: {
      "User-Agent": "MAG200 stbapp",
      Cookie: `mac=${macaddress}; stb_lang=en;`,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    query: {
      type: "series",
      action: "get_ordered_list",
      movie_id: series_id,
      p: page,
    },
  });

  console.log(data);
  const json = JSON.parse(data);

  return json;
});
