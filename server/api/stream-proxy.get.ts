// server/api/stream-proxy.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const targetUrl = query.url as string;
  const portalUrl = query.portalurl as string;
  const macAddress = query.macaddress as string;
  const token = query.token as string;
  const forceM3u8 = query.force_m3u8 === 'true';

  // CORS headers
  const setCorsHeaders = () => {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
      'Access-Control-Max-Age': '3600'
    });
  };

  // Handle OPTIONS preflight
  if (event.method === 'OPTIONS') {
    setCorsHeaders();
    setResponseStatus(event, 204);
    return '';
  }

  // Validate URL
  if (!targetUrl) {
    setCorsHeaders();
    throw createError({
      statusCode: 400,
      message: 'Missing url parameter'
    });
  }

  try {
    new URL(targetUrl);
  } catch {
    setCorsHeaders();
    throw createError({
      statusCode: 400,
      message: 'Invalid URL format'
    });
  }

  // Build headers
  const headers: HeadersInit = {
    'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3',
    'Connection': 'keep-alive',
    'Accept': '*/*'
  };

  if (portalUrl) {
    headers['Referer'] = portalUrl.replace(/\/$/, '') + '/';
    headers['Origin'] = portalUrl.replace(/\/$/, '');
  }

  if (macAddress) {
    headers['Cookie'] = `mac=${macAddress}; stb_lang=en; timezone=GMT`;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Detect M3U8
  const parsedUrl = new URL(targetUrl);
  const isM3U8 = 
    parsedUrl.pathname.toLowerCase().endsWith('.m3u8') ||
    parsedUrl.search.toLowerCase().includes('m3u8') ||
    forceM3u8;

  // ====================
  // M3U8 HANDLER
  // ====================
  if (isM3U8) {
    const maxRetries = 3;
    const retryDelay = 1000; // ms
    let content: string | null = null;
    let statusCode = 0;
    let finalUrl = targetUrl;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(targetUrl, {
          headers,
          redirect: 'follow',
          signal: AbortSignal.timeout(30000)
        });

        statusCode = response.status;
        finalUrl = response.url;

        if (response.ok) {
          content = await response.text();
          break;
        }

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      } catch (error) {
        if (attempt === maxRetries) {
          setCorsHeaders();
          throw createError({
            statusCode: 502,
            message: `Failed to fetch M3U8 after ${maxRetries} attempts`
          });
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    if (!content || statusCode >= 400) {
      setCorsHeaders();
      throw createError({
        statusCode: statusCode >= 400 ? statusCode : 502,
        message: 'Failed to fetch M3U8 playlist'
      });
    }

    // Rewrite M3U8
    const rewritten = rewriteM3U8(content, finalUrl, event, portalUrl, macAddress, token);

    setCorsHeaders();
    setResponseHeaders(event, {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return rewritten;
  }

  // ====================
  // VIDEO STREAM HANDLER
  // ====================
  setCorsHeaders();
  setResponseHeader(event, 'Accept-Ranges', 'bytes');

  const rangeHeader = getHeader(event, 'range');
  if (rangeHeader) {
    headers['Range'] = rangeHeader;
  }

  try {
    const response = await fetch(targetUrl, {
      headers,
      redirect: 'follow'
    });

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: `Upstream returned ${response.status}`
      });
    }

    // Forward critical headers
    const criticalHeaders = [
      'content-length',
      'content-range',
      'content-type',
      'content-disposition',
      'accept-ranges',
      'cache-control',
      'last-modified',
      'etag',
      'expires'
    ];

    criticalHeaders.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        setResponseHeader(event, header, value);
      }
    });

    // Set status code (206 for partial content, 200 otherwise)
    setResponseStatus(event, response.status);

    // Stream the response body
    if (response.body) {
      return response.body;
    }

    // Fallback for environments without streaming support
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);

  } catch (error: any) {
    console.error('Stream proxy error:', error);
    setCorsHeaders();
    throw createError({
      statusCode: 502,
      message: error.message || 'Failed to proxy stream'
    });
  }
});

// ====================
// M3U8 REWRITER
// ====================
function rewriteM3U8(
  content: string,
  baseUrl: string,
  event: any,
  portalUrl?: string,
  macAddress?: string,
  token?: string
): string {
  const protocol = getHeader(event, 'x-forwarded-proto') || 'http';
  const host = getHeader(event, 'host') || 'localhost';
  const proxyBase = `${protocol}://${host}/api/stream-proxy`;

  const parsedBase = new URL(baseUrl);
  const root = `${parsedBase.protocol}//${parsedBase.host}`;
  const path = parsedBase.pathname.substring(0, parsedBase.pathname.lastIndexOf('/') + 1);

  // Build extra parameters
  let extraParams = '';
  if (portalUrl) extraParams += `&portalurl=${encodeURIComponent(portalUrl)}`;
  if (macAddress) extraParams += `&macaddress=${encodeURIComponent(macAddress)}`;
  if (token) extraParams += `&token=${encodeURIComponent(token)}`;

  const lines = content.split(/\r?\n/);
  const output: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Keep empty lines
    if (trimmed === '') {
      output.push(line);
      continue;
    }

    // Keep comments/metadata
    if (trimmed.startsWith('#')) {
      output.push(line);
      continue;
    }

    // Skip if already proxied
    if (trimmed.includes('stream-proxy')) {
      output.push(line);
      continue;
    }

    // Build absolute URL
    let absoluteUrl = trimmed;
    if (!trimmed.match(/^https?:\/\//)) {
      if (trimmed.startsWith('/')) {
        absoluteUrl = root + trimmed;
      } else {
        absoluteUrl = root + path + trimmed;
      }
    }

    // Rewrite through proxy
    output.push(`${proxyBase}?url=${encodeURIComponent(absoluteUrl)}${extraParams}`);
  }

  return output.join('\n');
}