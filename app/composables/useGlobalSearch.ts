/**
 * Global Search composable
 *
 * Provides unified search across all content types and providers with fuzzy matching
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
   * Fuzzy matching algorithm
   * Returns score (0-1) where higher means better match
   */
  const fuzzyMatch = (query: string, target: string): number => {
    if (!query || !target) return 0;

    const lowerQuery = query.toLowerCase().trim();
    const lowerTarget = target.toLowerCase().trim();

    // Exact match gets highest score
    if (lowerTarget === lowerQuery) return 1;

    // Starts with gets very high score
    if (lowerTarget.startsWith(lowerQuery)) return 0.9;

    // Contains exact substring gets high score
    if (lowerTarget.includes(lowerQuery)) return 0.8;

    // Fuzzy character-by-character matching
    let queryIndex = 0;
    let targetIndex = 0;
    let matches = 0;
    let consecutiveMatches = 0;
    let maxConsecutive = 0;

    while (queryIndex < lowerQuery.length && targetIndex < lowerTarget.length) {
      if (lowerQuery[queryIndex] === lowerTarget[targetIndex]) {
        matches++;
        consecutiveMatches++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
        queryIndex++;
      } else {
        consecutiveMatches = 0;
      }
      targetIndex++;
    }

    // If not all query characters found, no match
    if (queryIndex < lowerQuery.length) return 0;

    // Calculate score based on:
    // - Percentage of characters matched
    // - Length of consecutive matches
    // - Position of first match (earlier is better)
    const matchRatio = matches / lowerQuery.length;
    const consecutiveBonus = maxConsecutive / lowerQuery.length;
    const positionPenalty = (targetIndex - lowerQuery.length) / lowerTarget.length;

    const score = (matchRatio * 0.5) + (consecutiveBonus * 0.3) + ((1 - positionPenalty) * 0.2);

    return score;
  };

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
   * Search Stalker content with fuzzy matching
   */
  const searchStalker = (query: string): SearchResult[] => {
    const results: { result: SearchResult; score: number }[] = [];
    const MIN_SCORE = 0.3; // Minimum fuzzy match score

    // Search live channels
    Object.values(stalkerStore.liveItems).forEach((items: any[]) => {
      items.forEach(item => {
        if (item.name) {
          const score = fuzzyMatch(query, item.name);
          if (score >= MIN_SCORE) {
            results.push({
              result: {
                id: `stalker_live_${item.id}`,
                name: item.name,
                type: 'live',
                image: item.logo ? `https://proxy.duckduckgo.com/iu/?u=${item.logo}` : undefined,
                description: item.description,
                data: item,
              },
              score,
            });
          }
        }
      });
    });

    // Search movies
    Object.values(stalkerStore.moviesItems).forEach((items: any[]) => {
      items.forEach(item => {
        if (item.name) {
          const score = fuzzyMatch(query, item.name);
          if (score >= MIN_SCORE) {
            results.push({
              result: {
                id: `stalker_movie_${item.id}`,
                name: item.name,
                type: 'movies',
                image: item.screenshot_uri ? `https://proxy.duckduckgo.com/iu/?u=${item.screenshot_uri}` : undefined,
                description: item.description,
                data: item,
              },
              score,
            });
          }
        }
      });
    });

    // Search series
    Object.values(stalkerStore.seriesItems).forEach((items: any[]) => {
      items.forEach(item => {
        if (item.name) {
          const score = fuzzyMatch(query, item.name);
          if (score >= MIN_SCORE) {
            results.push({
              result: {
                id: `stalker_series_${item.id}`,
                name: item.name,
                type: 'series',
                image: item.screenshot_uri || item.cover ? `https://proxy.duckduckgo.com/iu/?u=${item.screenshot_uri || item.cover}` : undefined,
                description: item.description,
                data: item,
              },
              score,
            });
          }
        }
      });
    });

    // Sort by score (highest first) and return just the results
    return results
      .sort((a, b) => b.score - a.score)
      .map(r => r.result);
  };

  /**
   * Search Xtream content with fuzzy matching
   */
  const searchXtream = (query: string): SearchResult[] => {
    const results: { result: SearchResult; score: number }[] = [];
    const MIN_SCORE = 0.3; // Minimum fuzzy match score

    // Search live streams
    Object.values(xtreamStore.liveStreams).forEach((streams: any[]) => {
      streams.forEach(stream => {
        if (stream.name) {
          const score = fuzzyMatch(query, stream.name);
          if (score >= MIN_SCORE) {
            results.push({
              result: {
                id: `xtream_live_${stream.stream_id}`,
                name: stream.name,
                type: 'live',
                image: stream.stream_icon,
                data: stream,
              },
              score,
            });
          }
        }
      });
    });

    // Search VOD
    Object.values(xtreamStore.vodStreams).forEach((streams: any[]) => {
      streams.forEach(stream => {
        if (stream.name) {
          const score = fuzzyMatch(query, stream.name);
          if (score >= MIN_SCORE) {
            results.push({
              result: {
                id: `xtream_vod_${stream.stream_id}`,
                name: stream.name,
                type: 'movies',
                image: stream.stream_icon || stream.cover,
                description: stream.plot,
                data: stream,
              },
              score,
            });
          }
        }
      });
    });

    // Search series
    Object.values(xtreamStore.seriesStreams).forEach((streams: any[]) => {
      streams.forEach(stream => {
        if (stream.name) {
          const score = fuzzyMatch(query, stream.name);
          if (score >= MIN_SCORE) {
            results.push({
              result: {
                id: `xtream_series_${stream.series_id}`,
                name: stream.name,
                type: 'series',
                image: stream.cover,
                description: stream.plot,
                data: stream,
              },
              score,
            });
          }
        }
      });
    });

    // Sort by score (highest first) and return just the results
    return results
      .sort((a, b) => b.score - a.score)
      .map(r => r.result);
  };

  /**
   * Perform search with fuzzy matching
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

      // Results are already sorted by fuzzy match score
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
