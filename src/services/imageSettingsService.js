/**
 * Image Settings Service
 *
 * Fetches/persists per-element image framing (focal point + zoom) used by
 * the admin in-place positioning tool. See supabase_image_settings.sql.
 *
 * Path: /src/services/imageSettingsService.js
 */

import { supabase } from '../lib/supabase';

/**
 * Get all image settings (one row per element_key)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getAllImageSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('image_settings')
      .select('*');

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching image settings:', error);
    return { data: null, error };
  }
};

/**
 * Create or update the framing for one element
 * @param {string} elementKey - e.g. 'hero', 'faq_torturi'
 * @param {{focal_x: number, focal_y: number, zoom: number}} values
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const upsertImageSetting = async (elementKey, values) => {
  try {
    const { data, error } = await supabase
      .from('image_settings')
      .upsert({
        element_key: elementKey,
        focal_x: values.focal_x,
        focal_y: values.focal_y,
        zoom: values.zoom,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error saving image setting:', error);
    return { data: null, error };
  }
};
