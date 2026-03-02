/**
 * Settings Store
 *
 * Manages user preferences with localStorage persistence
 */

import { defineStore } from 'pinia';
import { hash } from '~/utils/crypto';

const STORAGE_KEY = 'iptv_settings';

interface ParentalControlSettings {
  enabled: boolean;
  pinHash: string | null;
  sessionTimeout: number; // minutes, 0 = always ask
  hideAdultCategories: boolean;
}

interface SettingsState {
  autoPlayNextEpisode: boolean;
  isLoaded: boolean;
  parentalControl: ParentalControlSettings;
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    autoPlayNextEpisode: true,
    isLoaded: false,
    parentalControl: {
      enabled: false,
      pinHash: null,
      sessionTimeout: 30,
      hideAdultCategories: false,
    },
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

          // Load parental control settings
          if (settings.parentalControl) {
            this.parentalControl = {
              enabled: settings.parentalControl.enabled ?? false,
              pinHash: settings.parentalControl.pinHash ?? null,
              sessionTimeout: settings.parentalControl.sessionTimeout ?? 30,
              hideAdultCategories: settings.parentalControl.hideAdultCategories ?? false,
            };
          }
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
          parentalControl: this.parentalControl,
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

    /**
     * Set parental control PIN
     */
    async setPin(pin: string) {
      const pinHash = await hash(pin);
      this.parentalControl.pinHash = pinHash;
      this.parentalControl.enabled = true;
      this.save();
    },

    /**
     * Verify parental control PIN
     */
    async verifyPin(pin: string): Promise<boolean> {
      if (!this.parentalControl.pinHash) return false;
      const inputHash = await hash(pin);
      return inputHash === this.parentalControl.pinHash;
    },

    /**
     * Remove parental control PIN
     */
    async removePin(pin: string): Promise<boolean> {
      const valid = await this.verifyPin(pin);
      if (!valid) return false;

      this.parentalControl.pinHash = null;
      this.parentalControl.enabled = false;
      this.save();
      return true;
    },

    /**
     * Set session timeout duration
     */
    setSessionTimeout(minutes: number) {
      this.parentalControl.sessionTimeout = minutes;
      this.save();
    },

    /**
     * Toggle hide adult categories setting
     */
    toggleHideAdultCategories() {
      this.parentalControl.hideAdultCategories = !this.parentalControl.hideAdultCategories;
      this.save();
    },

    /**
     * Enable/disable parental controls
     */
    setParentalControlEnabled(enabled: boolean) {
      this.parentalControl.enabled = enabled;
      this.save();
    },
  },
});
