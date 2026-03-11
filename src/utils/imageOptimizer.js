/**
 * Cloudinary Image Optimization via Fetch
 *
 * Uses Cloudinary's fetch feature to optimize images from any URL
 * Free tier: 25GB bandwidth/month
 */

const CLOUDINARY_CLOUD_NAME = 'demo'; // Using Cloudinary's demo account for testing

/**
 * Optimize any image URL through Cloudinary
 *
 * @param {string} url - Original image URL (e.g., Supabase)
 * @param {Object} options - Transformation options
 * @param {number} options.width - Target width
 * @param {number} options.quality - Quality 1-100 (default: auto)
 * @param {string} options.format - Format: 'auto', 'webp', 'avif' (default: auto)
 * @returns {string} - Optimized image URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url) return url;

  const {
    width = 400,
    quality = 'auto',
    format = 'auto',
  } = options;

  // Build Cloudinary transformation string
  const transforms = [
    `w_${width}`,
    `q_${quality}`,
    `f_${format}`,
    'c_fill', // Crop mode: fill
  ].join(',');

  // Cloudinary fetch URL format
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transforms}/${encodeURIComponent(url)}`;
}
