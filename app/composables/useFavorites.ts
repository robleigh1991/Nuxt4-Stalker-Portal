/**
 * Favorites composable
 * 
 * Provides easy access to favorites functionality in components
 */

import type { ProviderType, ContentType } from '~/types/app';

export const useFavorites = () => {
  const favoritesStore = useFavoritesStore();
  const config = useRuntimeConfig();

  // Initialize on first use
  if (!favoritesStore.isLoaded) {
    favoritesStore.init();
  }

  /**
   * Check if favorites feature is enabled
   */
  const isEnabled = computed(() => config.public.enableFavorites);

  /**
   * Add to favorites
   */
  const add = (
    id: string,
    providerType: ProviderType,
    contentType: ContentType,
    name: string,
    data: any,
    image?: string
  ) => {
    if (!isEnabled.value) {
      console.warn('Favorites feature is disabled');
      return;
    }
    favoritesStore.add(id, providerType, contentType, name, data, image);
  };

  /**
   * Remove from favorites
   */
  const remove = (id: string) => {
    favoritesStore.remove(id);
  };

  /**
   * Toggle favorite status
   */
  const toggle = (
    id: string,
    providerType: ProviderType,
    contentType: ContentType,
    name: string,
    data: any,
    image?: string
  ) => {
    if (!isEnabled.value) {
      console.warn('Favorites feature is disabled');
      return;
    }
    favoritesStore.toggle(id, providerType, contentType, name, data, image);
  };

  /**
   * Check if item is favorited
   */
  const isFavorite = (id: string) => {
    return favoritesStore.isFavorite(id);
  };

  /**
   * Get all favorites
   */
  const all = computed(() => favoritesStore.all);

  /**
   * Get favorites by type
   */
  const byType = (type: ContentType) => {
    return favoritesStore.byType(type);
  };

  /**
   * Get favorites count
   */
  const count = computed(() => favoritesStore.count);

  /**
   * Clear all favorites
   */
  const clear = () => {
    favoritesStore.clear();
  };

  return {
    isEnabled,
    add,
    remove,
    toggle,
    isFavorite,
    all,
    byType,
    count,
    clear,
  };
};
