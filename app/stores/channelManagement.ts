/**
 * Channel Management Store
 *
 * Manages favorite channels, hidden channels, and recently watched
 */

import { defineStore } from 'pinia';
import type { ProviderType } from '~/types/app';

export interface ChannelInfo {
  id: string; // Unique channel identifier
  providerType: ProviderType;
  name: string;
  logo?: string;
  data: any; // Original channel data
}

export interface RecentChannel extends ChannelInfo {
  watchedAt: number;
}

const MAX_RECENT = 20;

export const useChannelManagementStore = defineStore('channelManagement', {
  state: () => ({
    favoriteChannels: [] as string[], // Array of channel IDs
    hiddenChannels: [] as string[], // Array of channel IDs
    hiddenCategories: [] as string[], // Array of category IDs
    recentChannels: [] as RecentChannel[],
    lastChannel: null as ChannelInfo | null,
    currentAccountId: null as string | null,
    isLoaded: false,
  }),

  getters: {
    /**
     * Check if channel is favorite
     */
    isFavorite: (state) => {
      return (channelId: string) => state.favoriteChannels.includes(channelId);
    },

    /**
     * Check if channel is hidden
     */
    isHidden: (state) => {
      return (channelId: string) => state.hiddenChannels.includes(channelId);
    },

    /**
     * Check if category is hidden
     */
    isCategoryHidden: (state) => {
      return (categoryId: string) => state.hiddenCategories.includes(categoryId);
    },

    /**
     * Get recent channels sorted by most recent
     */
    recent: (state) => {
      return [...state.recentChannels].sort((a, b) => b.watchedAt - a.watchedAt);
    },

    /**
     * Get favorite count
     */
    favoritesCount: (state) => state.favoriteChannels.length,

    /**
     * Get hidden count
     */
    hiddenCount: (state) => state.hiddenChannels.length,

    /**
     * Get hidden categories count
     */
    hiddenCategoriesCount: (state) => state.hiddenCategories.length,
  },

  actions: {
    /**
     * Get storage keys for current account
     */
    getStorageKeys() {
      const accountsStore = useAccountsStore();
      const accountId = accountsStore.activeAccountId || 'default';
      this.currentAccountId = accountId;
      return {
        favorites: `iptv_favorite_channels_${accountId}`,
        hidden: `iptv_hidden_channels_${accountId}`,
        hiddenCategories: `iptv_hidden_categories_${accountId}`,
        recent: `iptv_recent_channels_${accountId}`,
        last: `iptv_last_channel_${accountId}`,
      };
    },

    /**
     * Initialize store for active account
     */
    init() {
      if (!process.client) return;

      try {
        const keys = this.getStorageKeys();

        // Load favorites
        const favorites = localStorage.getItem(keys.favorites);
        if (favorites) {
          this.favoriteChannels = JSON.parse(favorites);
        } else {
          this.favoriteChannels = [];
        }

        // Load hidden channels
        const hidden = localStorage.getItem(keys.hidden);
        if (hidden) {
          this.hiddenChannels = JSON.parse(hidden);
        } else {
          this.hiddenChannels = [];
        }

        // Load hidden categories
        const hiddenCats = localStorage.getItem(keys.hiddenCategories);
        if (hiddenCats) {
          this.hiddenCategories = JSON.parse(hiddenCats);
        } else {
          this.hiddenCategories = [];
        }

        // Load recent channels
        const recent = localStorage.getItem(keys.recent);
        if (recent) {
          this.recentChannels = JSON.parse(recent);
        } else {
          this.recentChannels = [];
        }

        // Load last channel
        const last = localStorage.getItem(keys.last);
        if (last) {
          this.lastChannel = JSON.parse(last);
        } else {
          this.lastChannel = null;
        }

        this.isLoaded = true;
        console.log('[ChannelManagement] Initialized for account', this.currentAccountId);
      } catch (error) {
        console.error('[ChannelManagement] Failed to initialize:', error);
      }
    },

    /**
     * Reload when account changes
     */
    reloadForAccount() {
      this.isLoaded = false;
      this.init();
    },

    /**
     * Toggle channel favorite
     */
    toggleFavorite(channelId: string) {
      const index = this.favoriteChannels.indexOf(channelId);

      if (index >= 0) {
        // Remove from favorites
        this.favoriteChannels.splice(index, 1);
      } else {
        // Add to favorites
        this.favoriteChannels.push(channelId);
      }

      this.saveFavorites();
    },

    /**
     * Add to favorites
     */
    addFavorite(channelId: string) {
      if (!this.favoriteChannels.includes(channelId)) {
        this.favoriteChannels.push(channelId);
        this.saveFavorites();
      }
    },

    /**
     * Remove from favorites
     */
    removeFavorite(channelId: string) {
      const index = this.favoriteChannels.indexOf(channelId);
      if (index >= 0) {
        this.favoriteChannels.splice(index, 1);
        this.saveFavorites();
      }
    },

    /**
     * Clear all favorites
     */
    clearFavorites() {
      this.favoriteChannels = [];
      this.saveFavorites();
    },

    /**
     * Toggle channel hidden
     */
    toggleHidden(channelId: string) {
      const index = this.hiddenChannels.indexOf(channelId);

      if (index >= 0) {
        // Unhide
        this.hiddenChannels.splice(index, 1);
      } else {
        // Hide
        this.hiddenChannels.push(channelId);
      }

      this.saveHidden();
    },

    /**
     * Hide channel
     */
    hideChannel(channelId: string) {
      if (!this.hiddenChannels.includes(channelId)) {
        this.hiddenChannels.push(channelId);
        this.saveHidden();
      }
    },

    /**
     * Unhide channel
     */
    unhideChannel(channelId: string) {
      const index = this.hiddenChannels.indexOf(channelId);
      if (index >= 0) {
        this.hiddenChannels.splice(index, 1);
        this.saveHidden();
      }
    },

    /**
     * Clear all hidden channels
     */
    clearHidden() {
      this.hiddenChannels = [];
      this.saveHidden();
    },

    /**
     * Toggle category hidden
     */
    toggleCategoryHidden(categoryId: string) {
      const index = this.hiddenCategories.indexOf(categoryId);

      if (index >= 0) {
        // Unhide
        this.hiddenCategories.splice(index, 1);
      } else {
        // Hide
        this.hiddenCategories.push(categoryId);
      }

      this.saveHiddenCategories();
    },

    /**
     * Hide category
     */
    hideCategory(categoryId: string) {
      if (!this.hiddenCategories.includes(categoryId)) {
        this.hiddenCategories.push(categoryId);
        this.saveHiddenCategories();
      }
    },

    /**
     * Unhide category
     */
    unhideCategory(categoryId: string) {
      const index = this.hiddenCategories.indexOf(categoryId);
      if (index >= 0) {
        this.hiddenCategories.splice(index, 1);
        this.saveHiddenCategories();
      }
    },

    /**
     * Clear all hidden categories
     */
    clearHiddenCategories() {
      this.hiddenCategories = [];
      this.saveHiddenCategories();
    },

    /**
     * Add to recent channels
     */
    addToRecent(channel: ChannelInfo) {
      if (!process.client) return;

      const channelId = channel.id;

      // Remove if already exists
      const existingIndex = this.recentChannels.findIndex(c => c.id === channelId);
      if (existingIndex >= 0) {
        this.recentChannels.splice(existingIndex, 1);
      }

      // Add to beginning
      const recentChannel: RecentChannel = {
        ...channel,
        watchedAt: Date.now(),
      };

      this.recentChannels.unshift(recentChannel);

      // Limit size
      if (this.recentChannels.length > MAX_RECENT) {
        this.recentChannels = this.recentChannels.slice(0, MAX_RECENT);
      }

      this.saveRecent();
    },

    /**
     * Set last channel
     */
    setLastChannel(channel: ChannelInfo | null) {
      this.lastChannel = channel;
      this.saveLastChannel();
    },

    /**
     * Swap to last channel
     */
    getLastChannel(): ChannelInfo | null {
      return this.lastChannel;
    },

    /**
     * Clear recent channels
     */
    clearRecent() {
      this.recentChannels = [];
      this.saveRecent();
    },

    /**
     * Save favorites to localStorage for current account
     */
    saveFavorites() {
      if (!process.client) return;

      try {
        const keys = this.getStorageKeys();
        localStorage.setItem(keys.favorites, JSON.stringify(this.favoriteChannels));
      } catch (error) {
        console.error('[ChannelManagement] Failed to save favorites:', error);
      }
    },

    /**
     * Save hidden to localStorage for current account
     */
    saveHidden() {
      if (!process.client) return;

      try {
        const keys = this.getStorageKeys();
        localStorage.setItem(keys.hidden, JSON.stringify(this.hiddenChannels));
      } catch (error) {
        console.error('[ChannelManagement] Failed to save hidden:', error);
      }
    },

    /**
     * Save hidden categories to localStorage for current account
     */
    saveHiddenCategories() {
      if (!process.client) return;

      try {
        const keys = this.getStorageKeys();
        localStorage.setItem(keys.hiddenCategories, JSON.stringify(this.hiddenCategories));
      } catch (error) {
        console.error('[ChannelManagement] Failed to save hidden categories:', error);
      }
    },

    /**
     * Save recent to localStorage for current account
     */
    saveRecent() {
      if (!process.client) return;

      try {
        const keys = this.getStorageKeys();
        localStorage.setItem(keys.recent, JSON.stringify(this.recentChannels));
      } catch (error) {
        console.error('[ChannelManagement] Failed to save recent:', error);
      }
    },

    /**
     * Save last channel to localStorage for current account
     */
    saveLastChannel() {
      if (!process.client) return;

      try {
        const keys = this.getStorageKeys();
        if (this.lastChannel) {
          localStorage.setItem(keys.last, JSON.stringify(this.lastChannel));
        } else {
          localStorage.removeItem(keys.last);
        }
      } catch (error) {
        console.error('[ChannelManagement] Failed to save last channel:', error);
      }
    },

    /**
     * Filter channels (remove hidden channels and channels from hidden categories)
     */
    filterChannels(channels: any[], providerType?: ProviderType): any[] {
      if (!channels) return [];

      return channels.filter((channel) => {
        // Check if channel itself is hidden
        const channelId = this.generateChannelId(channel, providerType);
        if (this.isHidden(channelId)) return false;

        // Check if channel's category is hidden
        const categoryId = this.generateCategoryId(channel, providerType);
        if (categoryId && this.isCategoryHidden(categoryId)) return false;

        return true;
      });
    },

    /**
     * Generate channel ID from channel data
     */
    generateChannelId(channel: any, providerType?: ProviderType): string {
      const provider = providerType || (useStalkerStore().token ? 'stalker' : 'xtream');
      const id = channel.stream_id || channel.id;
      return `${provider}_${id}`;
    },

    /**
     * Generate category ID from channel data
     */
    generateCategoryId(channel: any, providerType?: ProviderType): string | null {
      const provider = providerType || (useStalkerStore().token ? 'stalker' : 'xtream');
      const categoryId = channel.category_id;
      if (!categoryId) return null;
      return `${provider}_cat_${categoryId}`;
    },

    /**
     * Generate category ID from category data
     */
    generateCategoryIdFromCategory(category: any, providerType?: ProviderType): string {
      const provider = providerType || (useStalkerStore().token ? 'stalker' : 'xtream');
      const categoryId = category.category_id || category.id;
      return `${provider}_cat_${categoryId}`;
    },
  },
});
