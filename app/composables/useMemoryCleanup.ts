/**
 * Memory cleanup composable for aggressive memory management
 */
export const useMemoryCleanup = () => {
  const stalker = useStalkerStore();
  const xtream = useXtreamStore();

  let cleanupInterval: NodeJS.Timeout | null = null;
  let memoryCheckInterval: NodeJS.Timeout | null = null;

  // Hard memory limit: 1GB
  const MEMORY_HARD_LIMIT = 1024 * 1024 * 1024; // 1GB in bytes
  const MEMORY_WARNING_THRESHOLD = 0.85; // 85% of limit
  const MEMORY_CRITICAL_THRESHOLD = 0.95; // 95% of limit

  /**
   * Clear EPG data older than 30 minutes
   */
  const clearOldEPGData = () => {
    const now = Date.now();
    const MAX_EPG_AGE = 30 * 60 * 1000; // 30 minutes

    // Clear Stalker EPG
    Object.keys(stalker.epgData).forEach((key) => {
      const epgEntries = stalker.epgData[key];
      if (epgEntries && Array.isArray(epgEntries)) {
        // Keep only recent EPG data
        stalker.epgData[key] = epgEntries.filter((entry: any) => {
          const entryTime = new Date(entry.start || entry.t_time).getTime();
          return now - entryTime < MAX_EPG_AGE;
        });

        // Remove empty arrays
        if (stalker.epgData[key].length === 0) {
          delete stalker.epgData[key];
        }
      }
    });

    // Clear Xtream EPG
    Object.keys(xtream.epgData).forEach((key) => {
      const epgEntries = xtream.epgData[key];
      if (epgEntries && Array.isArray(epgEntries)) {
        xtream.epgData[key] = epgEntries.filter((entry: any) => {
          const entryTime = new Date(entry.start || entry.start_timestamp).getTime();
          return now - entryTime < MAX_EPG_AGE;
        });

        if (xtream.epgData[key].length === 0) {
          delete xtream.epgData[key];
        }
      }
    });
  };

  /**
   * Force garbage collection hint for browser
   */
  const triggerGarbageCollection = () => {
    // Clear references
    if (typeof window !== 'undefined') {
      // Force layout recalculation to help GC
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);
      tempDiv.offsetHeight; // Force reflow
      document.body.removeChild(tempDiv);
    }
  };

  /**
   * Clear inactive category data more aggressively
   */
  const clearInactiveData = () => {
    stalker.clearOldCache();

    // Also clear EPG data
    clearOldEPGData();

    // Trigger GC hint
    triggerGarbageCollection();

    console.log('[Memory Cleanup] Cleared inactive data');
  };

  /**
   * Start automatic memory cleanup and monitoring
   */
  const startAutoCleanup = () => {
    if (cleanupInterval) return;

    // Run cleanup every 2 minutes
    cleanupInterval = setInterval(() => {
      clearInactiveData();
    }, 2 * 60 * 1000);

    // Monitor memory every 10 seconds for 1GB hard limit
    memoryCheckInterval = setInterval(() => {
      monitorMemory();
    }, 10 * 1000);

    // Run initial memory check
    monitorMemory();

    console.log('[Memory Cleanup] Auto-cleanup and monitoring started (Hard limit: 1GB)');
  };

  /**
   * Stop automatic memory cleanup
   */
  const stopAutoCleanup = () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }

    if (memoryCheckInterval) {
      clearInterval(memoryCheckInterval);
      memoryCheckInterval = null;
    }

    console.log('[Memory Cleanup] Auto-cleanup stopped');
  };

  /**
   * Get current memory usage
   */
  const getCurrentMemory = (): number => {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  };

  /**
   * Check if memory usage exceeds threshold
   */
  const checkMemoryUsage = (): { exceeded: boolean; percentage: number; level: 'safe' | 'warning' | 'critical' | 'exceeded' } => {
    const currentMemory = getCurrentMemory();
    const percentage = currentMemory / MEMORY_HARD_LIMIT;

    if (currentMemory >= MEMORY_HARD_LIMIT) {
      return { exceeded: true, percentage, level: 'exceeded' };
    }
    if (percentage >= MEMORY_CRITICAL_THRESHOLD) {
      return { exceeded: false, percentage, level: 'critical' };
    }
    if (percentage >= MEMORY_WARNING_THRESHOLD) {
      return { exceeded: false, percentage, level: 'warning' };
    }
    return { exceeded: false, percentage, level: 'safe' };
  };

  /**
   * Clear service worker image cache
   */
  const clearServiceWorkerCache = async () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const imageCaches = cacheNames.filter((name) => name.startsWith('iptv-images-'));
        await Promise.all(imageCaches.map((name) => caches.delete(name)));
        console.log('[Memory Cleanup] Cleared service worker image cache');
      } catch (error) {
        console.error('[Memory Cleanup] Failed to clear SW cache:', error);
      }
    }
  };

  /**
   * Emergency memory cleanup - keeps ONLY current view data
   */
  const emergencyCleanup = async () => {
    console.warn('[Memory Cleanup] 🚨 EMERGENCY CLEANUP - Memory limit reached!');

    // Keep ONLY the currently visible category
    const currentCategoryKey = stalker.selectedCategory
      ? `${stalker.selectedCategory.id}_1`
      : null;

    // Clear ALL data except current category
    const liveKeys = Object.keys(stalker.liveItems);
    const moviesKeys = Object.keys(stalker.moviesItems);
    const seriesKeys = Object.keys(stalker.seriesItems);

    liveKeys.forEach((key) => {
      if (key !== currentCategoryKey) {
        delete stalker.liveItems[key];
      }
    });

    moviesKeys.forEach((key) => {
      if (key !== currentCategoryKey) {
        delete stalker.moviesItems[key];
      }
    });

    seriesKeys.forEach((key) => {
      if (key !== currentCategoryKey) {
        delete stalker.seriesItems[key];
      }
    });

    // Clear ALL EPG data (it can be refetched)
    stalker.epgData = {};
    xtream.epgData = {};

    // Clear ALL series data
    stalker.seriesSeasons = {};
    stalker.seriesEpisodes = {};

    // Clear Xtream data
    Object.keys(xtream.liveStreams).forEach((key) => {
      if (key !== `cat_${stalker.selectedCategory?.id}`) {
        delete xtream.liveStreams[key];
      }
    });

    Object.keys(xtream.vodStreams).forEach((key) => {
      delete xtream.vodStreams[key];
    });

    Object.keys(xtream.seriesStreams).forEach((key) => {
      delete xtream.seriesStreams[key];
    });

    // Clear last accessed tracking
    stalker.cacheConfig.lastAccessed = {};

    // Clear service worker image cache
    await clearServiceWorkerCache();

    // Force multiple GC hints
    for (let i = 0; i < 3; i++) {
      setTimeout(() => triggerGarbageCollection(), i * 100);
    }

    console.log('[Memory Cleanup] Emergency cleanup complete');
  };

  /**
   * Clear all non-essential data immediately
   */
  const clearAllCache = async () => {
    // Keep current category data but clear everything else
    const currentLiveCategoryKey = stalker.selectedCategory
      ? `${stalker.selectedCategory.id}_1`
      : null;

    // Clear all except current category
    Object.keys(stalker.liveItems).forEach((key) => {
      if (key !== currentLiveCategoryKey) {
        delete stalker.liveItems[key];
      }
    });

    Object.keys(stalker.moviesItems).forEach((key) => {
      if (key !== currentLiveCategoryKey) {
        delete stalker.moviesItems[key];
      }
    });

    Object.keys(stalker.seriesItems).forEach((key) => {
      if (key !== currentLiveCategoryKey) {
        delete stalker.seriesItems[key];
      }
    });

    // Clear all EPG data
    stalker.epgData = {};
    xtream.epgData = {};

    // Clear series data
    stalker.seriesSeasons = {};
    stalker.seriesEpisodes = {};

    // Clear last accessed tracking
    stalker.cacheConfig.lastAccessed = {};

    // Clear service worker image cache (50% of oldest entries)
    await clearServiceWorkerCache();

    triggerGarbageCollection();

    console.log('[Memory Cleanup] All cache cleared');
  };

  /**
   * Monitor memory and auto-cleanup when needed
   */
  const monitorMemory = () => {
    const { exceeded, percentage, level } = checkMemoryUsage();
    const memoryMB = Math.round(getCurrentMemory() / (1024 * 1024));

    if (exceeded || level === 'critical') {
      console.warn(`[Memory Monitor] 🚨 ${level.toUpperCase()}: ${memoryMB}MB / 1024MB (${Math.round(percentage * 100)}%)`);
      emergencyCleanup();
    } else if (level === 'warning') {
      console.warn(`[Memory Monitor] ⚠️  Warning: ${memoryMB}MB / 1024MB (${Math.round(percentage * 100)}%)`);
      clearInactiveData();
    }
  };

  return {
    clearOldEPGData,
    clearInactiveData,
    clearAllCache,
    emergencyCleanup,
    startAutoCleanup,
    stopAutoCleanup,
    getCurrentMemory,
    checkMemoryUsage,
    MEMORY_HARD_LIMIT,
  };
};
