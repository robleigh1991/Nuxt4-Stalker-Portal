/**
 * Image Proxy Composable
 *
 * Uses images.weserv.nl free proxy service to ensure all images load
 * Handles CORS issues and unreliable external image sources
 */

export const useImageProxy = () => {
  /**
   * Proxy an image URL through images.weserv.nl
   * @param url - Original image URL
   * @param options - Proxy options (width, height, quality)
   * @returns Proxied URL or fallback
   */
  const proxyImage = (
    url: string | null | undefined,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    } = {}
  ): string => {
    // Return fallback if no URL provided
    if (!url || url.trim() === '') {
      return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
    }

    // If already a data URL or SVG, return as-is
    if (url.startsWith('data:') || url.endsWith('.svg')) {
      return url;
    }

    // If it's a relative URL or already from weserv, return as-is
    if (url.startsWith('/') || url.includes('images.weserv.nl')) {
      return url;
    }

    try {
      // Build proxy URL with parameters
      const params = new URLSearchParams();

      // Add the image URL (must be properly encoded)
      params.append('url', url);

      // Add dimensions if provided
      if (options.width) {
        params.append('w', options.width.toString());
      }
      if (options.height) {
        params.append('h', options.height.toString());
      }

      // Add quality (default 80)
      params.append('q', (options.quality || 80).toString());

      // Add fit mode (default cover)
      params.append('fit', options.fit || 'cover');

      // Default format to webp for better compression
      params.append('output', 'webp');

      // Fallback to original if proxy fails
      params.append('default', url);

      return `https://images.weserv.nl/?${params.toString()}`;
    } catch (error) {
      console.error('Failed to proxy image:', error);
      return url; // Return original URL if proxy fails
    }
  };

  /**
   * Get a placeholder image URL
   */
  const getPlaceholder = () => {
    return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
  };

  return {
    proxyImage,
    getPlaceholder,
  };
};
