// Service Worker for aggressive image caching
const CACHE_NAME = 'iptv-images-v1';
const IMAGE_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const MAX_CACHE_SIZE = 100; // Maximum number of images to cache

// Install event - set up the cache
self.addEventListener('install', (event) => {
  console.log('[SW] Image cache service worker installed');
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Image cache service worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('iptv-images-') && cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  return self.clients.claim();
});

// Check if URL is an image
function isImageRequest(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  const urlPath = new URL(url).pathname.toLowerCase();
  return (
    imageExtensions.some((ext) => urlPath.endsWith(ext)) ||
    url.includes('/_ipx/') ||
    url.includes('/api/stream-proxy') ||
    urlPath.includes('stream_icon') ||
    urlPath.includes('screenshot') ||
    urlPath.includes('logo') ||
    urlPath.includes('cover')
  );
}

// Limit cache size by removing oldest entries
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
    console.log(`[SW] Removed ${keysToDelete.length} old cached images`);
  }
}

// Fetch event - intercept image requests
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle image requests
  if (!isImageRequest(request.url)) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try to get from cache first
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          // Check if cached response is still fresh
          const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time') || 0).getTime();
          const now = Date.now();

          if (now - cachedTime < IMAGE_CACHE_MAX_AGE) {
            console.log('[SW] Serving from cache:', request.url.substring(0, 80));
            return cachedResponse;
          } else {
            // Cached response is stale, delete it
            await cache.delete(request);
          }
        }

        // Fetch from network
        console.log('[SW] Fetching from network:', request.url.substring(0, 80));
        const networkResponse = await fetch(request);

        // Only cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          // Clone the response before caching
          const responseToCache = networkResponse.clone();

          // Add custom header with cache time
          const headers = new Headers(responseToCache.headers);
          headers.append('sw-cached-time', new Date().toISOString());

          const modifiedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers,
          });

          // Cache the response
          cache.put(request, modifiedResponse);

          // Limit cache size
          limitCacheSize(CACHE_NAME, MAX_CACHE_SIZE);
        }

        return networkResponse;
      } catch (error) {
        console.error('[SW] Fetch failed:', error);

        // Try to return cached version even if stale
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          console.log('[SW] Serving stale cache due to network error');
          return cachedResponse;
        }

        // Return a placeholder or throw
        throw error;
      }
    })()
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_IMAGE_CACHE') {
    console.log('[SW] Clearing image cache');
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});
