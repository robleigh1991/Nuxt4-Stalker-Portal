import { d as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';

const createserieslink_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  let { portalurl, macaddress, token, cmd, type, id } = body;
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
      Authorization: `Bearer ${token}`
    },
    query: {
      action: "create_link",
      type,
      mac: macaddress,
      token,
      cmd,
      series: id
    }
  });
  console.log(data);
  let response = JSON.parse(data);
  let sourceLink = response.js.cmd;
  if (sourceLink.includes("extension=")) {
    sourceLink = sourceLink.replace(/extension=ts/gi, "extension=m3u8");
  }
  sourceLink = sourceLink.replace(/ffmpeg/gi, "");
  return sourceLink;
});

export { createserieslink_post as default };
//# sourceMappingURL=createserieslink.post.mjs.map
