// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/scripts",
    "@pinia/nuxt",
  ],
  ssr: true,
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  app: {
    baseURL: "/", // ensures _nuxt assets are served correctly
  },

  nitro: {
    preset: "node-server", // ✅ build for a Node server
  },

  css: ["~/assets/css/main.css", "plyr/dist/plyr.css"],

  routeRules: {
    "/": { prerender: false },
    // Aggressive image caching rules
    "/_ipx/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable", // 1 year cache
      },
    },
  },

  runtimeConfig: {
    // Private keys (server-side only)
    secretEncryptionKey: process.env.NUXT_SECRET_ENCRYPTION_KEY || '',

    // Public keys (exposed to client)
    public: {
      apiTimeout: Number(process.env.NUXT_PUBLIC_API_TIMEOUT) || 30000,
      maxRetries: Number(process.env.NUXT_PUBLIC_MAX_RETRIES) || 3,
      sessionTimeout: Number(process.env.NUXT_PUBLIC_SESSION_TIMEOUT) || 3600000,
      enableFavorites: process.env.NUXT_PUBLIC_ENABLE_FAVORITES !== 'false',
      debugMode: process.env.NUXT_PUBLIC_DEBUG_MODE === 'true',
      // Memory optimization (virtual scrolling handles item memory efficiently)
      maxCachedCategories: Number(process.env.NUXT_PUBLIC_MAX_CACHED_CATEGORIES) || 3,
      cacheTimeout: Number(process.env.NUXT_PUBLIC_CACHE_TIMEOUT) || 180000, // 3 minutes
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  // Auto-import configuration
  imports: {
    // Auto-import Zod for validation
    presets: [
      {
        from: 'zod',
        imports: ['z'],
      },
    ],
  },

  // Image optimization for memory reduction
  image: {
    quality: 60, // Reduced from 70 for better memory usage
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    densities: [1, 2], // Limit to 1x and 2x density
    presets: {
      card: {
        modifiers: {
          format: 'webp',
          quality: 60,
          width: 300,
          height: 450,
        },
      },
    },
    // IPX (Nuxt Image) caching configuration
    ipx: {
      maxAge: 31536000, // Cache processed images for 1 year
      dir: './.cache/ipx', // Cache directory
    },
    // Enable browser-side caching
    domains: [], // Allow all domains for external images
    alias: {
      // If you use a CDN, add it here
    },
  },
});
