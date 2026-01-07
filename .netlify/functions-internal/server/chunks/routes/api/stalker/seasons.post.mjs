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

const seasons_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { portalurl, macaddress, token, series_id, page } = body;
  const data = await $fetch(`${portalurl}/server/load.php`, {
    method: "GET",
    headers: {
      "User-Agent": "MAG200 stbapp",
      Cookie: `mac=${macaddress}; stb_lang=en;`,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    query: {
      type: "series",
      action: "get_ordered_list",
      movie_id: series_id,
      p: page
    }
  });
  console.log(data);
  const json = JSON.parse(data);
  return json;
});

export { seasons_post as default };
//# sourceMappingURL=seasons.post.mjs.map
