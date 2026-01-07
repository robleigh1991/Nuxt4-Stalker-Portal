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

const source_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    portalurl,
    macaddress,
    token,
    media_type,
    page,
    media_id = null,
    category_id = null,
    genre_id = null
  } = body;
  const data = await $fetch(`${portalurl}/server/load.php`, {
    method: "GET",
    headers: {
      "User-Agent": "MAG200 stbapp",
      Cookie: `mac=${macaddress}; stb_lang=en;`,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    query: {
      type: media_type,
      action: media_action,
      media_id
    }
  });
  const json = JSON.parse(data);
  return json;
});

export { source_post as default };
//# sourceMappingURL=source.post.mjs.map
