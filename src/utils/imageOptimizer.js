/**
 * Supabase Image Optimization Utility
 *
 * Transforms Supabase storage URLs to use image transformation API
 * for optimized delivery (resized, compressed, modern formats)
 */

const SUPABASE_STORAGE_URL = 'supabase.co/storage/v1/object/public';
const SUPABASE_RENDER_URL = 'supabase.co/storage/v1/render/image/public';

/**
 * Preset sizes for common use cases
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 400, height: 400 },
  productDetail: { width: 800, height: 800 },
  hero: { width: 1200, height: 800 },
  category: { width: 600, height: 400 },
};

/**
 * Transform a Supabase storage URL to use image optimization
 *
 * @param {string} url - Original Supabase storage URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Target width in pixels
 * @param {number} options.height - Target height (optional)
 * @param {number} options.quality - Image quality 1-100 (default: 80)
 * @param {string} options.format - Output format: 'origin' | 'avif' | 'webp' (default: 'origin')
 * @param {string} options.resize - Resize mode: 'cover' | 'contain' | 'fill' (default: 'cover')
 * @returns {string} - Optimized image URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  // Return original if not a Supabase URL
  if (!url || !url.includes(SUPABASE_STORAGE_URL)) {
    return url;
  }

  const {
    width,
    height,
    quality = 80,
    format = 'origin',
    resize = 'cover',
  } = options;

  // Transform the URL to use render endpoint
  const optimizedUrl = url.replace(SUPABASE_STORAGE_URL, SUPABASE_RENDER_URL);

  // Build query parameters
  const params = new URLSearchParams();

  if (width) params.set('width', width.toString());
  if (height) params.set('height', height.toString());
  if (quality !== 80) params.set('quality', quality.toString());
  if (format !== 'origin') params.set('format', format);
  if (resize !== 'cover') params.set('resize', resize);

  const queryString = params.toString();
  return queryString ? `${optimizedUrl}?${queryString}` : optimizedUrl;
}

/**
 * Get optimized URL using a preset size
 *
 * @param {string} url - Original Supabase storage URL
 * @param {keyof IMAGE_SIZES} preset - Preset name
 * @param {Object} extraOptions - Additional options to merge
 * @returns {string} - Optimized image URL
 */
export function getOptimizedImageWithPreset(url, preset, extraOptions = {}) {
  const presetOptions = IMAGE_SIZES[preset] || IMAGE_SIZES.card;
  return getOptimizedImageUrl(url, { ...presetOptions, ...extraOptions });
}

/**
 * Generate srcSet for responsive images
 *
 * @param {string} url - Original Supabase storage URL
 * @param {number[]} widths - Array of widths for srcSet
 * @param {Object} options - Additional options
 * @returns {string} - srcSet string for img element
 */
export function generateSrcSet(url, widths = [400, 800, 1200], options = {}) {
  if (!url || !url.includes(SUPABASE_STORAGE_URL)) {
    return '';
  }

  return widths
    .map(width => {
      const optimizedUrl = getOptimizedImageUrl(url, { ...options, width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}
