import { defineStore } from 'pinia';

const useStalkerStore = defineStore("stalker", {
  state: () => ({
    portalurl: null,
    macaddress: null,
    token: null,
    liveCategories: null,
    moviesCategories: null,
    seriesCategories: null,
    // Cache for items by category/genre
    liveItems: {},
    moviesItems: {},
    seriesItems: {},
    seriesSeasons: {},
    seriesEpisodes: {},
    selectedCategory: false,
    sourceUrl: null,
    currentChannel: null,
    currentMovie: null,
    currentSeries: null,
    // Loading states
    isLoading: false,
    error: null,
    progress: 0,
    modalOpen: false
  }),
  actions: {
    async setSelectedCategory(item) {
      this.selectedCategory = item;
    },
    async makeHandshake(portalurl, macaddress) {
      try {
        this.isLoading = true;
        this.error = null;
        const token = await $fetch("/api/stalker/handshake", {
          method: "POST",
          body: { portalurl, macaddress }
        });
        this.token = token;
        this.portalurl = portalurl;
        this.macaddress = macaddress;
        if (this.token) {
          return { success: true };
        }
      } catch (err) {
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
        this.getSeriesCategories()
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
            token: this.token
          }
        });
        this.liveCategories = categories.js || [];
      } catch (err) {
        console.error("Failed to load live categories:", err);
        throw err;
      }
    },
    async getLiveItems(genreId, page = 1) {
      const cacheKey = `${genreId}_${page}`;
      if (this.liveItems[cacheKey]?.length > 0) {
        return this.liveItems[cacheKey];
      }
      try {
        this.liveItems[cacheKey] = [];
        const firstPage = await $fetch("/api/stalker/orderlist", {
          method: "POST",
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            media_type: "itv",
            media_action: "get_ordered_list",
            genre_id: genreId,
            page: 1
          }
        });
        const totalItems = firstPage.total_items || 0;
        const totalPages = Math.ceil(totalItems / 14);
        const batchSize = 5;
        for (let i = 1; i <= totalPages; i += batchSize) {
          this.progress = Math.floor(i / totalPages * 100);
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
                  page: j
                }
              })
            );
          }
          const results = await Promise.all(pagePromises);
          results.forEach((result) => {
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
            token: this.token
          }
        });
        this.moviesCategories = categories.js || [];
      } catch (err) {
        console.error("Failed to load movie categories:", err);
        throw err;
      }
    },
    async getMoviesItems(categoryId, page = 1) {
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
            page: 1
          }
        });
        const totalItems = firstPage.total_items || 0;
        const totalPages = Math.ceil(totalItems / 14);
        const batchSize = 5;
        for (let i = 1; i <= totalPages; i += batchSize) {
          this.progress = Math.floor(i / totalPages * 100);
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
                  page: j
                }
              })
            );
          }
          const results = await Promise.all(pagePromises);
          results.forEach((result) => {
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
            token: this.token
          }
        });
        this.seriesCategories = categories.js || [];
      } catch (err) {
        console.error("Failed to load series categories:", err);
        throw err;
      }
    },
    async getSeriesItems(categoryId, page = 1) {
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
            page: 1
          }
        });
        const totalItems = firstPage.total_items || 0;
        const totalPages = Math.ceil(totalItems / 14);
        const batchSize = 5;
        for (let i = 1; i <= totalPages; i += batchSize) {
          this.progress = Math.floor(i / totalPages * 100);
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
                  page: j
                }
              })
            );
          }
          const results = await Promise.all(pagePromises);
          results.forEach((result) => {
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
    async getSeriesSeasons(seriesId) {
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
            page: 1
          }
        });
        this.seriesSeasons[cacheKey] = seasons.js?.data || [];
        return this.seriesSeasons[cacheKey];
      } catch (err) {
        console.error("Failed to load series seasons:", err);
        throw err;
      }
    },
    async createLink(cmd, type) {
      try {
        const link = await $fetch("/api/stalker/createlink", {
          method: "POST",
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            cmd,
            type
          }
        });
        this.sourceUrl = link.replace(/ /g, "");
        return this.sourceUrl;
      } catch (err) {
        console.error("Failed to create link:", err);
        throw err;
      }
    },
    async createSeriesLink(cmd, type, id) {
      try {
        const link = await $fetch("/api/stalker/createserieslink", {
          method: "POST",
          body: {
            portalurl: this.portalurl,
            macaddress: this.macaddress,
            token: this.token,
            cmd,
            type,
            id
          }
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
    }
  }
});

export { useStalkerStore as u };
//# sourceMappingURL=stalker-F4Itg4Zv.mjs.map
