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
});
