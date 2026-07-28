/**
 * Gallery Service
 *
 * Database operations for the cake gallery (past-work photos shown as a
 * carousel on the Shop page). Mirrors the shape of productService.
 *
 * Path: /src/services/galleryService.js
 */

import { supabase } from '../config/supabaseClient';

/**
 * Fetch all active gallery images, ordered for display.
 *
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getGalleryImages = async () => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('isActive', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return { data: [], error };
  }
};
