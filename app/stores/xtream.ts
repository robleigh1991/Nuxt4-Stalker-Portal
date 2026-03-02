import { defineStore } from "pinia";
import { apiCache } from "~/utils/cache";

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
    epgData: {} as Record<string, any[]>,

    // Current selections
    selectedCategory: null as any | null,
    currentStream: null as any | null,
    sourceUrl: null as string | null,
    currentEpisode: null as {
      seriesId: number | null;
      seasonNumber: number | null;
      episodeNumber: number | null;
      episodeData: any | null;
    } | null,

    // UI State
    isLoading: false,
    error: null as string | null,
    progress: 0,
    modalOpen: false,

    // Memory management
    cacheConfig: {
      maxCachedCategories: 5,           // Max categories cached at once
      cacheTimeout: 5 * 60 * 1000,      // 5 minutes
      lastAccessed: {} as Record<string, number>,
    },
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
    // MEMORY MANAGEMENT
    // ==========================================
    updateLastAccessed(cacheKey: string) {
      this.cacheConfig.lastAccessed[cacheKey] = Date.now();
    },

    clearOldCache() {
      const now = Date.now();
      const timeout = this.cacheConfig.cacheTimeout;
      const keysToRemove: string[] = [];

      // Find old cache keys
      Object.keys(this.cacheConfig.lastAccessed).forEach(key => {
        const lastAccessed = this.cacheConfig.lastAccessed[key];
        if (lastAccessed && now - lastAccessed > timeout) {
          keysToRemove.push(key);
        }
      });

      // Remove old caches
      keysToRemove.forEach(key => {
        delete this.liveStreams[key];
        delete this.vodStreams[key];
        delete this.seriesStreams[key];
        delete this.seriesInfo[key];
        delete this.seriesEpisodes[key];
        delete this.cacheConfig.lastAccessed[key];
      });

      if (keysToRemove.length > 0) {
        console.log(`[Memory] Cleared ${keysToRemove.length} old cache entries`);
      }

      // Enforce max cached categories limit
      this.enforceMaxCategories();
    },

    enforceMaxCategories() {
      const allKeys = Object.keys(this.cacheConfig.lastAccessed);

      if (allKeys.length <= this.cacheConfig.maxCachedCategories) {
        return;
      }

      // Sort by last accessed (oldest first)
      const sortedKeys = allKeys.sort((a, b) => {
        const accessA = this.cacheConfig.lastAccessed[a] || 0;
        const accessB = this.cacheConfig.lastAccessed[b] || 0;
        return accessA - accessB;
      });

      // Remove oldest entries beyond the limit
      const keysToRemove = sortedKeys.slice(0, allKeys.length - this.cacheConfig.maxCachedCategories);

      keysToRemove.forEach(key => {
        delete this.liveStreams[key];
        delete this.vodStreams[key];
        delete this.seriesStreams[key];
        delete this.seriesInfo[key];
        delete this.seriesEpisodes[key];
        delete this.cacheConfig.lastAccessed[key];
      });

      if (keysToRemove.length > 0) {
        console.log(`[Memory] Enforced category limit, removed ${keysToRemove.length} entries`);
      }
    },

    // No longer needed - virtual scrolling handles memory efficiency
    // limitItemsArray removed as it was cutting off valid items

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
        this.userInfo = (response as any).user_info;
        this.serverInfo = (response as any).server_info;

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
    async getLiveCategories(forceRefresh = false) {
      const cacheKey = 'categories_live';

      // Try cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(cacheKey);
        if (cached) {
          this.liveCategories = cached;
          console.log('[Cache] Loaded live categories from cache');
          return this.liveCategories;
        }
      }

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

        // Cache for 24 hours
        apiCache.set(cacheKey, this.liveCategories, 24 * 60);
        console.log('[Cache] Cached live categories');

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
        this.updateLastAccessed(cacheKey);
        return this.liveStreams[cacheKey];
      }

      // Clear old cache before loading new
      this.clearOldCache();

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

        // Store streams
        this.liveStreams[cacheKey] = (streams as any) || [];
        this.updateLastAccessed(cacheKey);
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
    async getVodCategories(forceRefresh = false) {
      const cacheKey = 'categories_vod';

      // Try cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(cacheKey);
        if (cached) {
          this.vodCategories = cached;
          console.log('[Cache] Loaded VOD categories from cache');
          return this.vodCategories;
        }
      }

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

        // Cache for 24 hours
        apiCache.set(cacheKey, this.vodCategories, 24 * 60);
        console.log('[Cache] Cached VOD categories');

        return this.vodCategories;
      } catch (err) {
        console.error("Failed to load VOD categories:", err);
        throw err;
      }
    },

    async getVodStreams(categoryId: string) {
      const cacheKey = `cat_${categoryId}`;

      if (this.vodStreams[cacheKey]?.length > 0) {
        this.updateLastAccessed(cacheKey);
        return this.vodStreams[cacheKey];
      }

      // Clear old cache before loading new
      this.clearOldCache();

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

        // Store streams
        this.vodStreams[cacheKey] = (streams as any) || [];
        this.updateLastAccessed(cacheKey);
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
    async getSeriesCategories(forceRefresh = false) {
      const cacheKey = 'categories_series';

      // Try cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(cacheKey);
        if (cached) {
          this.seriesCategories = cached;
          console.log('[Cache] Loaded series categories from cache');
          return this.seriesCategories;
        }
      }

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

        // Cache for 24 hours
        apiCache.set(cacheKey, this.seriesCategories, 24 * 60);
        console.log('[Cache] Cached series categories');

        return this.seriesCategories;
      } catch (err) {
        console.error("Failed to load series categories:", err);
        throw err;
      }
    },

    async getSeriesStreams(categoryId: string) {
      const cacheKey = `cat_${categoryId}`;

      if (this.seriesStreams[cacheKey]?.length > 0) {
        this.updateLastAccessed(cacheKey);
        return this.seriesStreams[cacheKey];
      }

      // Clear old cache before loading new
      this.clearOldCache();

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

        // Store streams
        this.seriesStreams[cacheKey] = (streams as any) || [];
        this.updateLastAccessed(cacheKey);
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

    async getEPG(streamId: number) {
      if (this.epgData[streamId]) {
        return this.epgData[streamId];
      }

      try {
        const data = await $fetch("/api/xtream/epg", {
          method: "POST",
          body: {
            serverUrl: this.serverUrl,
            username: this.username,
            password: this.password,
            streamId: streamId,
          },
        });

        // Xtream short_epg returns { epg_listings: [...] }
        this.epgData[streamId] = (data as any).epg_listings || [];
        return this.epgData[streamId];
      } catch (err) {
        console.error("Failed to load Xtream EPG:", err);
        return [];
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
      this.cacheConfig.lastAccessed = {};
      console.log('[Memory] Cleared all cache');
    },

    getCacheStats() {
      const liveCount = Object.keys(this.liveStreams).length;
      const vodCount = Object.keys(this.vodStreams).length;
      const seriesCount = Object.keys(this.seriesStreams).length;
      const totalItems = Object.values(this.liveStreams).flat().length +
        Object.values(this.vodStreams).flat().length +
        Object.values(this.seriesStreams).flat().length;

      return {
        cachedCategories: liveCount + vodCount + seriesCount,
        totalItems,
        liveCategories: liveCount,
        vodCategories: vodCount,
        seriesCategories: seriesCount,
      };
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
      this.clearAllCache();
      this.currentStream = null;
      this.sourceUrl = null;
    },

    /**
     * Refresh cache for current data
     */
    async refreshCache() {
      console.log('[Cache] Refreshing Xtream cache...');
      await Promise.all([
        this.getLiveCategories(true),
        this.getVodCategories(true),
        this.getSeriesCategories(true),
      ]);
      console.log('[Cache] Xtream cache refreshed');
    },

    /**
     * Clear persistent cache for this account
     */
    clearAllCache() {
      apiCache.clear();
      console.log('[Cache] Cleared Xtream cache');
    },
  },
});
