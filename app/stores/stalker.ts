import { defineStore } from "pinia";
import { apiCache } from "~/utils/cache";

export const useStalkerStore = defineStore("stalker", {
  state: () => ({
    portalurl: null as string | null,
    macaddress: null as string | null,
    token: null as string | null,
    liveCategories: null as any[] | null,
    moviesCategories: null as any[] | null,
    seriesCategories: null as any[] | null,
    // Cache for items by category/genre
    liveItems: {} as Record<string, any[]>,
    moviesItems: {} as Record<string, any[]>,
    seriesItems: {} as Record<string, any[]>,
    seriesSeasons: {} as Record<string, any[]>,
    seriesEpisodes: {} as Record<string, any[]>,
    epgData: {} as Record<string, any[]>,
    selectedCategory: false as any,
    sourceUrl: null as string | null,
    currentChannel: null as any | null,
    currentMovie: null as any | null,
    currentSeries: null as any | null,
    currentEpisode: null as {
      seriesId: number | null;
      seasonNumber: number | null;
      episodeNumber: number | null;
      episodeData: any | null;
    } | null,
    // Loading states
    isLoading: false,
    error: null as string | null,
    progress: 0,
    modalOpen: false,
    // Abort controllers for canceling requests
    liveAbortController: null as AbortController | null,
    moviesAbortController: null as AbortController | null,
    seriesAbortController: null as AbortController | null,
    playbackAbortController: null as AbortController | null,
    seriesInfoAbortController: null as AbortController | null,
    // Memory management
    cacheConfig: {
      maxCachedCategories: 5,           // Max categories cached at once
      cacheTimeout: 5 * 60 * 1000,      // 5 minutes
      lastAccessed: {} as Record<string, number>,
    },
  }),

  actions: {
    async setSelectedCategory(item: any) {
      this.selectedCategory = item;
      // Clear old cache when switching categories
      this.clearOldCache();
    },

    // Memory Management Methods
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
        delete this.liveItems[key];
        delete this.moviesItems[key];
        delete this.seriesItems[key];
        delete this.seriesSeasons[key];
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
        delete this.liveItems[key];
        delete this.moviesItems[key];
        delete this.seriesItems[key];
        delete this.seriesSeasons[key];
        delete this.seriesEpisodes[key];
        delete this.cacheConfig.lastAccessed[key];
      });

      if (keysToRemove.length > 0) {
        console.log(`[Memory] Enforced category limit, removed ${keysToRemove.length} entries`);
      }
    },

    // No longer needed - virtual scrolling handles memory efficiency
    // limitItemsArray removed as it was cutting off valid items

    async makeHandshake(portalurl: string, macaddress: string) {
      try {
        this.isLoading = true;
        this.error = null;

        // Set account ID for cache isolation
        const accountsStore = useAccountsStore();
        apiCache.setAccountId(accountsStore.activeAccountId);

        // Normalize the portal URL
        let normalizedUrl = portalurl.trim().replace(/\/+$/, "");

        // Ensure it ends with /c if not already present
        if (!normalizedUrl.endsWith("/c")) {
          normalizedUrl += "/c";
        }

        const token = await $fetch("/api/stalker/handshake", {
          method: "POST",
          body: {
            portalurl: normalizedUrl,
            macaddress,
          },
        });

        if (token) {
          this.token = token;
          this.portalurl = normalizedUrl;
          this.macaddress = macaddress;
          console.log(`Handshake successful`);
          return { success: true };
        }
      } catch (err: any) {
        this.error = "Failed to connect. Please check your credentials.";
        console.error("Handshake error:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Refresh cache for current data
     */
    async refreshCache() {
      console.log('[Cache] Refreshing Stalker cache...');
      await Promise.all([
        this.getLiveCategories(true),
        this.getMoviesCategories(true),
        this.getSeriesCategories(true),
      ]);
      console.log('[Cache] Stalker cache refreshed');
    },

    /**
     * Clear all cache for this account
     */
    clearCache() {
      apiCache.clear();
      console.log('[Cache] Cleared Stalker cache');
    },

    async getAllInfo() {
      await Promise.all([
        this.getLiveCategories(),
        this.getMoviesCategories(),
        this.getSeriesCategories(),
      ]);

      this.selectedCategory = this.liveCategories?.[1] || this.liveCategories?.[0] || null;
      if (this.selectedCategory) {
        const key = this.selectedCategory.id + "_1";
        this.liveItems[key] = await this.getLiveItems(this.selectedCategory.id) || [];
      }
      return "done";
    },

    async getLiveCategories(forceRefresh = false) {
      const cacheKey = 'categories_live';

      // Try cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(cacheKey);
        if (cached) {
          this.liveCategories = cached;
          console.log('[Cache] Loaded live categories from cache');
          return;
        }
      }

      try {
        const categories = await $fetch("/api/stalker/itv", {
          method: "POST",
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
          },
        });
        this.liveCategories = categories.js || [];

        // Cache for 24 hours
        apiCache.set(cacheKey, this.liveCategories, 24 * 60);
        console.log('[Cache] Cached live categories');
      } catch (err) {
        console.error("Failed to load live categories:", err);
        throw err;
      }
    },

    async getLiveItems(genreId: number, page = 1, forceRefresh = false) {
      const cacheKey = `${genreId}_${page}`;
      const persistentCacheKey = `live_items_${genreId}`;

      // Cancel any previous live items request
      if (this.liveAbortController) {
        this.liveAbortController.abort();
      }
      this.liveAbortController = new AbortController();
      const signal = this.liveAbortController.signal;

      // Return memory cached items if available
      if (!forceRefresh && this.liveItems[cacheKey]?.length > 0) {
        this.updateLastAccessed(cacheKey);
        return this.liveItems[cacheKey];
      }

      // Try persistent cache (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(persistentCacheKey);
        if (cached && cached.length > 0) {
          this.liveItems[cacheKey] = cached;
          this.updateLastAccessed(cacheKey);
          console.log(`[Cache] Loaded ${cached.length} live items from cache`);
          return cached;
        }
      }

      try {
        // Initialize array for this cache key
        this.liveItems[cacheKey] = [];
        // Get first page to determine total pages
        const firstPage = await $fetch("/api/stalker/orderlist", {
          method: "POST",
          signal,
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            media_type: "itv",
            media_action: "get_ordered_list",
            genre_id: genreId,
            page: 1,
          },
        });

        const totalItems = firstPage.total_items || 0;
        const totalPages = Math.ceil(totalItems / 14);

        // Fetch pages and add items IMMEDIATELY as each request completes
        const batchSize = 5;
        for (let i = 1; i <= totalPages; i += batchSize) {
          const pagePromises = [];
          for (let j = i; j < Math.min(i + batchSize, totalPages + 1); j++) {
            // Process each promise individually as it resolves
            const pagePromise = $fetch("/api/stalker/orderlist", {
              method: "POST",
              signal,
              body: {
                portalurl: this.portalurl,
                macaddress: this.macaddress,
                token: this.token,
                media_type: "itv",
                media_action: "get_ordered_list",
                genre_id: genreId,
                page: j,
              },
            }).then((result: any) => {
              // Add items IMMEDIATELY when this request completes
              if (result.data) {
                this.liveItems[cacheKey].push(...result.data);
                console.log(`[Stalker] Loaded page ${j}/${totalPages} - ${result.data.length} items added (Total: ${this.liveItems[cacheKey].length})`);
              }
              return result;
            });
            pagePromises.push(pagePromise);
          }

          // Wait for this batch to complete before starting next batch
          await Promise.all(pagePromises);

          // Update progress AFTER batch completes
          const pagesCompleted = Math.min(i + batchSize - 1, totalPages);
          this.progress = Math.floor((pagesCompleted / totalPages) * 100);
        }

        this.progress = 0;

        // Update last accessed time
        this.updateLastAccessed(cacheKey);

        // Cache items for 12 hours
        apiCache.set(persistentCacheKey, this.liveItems[cacheKey], 12 * 60);
        console.log(`[Cache] Cached ${this.liveItems[cacheKey].length} live items`);

        return this.liveItems[cacheKey];
      } catch (err: any) {
        // Don't throw error if request was aborted (user switched categories)
        if (err.name === 'AbortError' || err.cause?.name === 'AbortError' || err.message?.includes('aborted')) {
          console.log('[Stalker] Live items request aborted');
          this.progress = 0;
          return [];
        }
        console.error("Failed to load live items:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async getMoviesCategories(forceRefresh = false) {
      const cacheKey = 'categories_movies';

      // Try cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(cacheKey);
        if (cached) {
          this.moviesCategories = cached;
          console.log('[Cache] Loaded movie categories from cache');
          return;
        }
      }

      try {
        const categories = await $fetch("/api/stalker/vod", {
          method: "POST",
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
          },
        });
        this.moviesCategories = categories.js || [];

        // Cache for 24 hours
        apiCache.set(cacheKey, this.moviesCategories, 24 * 60);
        console.log('[Cache] Cached movie categories');
      } catch (err) {
        console.error("Failed to load movie categories:", err);
        throw err;
      }
    },

    async getMoviesItems(categoryId: number, page = 1, forceRefresh = false) {
      const cacheKey = `${categoryId}_${page}`;
      const persistentCacheKey = `movies_items_${categoryId}`;

      // Cancel any previous movies request
      if (this.moviesAbortController) {
        this.moviesAbortController.abort();
      }
      this.moviesAbortController = new AbortController();
      const signal = this.moviesAbortController.signal;

      // Return memory cached items if available
      if (!forceRefresh && this.moviesItems[cacheKey]?.length > 0) {
        this.updateLastAccessed(cacheKey);
        return this.moviesItems[cacheKey];
      }

      // Try persistent cache (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(persistentCacheKey);
        if (cached && cached.length > 0) {
          this.moviesItems[cacheKey] = cached;
          this.updateLastAccessed(cacheKey);
          console.log(`[Cache] Loaded ${cached.length} movie items from cache`);
          return cached;
        }
      }

      try {
        this.moviesItems[cacheKey] = [];

        const firstPage = await $fetch("/api/stalker/orderlist", {
          method: "POST",
          signal,
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            media_type: "vod",
            media_action: "get_ordered_list",
            category_id: categoryId,
            page: 1,
          },
        });

        const totalItems = firstPage.total_items || 0;
        const totalPages = Math.ceil(totalItems / 14);

        const batchSize = 5;
        for (let i = 1; i <= totalPages; i += batchSize) {
          const pagePromises = [];
          for (let j = i; j < Math.min(i + batchSize, totalPages + 1); j++) {
            const pagePromise = $fetch("/api/stalker/orderlist", {
              method: "POST",
              signal,
              body: {
                portalurl: this.portalurl,
                macaddress: this.macaddress,
                token: this.token,
                media_type: "vod",
                media_action: "get_ordered_list",
                category_id: categoryId,
                page: j,
              },
            }).then((result: any) => {
              if (result.data) {
                this.moviesItems[cacheKey].push(...result.data);
                console.log(`[Stalker] Loaded movies page ${j}/${totalPages} - ${result.data.length} items (Total: ${this.moviesItems[cacheKey].length})`);
              }
              return result;
            });
            pagePromises.push(pagePromise);
          }

          await Promise.all(pagePromises);

          // Update progress AFTER batch completes
          const pagesCompleted = Math.min(i + batchSize - 1, totalPages);
          this.progress = Math.floor((pagesCompleted / totalPages) * 100);
        }

        this.progress = 0;

        // Update last accessed time
        this.updateLastAccessed(cacheKey);

        // Cache items for 12 hours
        apiCache.set(persistentCacheKey, this.moviesItems[cacheKey], 12 * 60);
        console.log(`[Cache] Cached ${this.moviesItems[cacheKey].length} movie items`);

        return this.moviesItems[cacheKey];
      } catch (err: any) {
        // Don't throw error if request was aborted (user switched categories)
        if (err.name === 'AbortError' || err.cause?.name === 'AbortError' || err.message?.includes('aborted')) {
          console.log('[Stalker] Movies request aborted');
          this.progress = 0;
          return [];
        }
        console.error("Failed to load movie items:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async getSeriesCategories(forceRefresh = false) {
      const cacheKey = 'categories_series';

      // Try cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(cacheKey);
        if (cached) {
          this.seriesCategories = cached;
          console.log('[Cache] Loaded series categories from cache');
          return;
        }
      }

      try {
        const categories = await $fetch("/api/stalker/series", {
          method: "POST",
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
          },
        });
        this.seriesCategories = categories.js || [];

        // Cache for 24 hours
        apiCache.set(cacheKey, this.seriesCategories, 24 * 60);
        console.log('[Cache] Cached series categories');
      } catch (err) {
        console.error("Failed to load series categories:", err);
        throw err;
      }
    },

    async getSeriesItems(categoryId: number, page = 1, forceRefresh = false) {
      const cacheKey = `${categoryId}_${page}`;
      const persistentCacheKey = `series_items_${categoryId}`;

      // Cancel any previous series request
      if (this.seriesAbortController) {
        this.seriesAbortController.abort();
      }
      this.seriesAbortController = new AbortController();
      const signal = this.seriesAbortController.signal;

      // Return memory cached items if available
      if (!forceRefresh && this.seriesItems[cacheKey]?.length > 0) {
        this.updateLastAccessed(cacheKey);
        return this.seriesItems[cacheKey];
      }

      // Try persistent cache (unless force refresh)
      if (!forceRefresh) {
        const cached = apiCache.get<any[]>(persistentCacheKey);
        if (cached && cached.length > 0) {
          this.seriesItems[cacheKey] = cached;
          this.updateLastAccessed(cacheKey);
          console.log(`[Cache] Loaded ${cached.length} series items from cache`);
          return cached;
        }
      }

      try {
        this.seriesItems[cacheKey] = [];

        const firstPage = await $fetch("/api/stalker/orderlist", {
          method: "POST",
          signal,
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            media_type: "series",
            media_action: "get_ordered_list",
            category_id: categoryId,
            page: 1,
          },
        });

        const totalItems = firstPage.total_items || 0;
        const totalPages = Math.ceil(totalItems / 14);

        const batchSize = 5;
        for (let i = 1; i <= totalPages; i += batchSize) {
          const pagePromises = [];
          for (let j = i; j < Math.min(i + batchSize, totalPages + 1); j++) {
            const pagePromise = $fetch("/api/stalker/orderlist", {
              method: "POST",
              signal,
              body: {
                portalurl: this.portalurl,
                macaddress: this.macaddress,
                token: this.token,
                media_type: "series",
                media_action: "get_ordered_list",
                category_id: categoryId,
                page: j,
              },
            }).then((result: any) => {
              if (result.data) {
                this.seriesItems[cacheKey].push(...result.data);
                console.log(`[Stalker] Loaded series page ${j}/${totalPages} - ${result.data.length} items (Total: ${this.seriesItems[cacheKey].length})`);
              }
              return result;
            });
            pagePromises.push(pagePromise);
          }

          await Promise.all(pagePromises);

          // Update progress AFTER batch completes
          const pagesCompleted = Math.min(i + batchSize - 1, totalPages);
          this.progress = Math.floor((pagesCompleted / totalPages) * 100);
        }

        this.progress = 0;

        // Update last accessed time
        this.updateLastAccessed(cacheKey);

        // Cache items for 12 hours
        apiCache.set(persistentCacheKey, this.seriesItems[cacheKey], 12 * 60);
        console.log(`[Cache] Cached ${this.seriesItems[cacheKey].length} series items`);

        return this.seriesItems[cacheKey];
      } catch (err: any) {
        // Don't throw error if request was aborted (user switched categories)
        if (err.name === 'AbortError' || err.cause?.name === 'AbortError' || err.message?.includes('aborted')) {
          console.log('[Stalker] Series request aborted');
          this.progress = 0;
          return [];
        }
        console.error("Failed to load series items:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async getSeriesSeasons(seriesId: number) {
      const cacheKey = `${seriesId}_seasons`;

      if (this.seriesSeasons[cacheKey]) {
        return this.seriesSeasons[cacheKey];
      }

      // Cancel any previous series info request
      if (this.seriesInfoAbortController) {
        this.seriesInfoAbortController.abort();
      }
      this.seriesInfoAbortController = new AbortController();
      const signal = this.seriesInfoAbortController.signal;

      try {
        const seasons = await $fetch("/api/stalker/seasons", {
          method: "POST",
          signal,
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            series_id: seriesId,
            page: 1,
          },
        });

        this.seriesSeasons[cacheKey] = seasons.js?.data || [];
        return this.seriesSeasons[cacheKey];
      } catch (err: any) {
        if (err.name === 'AbortError' || err.cause?.name === 'AbortError' || err.message?.includes('aborted')) {
          console.log('[Stalker] Series info request aborted');
          return [];
        }
        console.error("Failed to load series seasons:", err);
        throw err;
      }
    },

    async getEPG(channelId: number) {
      if (this.epgData[channelId]) {
        return this.epgData[channelId];
      }

      try {
        const data = await $fetch("/api/stalker/epg", {
          method: "POST",
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            channelId: channelId,
          },
        });

        // Stalker EPG response format can vary, but usually it's in data.js.epg
        this.epgData[channelId] = data.js || [];
        return this.epgData[channelId];
      } catch (err) {
        console.error("Failed to load Stalker EPG:", err);
        return [];
      }
    },

    async createLink(cmd: string, type: string) {
      // Cancel any previous playback request
      if (this.playbackAbortController) {
        this.playbackAbortController.abort();
      }
      this.playbackAbortController = new AbortController();
      const signal = this.playbackAbortController.signal;

      try {
        const link = await $fetch("/api/stalker/createlink", {
          method: "POST",
          signal,
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            cmd: cmd,
            type: type,
          },
        });

        this.sourceUrl = link.replace(/ /g, "");
        return this.sourceUrl;
      } catch (err: any) {
        if (err.name === 'AbortError' || err.cause?.name === 'AbortError' || err.message?.includes('aborted')) {
          console.log('[Stalker] Playback request aborted');
          return null;
        }
        console.error("Failed to create link:", err);
        throw err;
      }
    },

    async createSeriesLink(cmd: string, type: string, id: number) {
      // Cancel any previous playback request
      if (this.playbackAbortController) {
        this.playbackAbortController.abort();
      }
      this.playbackAbortController = new AbortController();
      const signal = this.playbackAbortController.signal;

      try {
        const link = await $fetch("/api/stalker/createserieslink", {
          method: "POST",
          signal,
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            cmd: cmd,
            type: type,
            id: id,
          },
        });

        this.sourceUrl = link.replace(/ /g, "");
        return this.sourceUrl;
      } catch (err: any) {
        if (err.name === 'AbortError' || err.cause?.name === 'AbortError' || err.message?.includes('aborted')) {
          console.log('[Stalker] Series playback request aborted');
          return null;
        }
        console.error("Failed to create link:", err);
        throw err;
      }
    },

    clearCache() {
      this.liveItems = {};
      this.moviesItems = {};
      this.seriesItems = {};
      this.seriesSeasons = {};
      this.seriesEpisodes = {};
      this.cacheConfig.lastAccessed = {};
      console.log('[Memory] Cleared all cache');
    },

    getCacheStats() {
      const liveCount = Object.keys(this.liveItems).length;
      const moviesCount = Object.keys(this.moviesItems).length;
      const seriesCount = Object.keys(this.seriesItems).length;
      const totalItems = Object.values(this.liveItems).flat().length +
        Object.values(this.moviesItems).flat().length +
        Object.values(this.seriesItems).flat().length;

      return {
        cachedCategories: liveCount + moviesCount + seriesCount,
        totalItems,
        liveCategories: liveCount,
        movieCategories: moviesCount,
        seriesCategories: seriesCount,
      };
    },

    // Abort all pending requests
    abortAllRequests() {
      if (this.liveAbortController) {
        this.liveAbortController.abort();
        this.liveAbortController = null;
      }
      if (this.moviesAbortController) {
        this.moviesAbortController.abort();
        this.moviesAbortController = null;
      }
      if (this.seriesAbortController) {
        this.seriesAbortController.abort();
        this.seriesAbortController = null;
      }
      if (this.playbackAbortController) {
        this.playbackAbortController.abort();
        this.playbackAbortController = null;
      }
      if (this.seriesInfoAbortController) {
        this.seriesInfoAbortController.abort();
        this.seriesInfoAbortController = null;
      }
      this.progress = 0;
      this.isLoading = false;
      console.log('[Stalker] All pending requests aborted');
    },
  },
});
