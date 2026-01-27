/**
 * Centralized Error Handling System
 * 
 * This module provides typed error classes and utilities for consistent
 * error handling across the application.
 */

import type { ErrorState } from '~/types/app';

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly canRetry: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    code: string,
    statusCode = 500,
    canRetry = false,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.canRetry = canRetry;
    this.details = details;
  }
}

/**
 * Network error - connection issues
 */
export class NetworkError extends AppError {
  constructor(message = 'Network connection error', details?: any) {
    super(
      message,
      'NETWORK_ERROR',
      0,
      true, // Can retry network errors
      details
    );
    this.name = 'NetworkError';
  }
}

/**
 * Authentication error - invalid credentials
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', details?: any) {
    super(
      message,
      'AUTH_ERROR',
      401,
      false, // Cannot retry with same credentials
      details
    );
    this.name = 'AuthenticationError';
  }
}

/**
 * Timeout error - request took too long
 */
export class TimeoutError extends AppError {
  constructor(message = 'Request timeout', details?: any) {
    super(
      message,
      'TIMEOUT_ERROR',
      408,
      true, // Can retry timeout errors
      details
    );
    this.name = 'TimeoutError';
  }
}

/**
 * Server error - API returned error
 */
export class ServerError extends AppError {
  constructor(
    message = 'Server error',
    statusCode = 500,
    details?: any
  ) {
    super(
      message,
      'SERVER_ERROR',
      statusCode,
      statusCode >= 500, // Retry only on 5xx errors
      details
    );
    this.name = 'ServerError';
  }
}

/**
 * Validation error - invalid input
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation error', details?: any) {
    super(
      message,
      'VALIDATION_ERROR',
      400,
      false, // Cannot retry without fixing input
      details
    );
    this.name = 'ValidationError';
  }
}

/**
 * Stream error - playback issues
 */
export class StreamError extends AppError {
  constructor(message = 'Stream playback error', details?: any) {
    super(
      message,
      'STREAM_ERROR',
      0,
      true, // Can retry stream errors
      details
    );
    this.name = 'StreamError';
  }
}

/**
 * Not found error - resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: any) {
    super(
      message,
      'NOT_FOUND',
      404,
      false,
      details
    );
    this.name = 'NotFoundError';
  }
}

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  redirectOnAuth?: boolean;
  customMessage?: string;
}

/**
 * Handle error and convert to ErrorState
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): ErrorState {
  const {
    showToast = true,
    logToConsole = true,
    customMessage,
  } = options;

  let errorState: ErrorState;

  // Handle AppError instances
  if (error instanceof AppError) {
    errorState = {
      hasError: true,
      message: customMessage || error.message,
      code: error.code,
      details: error.details,
      canRetry: error.canRetry,
    };

    if (logToConsole) {
      console.error(`[${error.code}]`, error.message, error.details);
    }
  }
  // Handle fetch errors
  else if (error instanceof TypeError && error.message.includes('fetch')) {
    errorState = {
      hasError: true,
      message: customMessage || 'Network connection error. Please check your internet connection.',
      code: 'NETWORK_ERROR',
      canRetry: true,
    };

    if (logToConsole) {
      console.error('[NETWORK_ERROR]', error);
    }
  }
  // Handle generic errors
  else if (error instanceof Error) {
    errorState = {
      hasError: true,
      message: customMessage || error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      canRetry: false,
    };

    if (logToConsole) {
      console.error('[UNKNOWN_ERROR]', error);
    }
  }
  // Handle unknown errors
  else {
    errorState = {
      hasError: true,
      message: customMessage || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      canRetry: false,
      details: error,
    };

    if (logToConsole) {
      console.error('[UNKNOWN_ERROR]', error);
    }
  }

  // Show toast notification
  if (showToast && process.client) {
    const toast = useToast();
    toast.add({
      title: 'Error',
      description: errorState.message,
      color: 'red',
      timeout: errorState.canRetry ? 5000 : 0,
    });
  }

  return errorState;
}

/**
 * Create user-friendly error message based on error type
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AuthenticationError) {
    return 'Invalid credentials. Please check your username and password.';
  }
  if (error instanceof NetworkError) {
    return 'Connection lost. Please check your internet connection and try again.';
  }
  if (error instanceof TimeoutError) {
    return 'Request took too long. Please try again.';
  }
  if (error instanceof ServerError) {
    return 'Server is experiencing issues. Please try again later.';
  }
  if (error instanceof ValidationError) {
    return 'Invalid input. Please check your information and try again.';
  }
  if (error instanceof StreamError) {
    return 'Unable to play stream. The content may be unavailable.';
  }
  if (error instanceof NotFoundError) {
    return 'Content not found. It may have been removed.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Retry helper with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on certain errors
      if (
        error instanceof AuthenticationError ||
        error instanceof ValidationError ||
        error instanceof NotFoundError
      ) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: ErrorHandlerOptions = {}
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      return null;
    }
  };
}

/**
 * Create error from HTTP response
 */
export function createErrorFromResponse(
  statusCode: number,
  message?: string,
  details?: any
): AppError {
  if (statusCode === 401 || statusCode === 403) {
    return new AuthenticationError(message || 'Authentication failed', details);
  }
  if (statusCode === 404) {
    return new NotFoundError(message || 'Resource not found', details);
  }
  if (statusCode === 408) {
    return new TimeoutError(message || 'Request timeout', details);
  }
  if (statusCode >= 400 && statusCode < 500) {
    return new ValidationError(message || 'Invalid request', details);
  }
  if (statusCode >= 500) {
    return new ServerError(message || 'Server error', statusCode, details);
  }
  return new AppError(
    message || 'Unknown error',
    'UNKNOWN_ERROR',
    statusCode,
    false,
    details
  );
}
