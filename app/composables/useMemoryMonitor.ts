/**
 * Memory Monitoring Composable
 * 
 * Provides real-time memory usage monitoring and automatic cleanup triggers
 */

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export function useMemoryMonitor() {
  const stalkerStore = useStalkerStore();
  const xtreamStore = useXtreamStore();
  const toast = useToast();
  
  const memoryUsage = ref(0); // in MB
  const memoryLimit = ref(0); // in MB
  const memoryPercentage = computed(() => {
    if (memoryLimit.value === 0) return 0;
    return Math.round((memoryUsage.value / memoryLimit.value) * 100);
  });
  
  const isHighMemory = computed(() => memoryPercentage.value > 70);
  const isCriticalMemory = computed(() => memoryPercentage.value > 85);
  
  let monitorInterval: NodeJS.Timeout | null = null;
  let lastCleanupTime = 0;
  const CLEANUP_COOLDOWN = 60000; // 1 minute between cleanups
  
  /**
   * Check current memory usage
   */
  const checkMemory = (): MemoryInfo | null => {
    if (!process.client) return null;
    
    // Check if browser supports performance.memory
    const perf = performance as any;
    if (!perf.memory) {
      console.warn('[Memory Monitor] performance.memory not available');
      return null;
    }
    
    const memory = perf.memory as MemoryInfo;
    memoryUsage.value = Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
    memoryLimit.value = Math.round(memory.jsHeapSizeLimit / 1048576);
    
    return memory;
  };
  
  /**
   * Trigger cleanup if memory is high
   */
  const triggerCleanup = (force = false) => {
    const now = Date.now();
    
    // Prevent too frequent cleanups
    if (!force && now - lastCleanupTime < CLEANUP_COOLDOWN) {
      return;
    }
    
    console.log('[Memory Monitor] Triggering cache cleanup');
    
    // Clear old caches from both stores
    stalkerStore.clearOldCache();
    xtreamStore.clearOldCache();
    
    // Get stats
    const stalkerStats = stalkerStore.getCacheStats();
    const xtreamStats = xtreamStore.getCacheStats();
    
    console.log('[Memory Monitor] Cache stats after cleanup:', {
      stalker: stalkerStats,
      xtream: xtreamStats,
    });
    
    lastCleanupTime = now;
    
    toast.add({
      title: 'Memory Optimized',
      description: 'Cache cleared to improve performance',
      color: 'green',
      timeout: 3000,
    });
  };
  
  /**
   * Start monitoring memory
   */
  const startMonitoring = (intervalMs = 10000) => {
    if (!process.client) return;
    
    // Initial check
    checkMemory();
    
    // Start interval monitoring
    monitorInterval = setInterval(() => {
      const memory = checkMemory();
      
      if (!memory) return;
      
      // Log memory usage in debug mode
      const config = useRuntimeConfig();
      if (config.public.debugMode) {
        console.log('[Memory Monitor]', {
          used: `${memoryUsage.value}MB`,
          limit: `${memoryLimit.value}MB`,
          percentage: `${memoryPercentage.value}%`,
        });
      }
      
      // Trigger cleanup if memory is high
      if (isCriticalMemory.value) {
        console.warn('[Memory Monitor] CRITICAL memory usage:', memoryPercentage.value + '%');
        triggerCleanup();
      } else if (isHighMemory.value) {
        console.warn('[Memory Monitor] HIGH memory usage:', memoryPercentage.value + '%');
        // Gentle cleanup for high memory
        stalkerStore.clearOldCache();
        xtreamStore.clearOldCache();
      }
    }, intervalMs);
    
    console.log('[Memory Monitor] Started monitoring');
  };
  
  /**
   * Stop monitoring
   */
  const stopMonitoring = () => {
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
      console.log('[Memory Monitor] Stopped monitoring');
    }
  };
  
  /**
   * Get detailed memory stats
   */
  const getDetailedStats = () => {
    const memory = checkMemory();
    if (!memory) return null;
    
    const stalkerStats = stalkerStore.getCacheStats();
    const xtreamStats = xtreamStore.getCacheStats();
    
    return {
      memory: {
        used: memoryUsage.value,
        limit: memoryLimit.value,
        percentage: memoryPercentage.value,
        usedBytes: memory.usedJSHeapSize,
        totalBytes: memory.totalJSHeapSize,
      },
      cache: {
        stalker: stalkerStats,
        xtream: xtreamStats,
        total: stalkerStats.totalItems + xtreamStats.totalItems,
      },
      status: isCriticalMemory.value ? 'critical' : isHighMemory.value ? 'high' : 'normal',
    };
  };
  
  /**
   * Format bytes to human readable
   */
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };
  
  // Cleanup on unmount
  onUnmounted(() => {
    stopMonitoring();
  });
  
  return {
    // State
    memoryUsage: readonly(memoryUsage),
    memoryLimit: readonly(memoryLimit),
    memoryPercentage,
    isHighMemory,
    isCriticalMemory,
    
    // Methods
    checkMemory,
    startMonitoring,
    stopMonitoring,
    triggerCleanup,
    getDetailedStats,
    formatBytes,
  };
}
