/**
 * Global Search composable
 * 
 * Provides unified search across all content types and providers
 */

import type { SearchResult, ProviderType } from '~/types/app';

export const useGlobalSearch = () => {
  const stalkerStore = useStalkerStore();
  const xtreamStore = useXtreamStore();
  
  const isSearching = ref(false);
  const searchQuery = ref('');
  const results = ref<SearchResult[]>([]);
  const searchHistory = ref<string[]>([]);

  const HISTORY_KEY = 'iptv_search_history';
  const MAX_HISTORY = 10;

  /**
   * Get current provider
   */
  const getCurrentProvider = (): ProviderType | null => {
    if (stalkerStore.token) return 'stalker';
    if (xtreamStore.isAuthenticated) return 'xtream';
    return null;
  };

  /**
   * Load search history from localStorage
   */
  const loadSearchHistory = () => {
    if (!process.client) return;

    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        searchHistory.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  /**
   * Save search query to history
   */
  const saveToHistory = (query: string) => {
    if (!process.client || !query.trim()) return;

    // Remove if already exists
    searchHistory.value = searchHistory.value.filter(q => q !== query);
    
    // Add to beginning
    searchHistory.value.unshift(query);
    
    // Limit size
    if (searchHistory.value.length > MAX_HISTORY) {
      searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY);
    }

    // Save to localStorage
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory.value));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  /**
   * Clear search history
   */
  const clearSearchHistory = () => {
    if (!process.client) return;
    
    searchHistory.value = [];
    localStorage.removeItem(HISTORY_KEY);
  };

  /**
   * Search Stalker content
   */
  const searchStalker = (query: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search live channels
    Object.values(stalkerStore.liveItems).forEach((items: any[]) => {
      items.forEach(item => {
        if (item.name?.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `stalker_live_${item.id}`,
            name: item.name,
            type: 'live',
            image: item.logo ? `https://proxy.duckduckgo.com/iu/?u=${item.logo}` : undefined,
            description: item.description,
            data: item,
          });
        }
      });
    });

    // Search movies
    Object.values(stalkerStore.moviesItems).forEach((items: any[]) => {
      items.forEach(item => {
        if (item.name?.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `stalker_movie_${item.id}`,
            name: item.name,
            type: 'movies',
            image: item.screenshot_uri ? `https://proxy.duckduckgo.com/iu/?u=${item.screenshot_uri}` : undefined,
            description: item.description,
            data: item,
          });
        }
      });
    });

    // Search series
    Object.values(stalkerStore.seriesItems).forEach((items: any[]) => {
      items.forEach(item => {
        if (item.name?.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `stalker_series_${item.id}`,
            name: item.name,
            type: 'series',
            image: item.screenshot_uri || item.cover ? `https://proxy.duckduckgo.com/iu/?u=${item.screenshot_uri || item.cover}` : undefined,
            description: item.description,
            data: item,
          });
        }
      });
    });

    return results;
  };

  /**
   * Search Xtream content
   */
  const searchXtream = (query: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search live streams
    Object.values(xtreamStore.liveStreams).forEach((streams: any[]) => {
      streams.forEach(stream => {
        if (stream.name?.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `xtream_live_${stream.stream_id}`,
            name: stream.name,
            type: 'live',
            image: stream.stream_icon,
            data: stream,
          });
        }
      });
    });

    // Search VOD
    Object.values(xtreamStore.vodStreams).forEach((streams: any[]) => {
      streams.forEach(stream => {
        if (stream.name?.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `xtream_vod_${stream.stream_id}`,
            name: stream.name,
            type: 'movies',
            image: stream.stream_icon || stream.cover,
            description: stream.plot,
            data: stream,
          });
        }
      });
    });

    // Search series
    Object.values(xtreamStore.seriesStreams).forEach((streams: any[]) => {
      streams.forEach(stream => {
        if (stream.name?.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `xtream_series_${stream.series_id}`,
            name: stream.name,
            type: 'series',
            image: stream.cover,
            description: stream.plot,
            data: stream,
          });
        }
      });
    });

    return results;
  };

  /**
   * Perform search
   */
  const search = async (query: string) => {
    if (!query.trim()) {
      results.value = [];
      return;
    }

    isSearching.value = true;
    searchQuery.value = query;

    try {
      const provider = getCurrentProvider();
      let searchResults: SearchResult[] = [];

      if (provider === 'stalker') {
        searchResults = searchStalker(query);
      } else if (provider === 'xtream') {
        searchResults = searchXtream(query);
      }

      // Sort by relevance (exact matches first, then starts with, then contains)
      const lowerQuery = query.toLowerCase();
      searchResults.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName === lowerQuery && bName !== lowerQuery) return -1;
        if (bName === lowerQuery && aName !== lowerQuery) return 1;
        if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery)) return -1;
        if (bName.startsWith(lowerQuery) && !aName.startsWith(lowerQuery)) return 1;
        return aName.localeCompare(bName);
      });

      results.value = searchResults;
      
      // Save to history if we found results
      if (searchResults.length > 0) {
        saveToHistory(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      results.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  /**
   * Clear search results
   */
  const clear = () => {
    searchQuery.value = '';
    results.value = [];
  };

  /**
   * Debounced search
   */
  let searchTimeout: NodeJS.Timeout | null = null;
  const debouncedSearch = (query: string, delay = 300) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      search(query);
    }, delay);
  };

  // Load search history on init
  if (process.client) {
    loadSearchHistory();
  }

  return {
    isSearching: readonly(isSearching),
    searchQuery: readonly(searchQuery),
    results: readonly(results),
    searchHistory: readonly(searchHistory),
    search,
    debouncedSearch,
    clear,
    clearSearchHistory,
  };
};
