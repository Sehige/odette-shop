/**
 * Cloudinary Image Optimizer using Fetch API
 * This uses Cloudinary's fetch feature to optimize images from any URL
 * No upload required - images are fetched and transformed on-the-fly
 */

// Cloudinary cloud name - replace with your own after creating account at cloudinary.com
const CLOUDINARY_CLOUD_NAME = 'dszlfdr5f'; // Using 'demo' for testing, replace with your cloud name

/**
 * Get optimized image URL using Cloudinary's fetch API
 * @param {string} imageUrl - Original image URL (e.g., Supabase storage URL)
 * @param {object} options - Transformation options
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {string} options.quality - Image quality ('auto', 'auto:low', 'auto:good', 'auto:best')
 * @param {string} options.format - Output format ('auto', 'webp', 'avif')
 * @param {string} options.crop - Crop mode ('fill', 'fit', 'scale', 'thumb')
 * @returns {string} Optimized Cloudinary fetch URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  // If no image URL or it's not a valid URL, return as-is
  if (!imageUrl || typeof imageUrl !== 'string') {
    return imageUrl;
  }

  // Skip if already a Cloudinary URL
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // Skip if it's a local/relative URL
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
    return imageUrl;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  // Build transformation string
  const transforms = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  const transformString = transforms.join(',');

  // Encode the original URL for the fetch
  const encodedUrl = encodeURIComponent(imageUrl);

  // Cloudinary fetch URL format
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformString}/${encodedUrl}`;
};

/**
 * Get optimized image URL for category cards (square, medium size)
 */
export const getCategoryImageUrl = (imageUrl) => {
  return getOptimizedImageUrl(imageUrl, {
    width: 400,
    height: 400,
    quality: 'auto:good',
    crop: 'fill'
  });
};

/**
 * Get optimized image URL for product cards
 */
export const getProductCardImageUrl = (imageUrl) => {
  return getOptimizedImageUrl(imageUrl, {
    width: 400,
    height: 300,
    quality: 'auto:good',
    crop: 'fill'
  });
};

/**
 * Get optimized image URL for product detail page
 */
export const getProductDetailImageUrl = (imageUrl) => {
  return getOptimizedImageUrl(imageUrl, {
    width: 800,
    height: 800,
    quality: 'auto:best',
    crop: 'fill'
  });
};

/**
 * Get optimized image URL for banner images (single size, for non-hero banners)
 */
export const getBannerImageUrl = (imageUrl) => {
  return getOptimizedImageUrl(imageUrl, {
    width: 800,
    height: 600,
    quality: 'auto:good',
    crop: 'fill'
  });
};

/**
 * Get responsive banner image props for srcset
 * Use this for banners that need different sizes on mobile/desktop
 */
export const getResponsiveBannerProps = (imageUrl) => {
  const sizes = [
    { width: 480, height: 360 },   // Mobile
    { width: 800, height: 600 },   // Tablet
    { width: 1200, height: 800 },  // Desktop
  ];

  const srcSet = sizes.map(({ width, height }) => {
    const url = getOptimizedImageUrl(imageUrl, {
      width,
      height,
      quality: 'auto:good',
      crop: 'fill'
    });
    return `${url} ${width}w`;
  }).join(', ');

  const src = getOptimizedImageUrl(imageUrl, {
    width: 800,
    height: 600,
    quality: 'auto:good',
    crop: 'fill'
  });

  return {
    src,
    srcSet,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px'
  };
};

/**
 * Get hero image URLs for responsive srcset
 * Returns object with src, srcSet, and sizes for responsive loading
 */
export const getHeroImageProps = (imageUrl) => {
  const sizes = [
    { width: 640, height: 427 },   // Mobile
    { width: 1024, height: 683 },  // Tablet
    { width: 1920, height: 1280 }, // Desktop
  ];

  const srcSet = sizes.map(({ width, height }) => {
    const url = getOptimizedImageUrl(imageUrl, {
      width,
      height,
      quality: 'auto:good',
      crop: 'fill'
    });
    return `${url} ${width}w`;
  }).join(', ');

  // Default src for browsers without srcset support
  const src = getOptimizedImageUrl(imageUrl, {
    width: 1024,
    height: 683,
    quality: 'auto:good',
    crop: 'fill'
  });

  return {
    src,
    srcSet,
    sizes: '100vw' // Hero is always full viewport width
  };
};

/**
 * Get optimized thumbnail URL
 */
export const getThumbnailUrl = (imageUrl) => {
  return getOptimizedImageUrl(imageUrl, {
    width: 150,
    height: 150,
    quality: 'auto',
    crop: 'thumb'
  });
};
