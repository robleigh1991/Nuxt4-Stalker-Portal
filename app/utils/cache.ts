/**
 * API Cache Utility
 *
 * Provides intelligent caching for API responses with TTL and per-account isolation
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  totalKeys: number;
  totalSize: number;
  expired: number;
}

class ApiCache {
  private prefix = 'iptv_cache_';
  private accountId: string | null = null;

  /**
   * Set current account ID for cache isolation
   */
  setAccountId(accountId: string | null) {
    this.accountId = accountId;
  }

  /**
   * Generate cache key with account isolation
   */
  private getKey(key: string): string {
    const accountPrefix = this.accountId ? `${this.accountId}_` : 'global_';
    return `${this.prefix}${accountPrefix}${key}`;
  }

  /**
   * Set cache entry with TTL in minutes
   */
  set<T>(key: string, data: T, ttlMinutes: number): void {
    if (!process.client) return;

    try {
      const now = Date.now();
      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        expiresAt: now + (ttlMinutes * 60 * 1000),
      };

      const cacheKey = this.getKey(key);
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.warn('[Cache] Failed to set cache:', error);

      // If storage is full, clear expired entries and retry
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearExpired();
        try {
          const now = Date.now();
          const entry: CacheEntry<T> = {
            data,
            timestamp: now,
            expiresAt: now + (ttlMinutes * 60 * 1000),
          };
          localStorage.setItem(this.getKey(key), JSON.stringify(entry));
        } catch (retryError) {
          console.error('[Cache] Failed to set cache after cleanup:', retryError);
        }
      }
    }
  }

  /**
   * Get cache entry if not expired
   */
  get<T>(key: string): T | null {
    if (!process.client) return null;

    try {
      const cacheKey = this.getKey(key);
      const stored = localStorage.getItem(cacheKey);

      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);
      const now = Date.now();

      // Check if expired
      if (now > entry.expiresAt) {
        this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('[Cache] Failed to get cache:', error);
      return null;
    }
  }

  /**
   * Check if cache entry exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get cache entry age in minutes
   */
  getAge(key: string): number | null {
    if (!process.client) return null;

    try {
      const cacheKey = this.getKey(key);
      const stored = localStorage.getItem(cacheKey);

      if (!stored) return null;

      const entry: CacheEntry<any> = JSON.parse(stored);
      const now = Date.now();
      const ageMs = now - entry.timestamp;

      return Math.floor(ageMs / 1000 / 60);
    } catch (error) {
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  remove(key: string): void {
    if (!process.client) return;

    try {
      const cacheKey = this.getKey(key);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('[Cache] Failed to remove cache:', error);
    }
  }

  /**
   * Clear all cache entries for current account
   */
  clear(): void {
    if (!process.client) return;

    try {
      const accountPrefix = this.accountId ? `${this.accountId}_` : 'global_';
      const prefix = `${this.prefix}${accountPrefix}`;

      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      console.log(`[Cache] Cleared ${keysToRemove.length} cache entries`);
    } catch (error) {
      console.error('[Cache] Failed to clear cache:', error);
    }
  }

  /**
   * Clear all cache entries (all accounts)
   */
  clearAll(): void {
    if (!process.client) return;

    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      console.log(`[Cache] Cleared all ${keysToRemove.length} cache entries`);
    } catch (error) {
      console.error('[Cache] Failed to clear all cache:', error);
    }
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): number {
    if (!process.client) return 0;

    try {
      const now = Date.now();
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const entry: CacheEntry<any> = JSON.parse(stored);
              if (now > entry.expiresAt) {
                keysToRemove.push(key);
              }
            }
          } catch (e) {
            // Invalid entry, remove it
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      if (keysToRemove.length > 0) {
        console.log(`[Cache] Cleared ${keysToRemove.length} expired entries`);
      }

      return keysToRemove.length;
    } catch (error) {
      console.error('[Cache] Failed to clear expired cache:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    if (!process.client) {
      return { totalKeys: 0, totalSize: 0, expired: 0 };
    }

    try {
      const now = Date.now();
      let totalKeys = 0;
      let totalSize = 0;
      let expired = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          totalKeys++;
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length;

            try {
              const entry: CacheEntry<any> = JSON.parse(value);
              if (now > entry.expiresAt) {
                expired++;
              }
            } catch (e) {
              expired++;
            }
          }
        }
      }

      return {
        totalKeys,
        totalSize: Math.round(totalSize / 1024), // KB
        expired,
      };
    } catch (error) {
      console.error('[Cache] Failed to get stats:', error);
      return { totalKeys: 0, totalSize: 0, expired: 0 };
    }
  }

  /**
   * Invalidate cache entries matching pattern
   */
  invalidatePattern(pattern: string): number {
    if (!process.client) return 0;

    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix) && key.includes(pattern)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      if (keysToRemove.length > 0) {
        console.log(`[Cache] Invalidated ${keysToRemove.length} entries matching "${pattern}"`);
      }

      return keysToRemove.length;
    } catch (error) {
      console.error('[Cache] Failed to invalidate pattern:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

// Auto cleanup on app start
if (process.client) {
  apiCache.clearExpired();

  // Periodic cleanup every 5 minutes
  setInterval(() => {
    apiCache.clearExpired();
  }, 5 * 60 * 1000);
}
