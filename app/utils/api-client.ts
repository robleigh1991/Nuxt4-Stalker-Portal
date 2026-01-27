/**
 * Centralized API Client
 * 
 * Provides a unified interface for making HTTP requests with:
 * - Automatic retry logic
 * - Timeout handling
 * - Error transformation
 * - Request cancellation
 */

// Note: NetworkError, TimeoutError, ServerError, AuthenticationError,
// createErrorFromResponse, retryWithBackoff are auto-imported from app/utils/error-handler.ts

/**
 * API request options
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
  maxRetries?: number;
  signal?: AbortSignal;
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl?: string;
  timeout: number;
  maxRetries: number;
  headers?: Record<string, string>;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ApiClientConfig = {
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Create API client with configuration
 */
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Make an API request
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = this.config.timeout,
      retry = true,
      maxRetries = this.config.maxRetries,
      signal,
    } = options;

    // Build URL
    const url = this.config.baseUrl
      ? `${this.config.baseUrl}${endpoint}`
      : endpoint;

    // Build request options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...this.config.headers,
        ...headers,
      },
      signal,
    };

    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Create fetch function with timeout
    const fetchWithTimeout = async (): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: signal || controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new TimeoutError(`Request timeout after ${timeout}ms`);
        }
        throw new NetworkError('Network request failed', error);
      }
    };

    // Execute request with or without retry
    const response = retry
      ? await retryWithBackoff(fetchWithTimeout, maxRetries)
      : await fetchWithTimeout();

    // Handle response
    return this.handleResponse<T>(response);
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage: string;
      let errorDetails: any;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || response.statusText;
        errorDetails = errorData;
      } catch {
        errorMessage = response.statusText;
      }

      throw createErrorFromResponse(response.status, errorMessage, errorDetails);
    }

    // Parse response
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      
      if (contentType?.includes('text/')) {
        return await response.text() as any;
      }

      return await response.blob() as any;
    } catch (error) {
      throw new ServerError('Failed to parse response', 500, error);
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }
}

/**
 * Create default API client instance
 */
export const apiClient = new ApiClient();

/**
 * Composable for using API client
 */
export const useApiClient = () => {
  const config = useRuntimeConfig();
  
  return new ApiClient({
    timeout: config.public.apiTimeout || 30000,
    maxRetries: config.public.maxRetries || 3,
  });
};
