import { defineStore } from "pinia";

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
    selectedCategory: false as any,
    sourceUrl: null as string | null,
    currentChannel: null as any | null,
    currentMovie: null as any | null,
    currentSeries: null as any | null,
    // Loading states
    isLoading: false,
    error: null as string | null,
    progress: 0,
    modalOpen: false,
  }),

  actions: {
    async setSelectedCategory(item: any) {
      this.selectedCategory = item;
    },

    async makeHandshake(portalurl: string, macaddress: string) {
      try {
        this.isLoading = true;
        this.error = null;

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

    async getAllInfo() {
      await Promise.all([
        this.getLiveCategories(),
        this.getMoviesCategories(),
        this.getSeriesCategories(),
      ]);

      this.selectedCategory = this.liveCategories[1];
      this.liveItems[this.selectedCategory.id + "_1"] = await this.getLiveItems(
        this.selectedCategory.id
      );
      return "done";
    },

    async getLiveCategories() {
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
      } catch (err) {
        console.error("Failed to load live categories:", err);
        throw err;
      }
    },

    async getLiveItems(genreId: number, page = 1) {
      const cacheKey = `${genreId}_${page}`;

      // Return cached items if available
      if (this.liveItems[cacheKey]?.length > 0) {
        return this.liveItems[cacheKey];
      }

      try {
        // Initialize array for this cache key
        this.liveItems[cacheKey] = [];
        // Get first page to determine total pages
        const firstPage = await $fetch("/api/stalker/orderlist", {
          method: "POST",
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

        // Fetch all pages in parallel (max 5 at a time to avoid overwhelming)
        const batchSize = 5;
        for (let i = 1; i <= totalPages; i += batchSize) {
          this.progress = Math.floor((i / totalPages) * 100);
          const pagePromises = [];
          for (let j = i; j < Math.min(i + batchSize, totalPages + 1); j++) {
            pagePromises.push(
              $fetch("/api/stalker/orderlist", {
                method: "POST",
                body: {
                  portalurl: this.portalurl,
                  macaddress: this.macaddress,
                  token: this.token,
                  media_type: "itv",
                  media_action: "get_ordered_list",
                  genre_id: genreId,
                  page: j,
                },
              })
            );
          }

          const results = await Promise.all(pagePromises);
          results.forEach((result: any) => {
            if (result.data) {
              this.liveItems[cacheKey].push(...result.data);
            }
          });
        }

        this.progress = 0;
        return this.liveItems[cacheKey];
      } catch (err) {
        console.error("Failed to load live items:", err);
        throw err;
      }
    },

    async getMoviesCategories() {
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
      } catch (err) {
        console.error("Failed to load movie categories:", err);
        throw err;
      }
    },

    async getMoviesItems(categoryId: number, page = 1) {
      const cacheKey = `${categoryId}_${page}`;

      if (this.moviesItems[cacheKey]?.length > 0) {
        return this.moviesItems[cacheKey];
      }

      try {
        this.moviesItems[cacheKey] = [];

        const firstPage = await $fetch("/api/stalker/orderlist", {
          method: "POST",
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
          this.progress = Math.floor((i / totalPages) * 100);
          const pagePromises = [];
          for (let j = i; j < Math.min(i + batchSize, totalPages + 1); j++) {
            pagePromises.push(
              $fetch("/api/stalker/orderlist", {
                method: "POST",
                body: {
                  portalurl: this.portalurl,
                  macaddress: this.macaddress,
                  token: this.token,
                  media_type: "vod",
                  media_action: "get_ordered_list",
                  category_id: categoryId,
                  page: j,
                },
              })
            );
          }

          const results = await Promise.all(pagePromises);
          results.forEach((result: any) => {
            if (result.data) {
              this.moviesItems[cacheKey].push(...result.data);
            }
          });
        }

        this.progress = 0;
        return this.moviesItems[cacheKey];
      } catch (err) {
        console.error("Failed to load movie items:", err);
        throw err;
      }
    },

    async getSeriesCategories() {
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
      } catch (err) {
        console.error("Failed to load series categories:", err);
        throw err;
      }
    },

    async getSeriesItems(categoryId: number, page = 1) {
      const cacheKey = `${categoryId}_${page}`;

      if (this.seriesItems[cacheKey]?.length > 0) {
        return this.seriesItems[cacheKey];
      }

      try {
        this.seriesItems[cacheKey] = [];

        const firstPage = await $fetch("/api/stalker/orderlist", {
          method: "POST",
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
          this.progress = Math.floor((i / totalPages) * 100);
          const pagePromises = [];
          for (let j = i; j < Math.min(i + batchSize, totalPages + 1); j++) {
            pagePromises.push(
              $fetch("/api/stalker/orderlist", {
                method: "POST",
                body: {
                  portalurl: this.portalurl,
                  macaddress: this.macaddress,
                  token: this.token,
                  media_type: "series",
                  media_action: "get_ordered_list",
                  category_id: categoryId,
                  page: j,
                },
              })
            );
          }

          const results = await Promise.all(pagePromises);
          results.forEach((result: any) => {
            if (result.data) {
              this.seriesItems[cacheKey].push(...result.data);
            }
          });
        }

        this.progress = 0;
        return this.seriesItems[cacheKey];
      } catch (err) {
        console.error("Failed to load series items:", err);
        throw err;
      }
    },

    async getSeriesSeasons(seriesId: number) {
      const cacheKey = `${seriesId}_seasons`;

      if (this.seriesSeasons[cacheKey]) {
        return this.seriesSeasons[cacheKey];
      }

      try {
        const seasons = await $fetch("/api/stalker/seasons", {
          method: "POST",
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
      } catch (err) {
        console.error("Failed to load series seasons:", err);
        throw err;
      }
    },

    async createLink(cmd: string, type: string) {
      try {
        const link = await $fetch("/api/stalker/createlink", {
          method: "POST",
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
      } catch (err) {
        console.error("Failed to create link:", err);
        throw err;
      }
    },

    async createSeriesLink(cmd: string, type: string, id: number) {
      try {
        const link = await $fetch("/api/stalker/createserieslink", {
          method: "POST",
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
      } catch (err) {
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
    },
  },
});
