import { getAllProducts, getCategories } from '../services/productService';
import { getGalleryImages } from '../services/galleryService';
import { getAllImageSettings } from '../services/imageSettingsService';

// Loaders run at build time (prerendering). A failed query throws, which fails
// the build: Vercel then keeps the previous deployment instead of shipping empty pages.
export const must = (result, what) => {
  if (result.error) {
    throw new Error(`Could not load ${what} from Supabase: ${result.error.message || result.error}`);
  }
  return result.data || [];
};

// Everything the product grid needs, for the shop page and every category page
export async function loadShopData() {
  const [products, categories, galleryImages, imageSettings] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getGalleryImages(),
    getAllImageSettings(),
  ]);
  return {
    products: must(products, 'products'),
    categories: must(categories, 'categories'),
    galleryImages: must(galleryImages, 'gallery images'),
    imageSettings: must(imageSettings, 'image settings'),
  };
}
