/**
 * Application-specific Type Definitions
 */

/**
 * Provider type
 */
export type ProviderType = 'stalker' | 'xtream';

/**
 * Content type
 */
export type ContentType = 'live' | 'movies' | 'series';

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  progress: number;
  message?: string;
}

/**
 * Error state
 */
export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
  details?: any;
  canRetry: boolean;
}

/**
 * Favorite item
 */
export interface FavoriteItem {
  id: string;
  providerType: ProviderType;
  contentType: ContentType;
  name: string;
  image?: string;
  addedAt: number;
  data: any;
}

/**
 * Watch history item
 */
export interface WatchHistoryItem {
  id: string;
  providerType: ProviderType;
  contentType: ContentType;
  name: string;
  image?: string;
  watchedAt: number;
  progress: number; // 0-100
  duration?: number; // in seconds
  lastPosition?: number; // in seconds
  data: any;
}

/**
 * Stored credentials
 */
export interface StoredCredentials {
  providerType: ProviderType;
  data: string; // encrypted data
  timestamp: number;
}

/**
 * Toast notification
 */
export interface ToastNotification {
  id?: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Search result
 */
export interface SearchResult {
  id: string;
  name: string;
  type: ContentType;
  image?: string;
  description?: string;
  data: any;
}

/**
 * App configuration
 */
export interface AppConfig {
  apiTimeout: number;
  maxRetries: number;
  sessionTimeout: number;
  enableFavorites: boolean;
  enableHistory: boolean;
  debugMode: boolean;
}

/**
 * Session data
 */
export interface SessionData {
  providerType: ProviderType;
  authenticated: boolean;
  expiresAt: number;
  user?: {
    username?: string;
    status?: string;
    expDate?: string | number;
  };
}
