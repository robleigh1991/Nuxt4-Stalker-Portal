/**
 * Settings Store
 *
 * Manages user preferences with localStorage persistence
 */

import { defineStore } from 'pinia';

const STORAGE_KEY = 'iptv_settings';

interface SettingsState {
  autoPlayNextEpisode: boolean;
  isLoaded: boolean;
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    autoPlayNextEpisode: true,
    isLoaded: false,
  }),

  getters: {
    /**
     * Check if auto-play is enabled
     */
    isAutoPlayEnabled: (state) => state.autoPlayNextEpisode,
  },

  actions: {
    /**
     * Initialize settings from localStorage
     */
    init() {
      if (!process.client || this.isLoaded) return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const settings = JSON.parse(stored);
          this.autoPlayNextEpisode = settings.autoPlayNextEpisode ?? true;
        }
        this.isLoaded = true;
      } catch (error) {
        console.error('Failed to load settings:', error);
        this.autoPlayNextEpisode = true;
        this.isLoaded = true;
      }
    },

    /**
     * Save settings to localStorage
     */
    save() {
      if (!process.client) return;

      try {
        const settings = {
          autoPlayNextEpisode: this.autoPlayNextEpisode,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    },

    /**
     * Toggle auto-play setting
     */
    toggleAutoPlay() {
      this.autoPlayNextEpisode = !this.autoPlayNextEpisode;
      this.save();
    },

    /**
     * Set auto-play setting
     */
    setAutoPlay(enabled: boolean) {
      this.autoPlayNextEpisode = enabled;
      this.save();
    },
  },
});
