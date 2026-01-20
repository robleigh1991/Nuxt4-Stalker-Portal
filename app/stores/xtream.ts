import { defineStore } from "pinia";

export const useXtreamStore = defineStore("xtream", {
  state: () => ({
    // Authentication
    serverUrl: null as string | null,
    username: null as string | null,
    password: null as string | null,
    userInfo: null as any | null,
    serverInfo: null as any | null,

    // Categories
    liveCategories: null as any[] | null,
    vodCategories: null as any[] | null,
    seriesCategories: null as any[] | null,

    // Content Cache
    liveStreams: {} as Record<string, any[]>,
    vodStreams: {} as Record<string, any[]>,
    seriesStreams: {} as Record<string, any[]>,
    seriesInfo: {} as Record<string, any>,
    seriesEpisodes: {} as Record<string, any[]>,

    // Current selections
    selectedCategory: null as any | null,
    currentStream: null as any | null,
    sourceUrl: null as string | null,

    // UI State
    isLoading: false,
    error: null as string | null,
    progress: 0,
    modalOpen: false,
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!(state.username && state.password && state.serverUrl);
    },

    streamUrl:
      (state) =>
      (
        streamId: number,
        type: "live" | "movie" | "series",
        extension = "m3u8"
      ) => {
        if (!state.serverUrl || !state.username || !state.password) return null;

        const typeMap = {
          live: "live",
          movie: "movie",
          series: "series",
        };

        return `${state.serverUrl}/${typeMap[type]}/${state.username}/${state.password}/${streamId}.${extension}`;
      },
  },

  actions: {
    // ==========================================
    // AUTHENTICATION
    // ==========================================
    async authenticate(serverUrl: string, username: string, password: string) {
      try {
        this.isLoading = true;
        this.error = null;

        // Clean server URL (remove trailing slash)
        const cleanUrl = serverUrl.trim().replace(/\/+$/, "");

        const response = await $fetch("/api/xtream/auth", {
          method: "POST",
          body: {
            serverUrl: cleanUrl,
            username: username.trim(),
            password: password.trim(),
          },
        });

        // Store credentials
        this.serverUrl = cleanUrl;
        this.username = username.trim();
        this.password = password.trim();
        this.userInfo = response.user_info;
        this.serverInfo = response.server_info;

        return { success: true };
      } catch (err: any) {
        this.error = "Authentication failed. Please check your credentials.";
        console.error("Authentication error:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // ==========================================
    // LIVE TV
    // ==========================================
    async getLiveCategories() {
      try {
        const categories = await $fetch("/api/xtream/live-categories", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
          },
        });

        this.liveCategories = categories || [];
        return this.liveCategories;
      } catch (err) {
        console.error("Failed to load live categories:", err);
        throw err;
      }
    },

    async getLiveStreams(categoryId: string) {
      const cacheKey = `cat_${categoryId}`;

      // Return cached streams if available
      if (this.liveStreams[cacheKey]?.length > 0) {
        return this.liveStreams[cacheKey];
      }

      try {
        this.progress = 50;

        const streams = await $fetch("/api/xtream/live-streams", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
            categoryId,
          },
        });

        this.liveStreams[cacheKey] = streams || [];
        this.progress = 100;

        setTimeout(() => {
          this.progress = 0;
        }, 500);

        return this.liveStreams[cacheKey];
      } catch (err) {
        console.error("Failed to load live streams:", err);
        this.progress = 0;
        throw err;
      }
    },

    // ==========================================
    // VOD (Movies)
    // ==========================================
    async getVodCategories() {
      try {
        const categories = await $fetch("/api/xtream/vod-categories", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
          },
        });

        this.vodCategories = categories || [];
        return this.vodCategories;
      } catch (err) {
        console.error("Failed to load VOD categories:", err);
        throw err;
      }
    },

    async getVodStreams(categoryId: string) {
      const cacheKey = `cat_${categoryId}`;

      if (this.vodStreams[cacheKey]?.length > 0) {
        return this.vodStreams[cacheKey];
      }

      try {
        this.progress = 50;

        const streams = await $fetch("/api/xtream/vod-streams", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
            categoryId,
          },
        });

        this.vodStreams[cacheKey] = streams || [];
        this.progress = 100;

        setTimeout(() => {
          this.progress = 0;
        }, 500);

        return this.vodStreams[cacheKey];
      } catch (err) {
        console.error("Failed to load VOD streams:", err);
        this.progress = 0;
        throw err;
      }
    },

    async getVodInfo(vodId: number) {
      try {
        const info = await $fetch("/api/xtream/vod-info", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
            vodId,
          },
        });

        return info;
      } catch (err) {
        console.error("Failed to load VOD info:", err);
        throw err;
      }
    },

    // ==========================================
    // SERIES
    // ==========================================
    async getSeriesCategories() {
      try {
        const categories = await $fetch("/api/xtream/series-categories", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
          },
        });

        this.seriesCategories = categories || [];
        return this.seriesCategories;
      } catch (err) {
        console.error("Failed to load series categories:", err);
        throw err;
      }
    },

    async getSeriesStreams(categoryId: string) {
      const cacheKey = `cat_${categoryId}`;

      if (this.seriesStreams[cacheKey]?.length > 0) {
        return this.seriesStreams[cacheKey];
      }

      try {
        this.progress = 50;

        const streams = await $fetch("/api/xtream/series-streams", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
            categoryId,
          },
        });

        this.seriesStreams[cacheKey] = streams || [];
        this.progress = 100;

        setTimeout(() => {
          this.progress = 0;
        }, 500);

        return this.seriesStreams[cacheKey];
      } catch (err) {
        console.error("Failed to load series streams:", err);
        this.progress = 0;
        throw err;
      }
    },

    async getSeriesInfo(seriesId: number) {
      const cacheKey = `series_${seriesId}`;

      if (this.seriesInfo[cacheKey]) {
        return this.seriesInfo[cacheKey];
      }

      try {
        const info = await $fetch("/api/xtream/series-info", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
            seriesId,
          },
        });

        this.seriesInfo[cacheKey] = info;
        return info;
      } catch (err) {
        console.error("Failed to load series info:", err);
        throw err;
      }
    },

    // ==========================================
    // PLAYBACK
    // ==========================================
    async playLiveStream(stream: any) {
      this.currentStream = stream;
      this.sourceUrl = this.streamUrl(stream.stream_id, "live", "m3u8");
      this.modalOpen = true;
    },

    async playVodStream(stream: any) {
      this.currentStream = stream;
      // Get container extension from stream info
      const extension = stream.container_extension || "mp4";
      this.sourceUrl = this.streamUrl(stream.stream_id, "movie", extension);
      this.modalOpen = true;
    },

    async playSeriesEpisode(seriesId: number, episodeId: number) {
      this.sourceUrl = `${this.serverUrl}/series/${this.username}/${this.password}/${episodeId}.m3u8`;
      this.modalOpen = true;
    },

    // ==========================================
    // UTILITY
    // ==========================================
    clearCache() {
      this.liveStreams = {};
      this.vodStreams = {};
      this.seriesStreams = {};
      this.seriesInfo = {};
      this.seriesEpisodes = {};
    },

    logout() {
      this.serverUrl = null;
      this.username = null;
      this.password = null;
      this.userInfo = null;
      this.serverInfo = null;
      this.liveCategories = null;
      this.vodCategories = null;
      this.seriesCategories = null;
      this.clearCache();
      this.currentStream = null;
      this.sourceUrl = null;
    },
  },
});
