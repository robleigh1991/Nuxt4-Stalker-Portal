/**
 * Service Worker plugin for image caching
 */
export default defineNuxtPlugin(() => {
  if (process.client && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw-image-cache.js', {
          scope: '/',
        });

        console.log('[SW] Service Worker registered successfully:', registration.scope);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('[SW] New service worker activated');
              }
            });
          }
        });
      } catch (error) {
        console.error('[SW] Service Worker registration failed:', error);
      }
    });
  }

  // Provide method to clear image cache
  return {
    provide: {
      clearImageCache: async () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              resolve(event.data.success);
            };
            navigator.serviceWorker.controller.postMessage(
              { type: 'CLEAR_IMAGE_CACHE' },
              [messageChannel.port2]
            );
          });
        }
        return false;
      },
    },
  };
});
