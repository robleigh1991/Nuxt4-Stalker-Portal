/**
 * Validation schemas using Zod
 */

import { z } from 'zod';

/**
 * Stalker authentication schema
 */
export const StalkerAuthSchema = z.object({
  portalurl: z.string()
    .min(1, 'Portal URL is required')
    .url('Invalid URL format')
    .refine((url) => url.includes('/c') || url.endsWith('/c'), {
      message: 'Portal URL must end with /c',
    }),
  macaddress: z.string()
    .min(1, 'MAC address is required')
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format'),
  token: z.string().optional(),
  endpoint: z.string().optional(),
});

/**
 * Stalker ordered list schema
 */
export const StalkerOrderedListSchema = z.object({
  portalurl: z.string().url(),
  macaddress: z.string(),
  token: z.string(),
  media_type: z.enum(['itv', 'vod', 'series']),
  media_action: z.string(),
  genre_id: z.number().optional(),
  category_id: z.number().optional(),
  page: z.number().positive().optional().default(1),
});

/**
 * Stalker create link schema
 */
export const StalkerCreateLinkSchema = z.object({
  portalurl: z.string().url(),
  macaddress: z.string(),
  token: z.string(),
  cmd: z.string().min(1, 'Command is required'),
  type: z.enum(['itv', 'vod', 'series']),
  id: z.number().optional(),
});

/**
 * Stalker seasons schema
 */
export const StalkerSeasonsSchema = z.object({
  portalurl: z.string().url(),
  macaddress: z.string(),
  token: z.string(),
  series_id: z.number().positive(),
  page: z.number().positive().optional().default(1),
});

/**
 * Xtream authentication schema
 */
export const XtreamAuthSchema = z.object({
  serverUrl: z.string()
    .min(1, 'Server URL is required')
    .url('Invalid URL format'),
  username: z.string()
    .min(1, 'Username is required')
    .max(100, 'Username too long'),
  password: z.string()
    .min(1, 'Password is required')
    .max(100, 'Password too long'),
});

/**
 * Xtream categories schema
 */
export const XtreamCategoriesSchema = z.object({
  serverUrl: z.string().url(),
  username: z.string(),
  password: z.string(),
});

/**
 * Xtream streams schema
 */
export const XtreamStreamsSchema = z.object({
  serverUrl: z.string().url(),
  username: z.string(),
  password: z.string(),
  categoryId: z.string(),
});

/**
 * Xtream VOD info schema
 */
export const XtreamVodInfoSchema = z.object({
  serverUrl: z.string().url(),
  username: z.string(),
  password: z.string(),
  vodId: z.number().positive(),
});

/**
 * Xtream series info schema
 */
export const XtreamSeriesInfoSchema = z.object({
  serverUrl: z.string().url(),
  username: z.string(),
  password: z.string(),
  seriesId: z.number().positive(),
});

/**
 * Stream proxy schema
 */
export const StreamProxySchema = z.object({
  url: z.string().url('Invalid stream URL'),
  portalurl: z.string().url().optional(),
  macaddress: z.string().optional(),
  token: z.string().optional(),
  force_m3u8: z.enum(['true', 'false']).optional(),
});

/**
 * Validate request body
 */
export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw createError({
        statusCode: 400,
        message: `Validation error: ${message}`,
        data: error.errors,
      });
    }
    throw error;
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(schema: z.ZodSchema<T>, query: unknown): T {
  try {
    return schema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw createError({
        statusCode: 400,
        message: `Validation error: ${message}`,
        data: error.errors,
      });
    }
    throw error;
  }
}
