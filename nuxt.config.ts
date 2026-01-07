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

  nitro: {
    preset: "netlify",
  },

  css: ["~/assets/css/main.css", "plyr/dist/plyr.css"],

  routeRules: {
    "/": { prerender: true },
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
