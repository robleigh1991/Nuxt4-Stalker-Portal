/**
 * Watch History Store
 *
 * Tracks viewing progress for VOD/Movies/Series content
 * Enables resume playback and "Continue Watching" feature
 */

import { defineStore } from 'pinia';
import type { ProviderType, ContentType } from '~/types/app';

export interface WatchHistoryItem {
  id: string; // Unique identifier
  providerType: ProviderType;
  contentType: ContentType;
  name: string;
  image?: string;
  progress: number; // 0-100
  duration?: number; // in seconds
  lastPosition?: number; // in seconds
  watchedAt: number; // timestamp
  completed: boolean; // true if watched > 90%
  data: any; // Original item data
}

const MAX_HISTORY_ITEMS = 100;

export const useWatchHistoryStore = defineStore('watchHistory', {
  state: () => ({
    history: [] as WatchHistoryItem[],
    currentAccountId: null as string | null,
    isLoaded: false,
  }),

  getters: {
    /**
     * Get all watch history sorted by most recent
     */
    all: (state) => {
      return [...state.history].sort((a, b) => b.watchedAt - a.watchedAt);
    },

    /**
     * Get continue watching items (not completed, progress > 5%)
     */
    continueWatching: (state) => {
      return state.history
        .filter((item) => !item.completed && item.progress > 5 && item.progress < 90)
        .sort((a, b) => b.watchedAt - a.watchedAt)
        .slice(0, 20);
    },

    /**
     * Get recently completed items
     */
    recentlyCompleted: (state) => {
      return state.history
        .filter((item) => item.completed)
        .sort((a, b) => b.watchedAt - a.watchedAt)
        .slice(0, 20);
    },

    /**
     * Get watch history by content type
     */
    byContentType: (state) => {
      return (contentType: ContentType) => {
        return state.history
          .filter((item) => item.contentType === contentType)
          .sort((a, b) => b.watchedAt - a.watchedAt);
      };
    },

    /**
     * Get watch progress for a specific item
     */
    getProgress: (state) => {
      return (itemId: string): WatchHistoryItem | null => {
        return state.history.find((item) => item.id === itemId) || null;
      };
    },
  },

  actions: {
    /**
     * Get storage key for current account
     */
    getStorageKey(): string {
      const accountsStore = useAccountsStore();
      const accountId = accountsStore.activeAccountId || 'default';
      this.currentAccountId = accountId;
      return `iptv_watch_history_${accountId}`;
    },

    /**
     * Initialize store - load from localStorage for active account
     */
    init() {
      if (!process.client) return;

      try {
        const storageKey = this.getStorageKey();
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          this.history = JSON.parse(stored);
        } else {
          this.history = [];
        }
        this.isLoaded = true;
        console.log('[WatchHistory] Initialized with', this.history.length, 'items for account', this.currentAccountId);
      } catch (error) {
        console.error('[WatchHistory] Failed to load:', error);
        this.history = [];
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
     * Update watch progress for an item
     */
    updateProgress(
      itemId: string,
      providerType: ProviderType,
      contentType: ContentType,
      name: string,
      currentTime: number,
      duration: number,
      data: any,
      image?: string
    ) {
      if (!process.client) return;

      // Skip live TV
      if (contentType === 'live') return;

      const progress = duration > 0 ? Math.floor((currentTime / duration) * 100) : 0;
      const completed = progress >= 90;

      const existingIndex = this.history.findIndex((item) => item.id === itemId);

      const historyItem: WatchHistoryItem = {
        id: itemId,
        providerType,
        contentType,
        name,
        image,
        progress,
        duration,
        lastPosition: currentTime,
        watchedAt: Date.now(),
        completed,
        data,
      };

      if (existingIndex >= 0) {
        // Update existing item
        this.history[existingIndex] = historyItem;
      } else {
        // Add new item
        this.history.unshift(historyItem);
      }

      // Limit history size
      if (this.history.length > MAX_HISTORY_ITEMS) {
        this.history = this.history.slice(0, MAX_HISTORY_ITEMS);
      }

      this.save();
    },

    /**
     * Mark item as completed
     */
    markCompleted(itemId: string) {
      const item = this.history.find((h) => h.id === itemId);
      if (item) {
        item.completed = true;
        item.progress = 100;
        item.watchedAt = Date.now();
        this.save();
      }
    },

    /**
     * Remove item from watch history
     */
    remove(itemId: string) {
      const index = this.history.findIndex((item) => item.id === itemId);
      if (index >= 0) {
        this.history.splice(index, 1);
        this.save();
      }
    },

    /**
     * Clear all watch history
     */
    clear() {
      if (confirm('Are you sure you want to clear all watch history?')) {
        this.history = [];
        this.save();
      }
    },

    /**
     * Clear completed items only
     */
    clearCompleted() {
      this.history = this.history.filter((item) => !item.completed);
      this.save();
    },

    /**
     * Clear continue watching items (5%-90% progress)
     */
    clearContinueWatching() {
      // Remove items in the 5%-90% range (continue watching)
      this.history = this.history.filter((item) => {
        const progress = (item.lastPosition / item.duration) * 100;
        return progress < 5 || progress >= 90;
      });
      this.save();
    },

    /**
     * Save to localStorage for current account
     */
    save() {
      if (!process.client) return;

      try {
        const storageKey = this.getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(this.history));
      } catch (error) {
        console.error('[WatchHistory] Failed to save:', error);
      }
    },

    /**
     * Get resume position for an item
     */
    getResumePosition(itemId: string): number {
      const item = this.history.find((h) => h.id === itemId);
      return item?.lastPosition || 0;
    },

    /**
     * Check if item should resume
     */
    shouldResume(itemId: string): boolean {
      const item = this.history.find((h) => h.id === itemId);
      if (!item) return false;

      // Resume if progress is between 5% and 90%
      return item.progress > 5 && item.progress < 90;
    },
  },
});
