/**
 * Favorites Store
 * 
 * Manages user's favorite content items with localStorage persistence
 */

import { defineStore } from 'pinia';
import type { FavoriteItem, ProviderType, ContentType } from '~/types/app';

const STORAGE_KEY = 'iptv_favorites';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: [] as FavoriteItem[],
    isLoaded: false,
  }),

  getters: {
    /**
     * Get all favorites
     */
    all: (state) => state.items,

    /**
     * Get favorites count
     */
    count: (state) => state.items.length,

    /**
     * Get favorites by content type
     */
    byType: (state) => (type: ContentType) => {
      return state.items.filter(item => item.contentType === type);
    },

    /**
     * Get favorites by provider
     */
    byProvider: (state) => (provider: ProviderType) => {
      return state.items.filter(item => item.providerType === provider);
    },

    /**
     * Check if item is favorited
     */
    isFavorite: (state) => (id: string) => {
      return state.items.some(item => item.id === id);
    },

    /**
     * Get favorite by ID
     */
    getById: (state) => (id: string) => {
      return state.items.find(item => item.id === id);
    },
  },

  actions: {
    /**
     * Initialize favorites from localStorage
     */
    init() {
      if (!process.client || this.isLoaded) return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.items = JSON.parse(stored);
        }
        this.isLoaded = true;
      } catch (error) {
        console.error('Failed to load favorites:', error);
        this.items = [];
        this.isLoaded = true;
      }
    },

    /**
     * Add item to favorites
     */
    add(
      id: string,
      providerType: ProviderType,
      contentType: ContentType,
      name: string,
      data: any,
      image?: string
    ) {
      if (!process.client) return;

      // Check if already favorited
      if (this.isFavorite(id)) {
        console.log('Item already in favorites');
        return;
      }

      const item: FavoriteItem = {
        id,
        providerType,
        contentType,
        name,
        image,
        addedAt: Date.now(),
        data,
      };

      this.items.unshift(item);
      this.save();

      // Show toast notification
      const toast = useToast();
      toast.add({
        title: 'Added to Favorites',
        description: `"${name}" has been added to your favorites`,
        color: 'green',
        timeout: 3000,
      });
    },

    /**
     * Remove item from favorites
     */
    remove(id: string) {
      if (!process.client) return;

      const item = this.getById(id);
      if (!item) return;

      this.items = this.items.filter(item => item.id !== id);
      this.save();

      // Show toast notification
      const toast = useToast();
      toast.add({
        title: 'Removed from Favorites',
        description: `"${item.name}" has been removed from your favorites`,
        color: 'orange',
        timeout: 3000,
      });
    },

    /**
     * Toggle favorite status
     */
    toggle(
      id: string,
      providerType: ProviderType,
      contentType: ContentType,
      name: string,
      data: any,
      image?: string
    ) {
      if (this.isFavorite(id)) {
        this.remove(id);
      } else {
        this.add(id, providerType, contentType, name, data, image);
      }
    },

    /**
     * Clear all favorites
     */
    clear() {
      if (!process.client) return;

      this.items = [];
      this.save();

      const toast = useToast();
      toast.add({
        title: 'Favorites Cleared',
        description: 'All favorites have been removed',
        color: 'orange',
      });
    },

    /**
     * Save favorites to localStorage
     */
    save() {
      if (!process.client) return;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    },

    /**
     * Export favorites
     */
    export(): string {
      return JSON.stringify(this.items, null, 2);
    },

    /**
     * Import favorites
     */
    import(data: string) {
      try {
        const imported = JSON.parse(data) as FavoriteItem[];
        
        // Validate structure
        if (!Array.isArray(imported)) {
          throw new Error('Invalid format');
        }

        this.items = imported;
        this.save();

        const toast = useToast();
        toast.add({
          title: 'Favorites Imported',
          description: `Successfully imported ${imported.length} favorites`,
          color: 'green',
        });
      } catch (error) {
        console.error('Failed to import favorites:', error);
        
        const toast = useToast();
        toast.add({
          title: 'Import Failed',
          description: 'Failed to import favorites. Invalid format.',
          color: 'red',
        });
      }
    },
  },
});
