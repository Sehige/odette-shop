/**
 * Newsletter Service
 *
 * Handles all database operations for newsletter subscriptions.
 * Follows the same pattern as productService.js
 *
 * Path: /src/services/newsletterService.js
 */

import { supabase } from '../config/supabaseClient';

/**
 * Subscribe a user to the newsletter
 *
 * @param {Object} subscriberData - Subscriber information
 * @param {string} subscriberData.email - Email address
 * @param {string} subscriberData.name - Full name
 * @param {string} subscriberData.language - Language preference ('ro' or 'en')
 * @returns {Promise<{data: Object|null, error: Error|null, isDuplicate: boolean}>}
 */
export const subscribeToNewsletter = async ({ email, name, language = 'ro' }) => {
  try {
    // First, check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('email, is_active')
      .eq('email', email.toLowerCase())
      .maybeSingle(); // Returns null if not found, doesn't throw error

    if (checkError) throw checkError;

    // If email exists and is active, return duplicate flag
    if (existing && existing.is_active) {
      return {
        data: null,
        error: null,
        isDuplicate: true
      };
    }

    // If email exists but is inactive, reactivate it
    if (existing && !existing.is_active) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: true,
          name: name.trim(),
          language: language,
          updated_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase())
        .select()
        .single();

      if (error) throw error;

      return { data, error: null, isDuplicate: false };
    }

    // Otherwise, insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase(),
          name: name.trim(),
          language: language,
          subscribed_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null, isDuplicate: false };

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { data: null, error, isDuplicate: false };
  }
};

/**
 * Unsubscribe a user from the newsletter (soft delete)
 *
 * @param {string} email - Email address to unsubscribe
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const unsubscribeFromNewsletter = async (email) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return { data: null, error };
  }
};

/**
 * Get all active newsletter subscribers (admin only)
 *
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getAllSubscribers = async () => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };

  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return { data: null, error };
  }
};

/**
 * Get subscriber count
 *
 * @returns {Promise<{count: number, error: Error|null}>}
 */
export const getSubscriberCount = async () => {
  try {
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) throw error;

    return { count, error: null };

  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    return { count: 0, error };
  }
};
