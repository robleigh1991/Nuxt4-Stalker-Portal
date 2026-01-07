export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let { portalurl, macaddress, token, cmd, type, id } = body;

  // if is cmd already contains stream= then return the cmd
  if (cmd.includes("stream=")) {
    cmd = cmd.replace(/ffmpeg/gi, "");
    if (cmd.includes("extension=")) {
      cmd = cmd.replace(/extension=ts/gi, "extension=m3u8");
    }
    return cmd;
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
      action: "create_link",
      type: type,
      mac: macaddress,
      token: token,
      cmd: cmd,
      series: id,
    },
  });

  console.log(data);

  let response = JSON.parse(data);

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
