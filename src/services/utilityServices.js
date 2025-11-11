// ========================================
// UTILITY SERVICES (Reviews, Custom Orders, Newsletter, Contact)
// ========================================

import { supabase } from '../lib/supabase'

/**
 * Review Service
 * Handles product reviews and ratings
 */
export const reviewService = {
  /**
   * Submit a product review
   * @param {Object} reviewData - Review information
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async submitReview(reviewData) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: reviewData.product_id,
          user_id: reviewData.user_id,
          order_id: reviewData.order_id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          is_verified_purchase: reviewData.order_id ? true : false
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error submitting review:', error)
      return { data: null, error }
    }
  },

  /**
   * Upload review images
   * @param {string} reviewId - Review ID
   * @param {Array<File>} images - Image files
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async uploadReviewImages(reviewId, images) {
    try {
      const uploadedImages = []

      for (const image of images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${reviewId}/${Date.now()}.${fileExt}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(fileName, image)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('review-images')
          .getPublicUrl(fileName)

        // Save to database
        const { data, error } = await supabase
          .from('review_images')
          .insert({
            review_id: reviewId,
            image_url: urlData.publicUrl
          })
          .select()
          .single()

        if (error) throw error

        uploadedImages.push(data)
      }

      return { data: uploadedImages, error: null }
    } catch (error) {
      console.error('Error uploading review images:', error)
      return { data: null, error }
    }
  },

  /**
   * Update a review
   * @param {string} reviewId - Review ID
   * @param {Object} updates - Review updates
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateReview(reviewId, updates) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating review:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async deleteReview(reviewId) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error deleting review:', error)
      return { data: null, error }
    }
  },

  /**
   * Mark review as helpful
   * @param {string} reviewId - Review ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async markHelpful(reviewId) {
    try {
      // Increment helpful count
      const { data, error } = await supabase
        .rpc('increment_helpful_count', { review_id: reviewId })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error marking review as helpful:', error)
      return { data: null, error }
    }
  },

  /**
   * Get user's reviews
   * @param {string} userId - User ID
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getUserReviews(userId) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products (
            name_ro,
            name_en,
            slug,
            product_images!inner (
              image_url,
              is_primary
            )
          ),
          review_images (
            image_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      return { data: null, error }
    }
  }
}

/**
 * Custom Order Service
 * Handles custom order requests for events
 */
export const customOrderService = {
  /**
   * Submit a custom order request
   * @param {Object} requestData - Custom order information
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async submitRequest(requestData) {
    try {
      const { data, error } = await supabase
        .from('custom_order_requests')
        .insert(requestData)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error submitting custom order request:', error)
      return { data: null, error }
    }
  },

  /**
   * Upload inspiration images for custom order
   * @param {string} requestId - Custom order request ID
   * @param {Array<File>} images - Image files
   * @param {string} userId - User ID
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async uploadInspirationImages(requestId, images, userId) {
    try {
      const uploadedImages = []

      for (const image of images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${userId}/${requestId}/${Date.now()}.${fileExt}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('custom-order-images')
          .upload(fileName, image)

        if (uploadError) throw uploadError

        // Get public URL (will be private, only accessible by user/admin)
        const { data: urlData } = supabase.storage
          .from('custom-order-images')
          .getPublicUrl(fileName)

        // Save to database
        const { data, error } = await supabase
          .from('custom_order_images')
          .insert({
            custom_order_id: requestId,
            image_url: urlData.publicUrl
          })
          .select()
          .single()

        if (error) throw error

        uploadedImages.push(data)
      }

      return { data: uploadedImages, error: null }
    } catch (error) {
      console.error('Error uploading inspiration images:', error)
      return { data: null, error }
    }
  },

  /**
   * Get user's custom order requests
   * @param {string} userId - User ID
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getUserRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('custom_order_requests')
        .select(`
          *,
          custom_order_images (
            image_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching custom order requests:', error)
      return { data: null, error }
    }
  },

  /**
   * Get custom order request by ID
   * @param {string} requestId - Request ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getRequestById(requestId) {
    try {
      const { data, error } = await supabase
        .from('custom_order_requests')
        .select(`
          *,
          custom_order_images (
            image_url
          )
        `)
        .eq('id', requestId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching custom order request:', error)
      return { data: null, error }
    }
  },

  /**
   * Update custom order status
   * @param {string} requestId - Request ID
   * @param {string} status - New status
   * @param {Object} updates - Additional updates
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateRequestStatus(requestId, status, updates = {}) {
    try {
      const { data, error } = await supabase
        .from('custom_order_requests')
        .update({
          status,
          ...updates
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating custom order status:', error)
      return { data: null, error }
    }
  }
}

/**
 * Newsletter Service
 * Handles newsletter subscriptions
 */
export const newsletterService = {
  /**
   * Subscribe to newsletter
   * @param {string} email - Subscriber email
   * @param {Object} options - Additional options
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async subscribe(email, options = {}) {
    try {
      // Check if already subscribed
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id, is_active')
        .eq('email', email)
        .single()

      if (existing) {
        if (existing.is_active) {
          return { 
            data: existing, 
            error: { message: 'Email already subscribed' }
          }
        } else {
          // Re-subscribe if previously unsubscribed
          const { data, error } = await supabase
            .from('newsletter_subscribers')
            .update({
              is_active: true,
              unsubscribed_at: null
            })
            .eq('id', existing.id)
            .select()
            .single()

          if (error) throw error
          return { data, error: null }
        }
      }

      // New subscription
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          full_name: options.full_name || null,
          source: options.source || 'website',
          preferred_language: options.preferred_language || 'ro'
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      return { data: null, error }
    }
  },

  /**
   * Unsubscribe from newsletter
   * @param {string} email - Subscriber email
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async unsubscribe(email) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error)
      return { data: null, error }
    }
  },

  /**
   * Check if email is subscribed
   * @param {string} email - Email to check
   * @returns {Promise<{subscribed: boolean, error: Error|null}>}
   */
  async isSubscribed(email) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('is_active')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { 
        subscribed: data ? data.is_active : false, 
        error: null 
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      return { subscribed: false, error }
    }
  }
}

/**
 * Contact Service
 * Handles contact form submissions
 */
export const contactService = {
  /**
   * Submit contact form
   * @param {Object} formData - Contact form data
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async submitContactForm(formData) {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      return { data: null, error }
    }
  }
}

/**
 * Settings Service
 * Handles site settings
 */
export const settingsService = {
  /**
   * Get site setting
   * @param {string} key - Setting key
   * @returns {Promise<{data: any, error: Error|null}>}
   */
  async getSetting(key) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', key)
        .single()

      if (error) throw error

      return { data: data.setting_value, error: null }
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error)
      return { data: null, error }
    }
  },

  /**
   * Get multiple settings
   * @param {Array<string>} keys - Array of setting keys
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getSettings(keys) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', keys)

      if (error) throw error

      // Convert to object
      const settings = {}
      data.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value
      })

      return { data: settings, error: null }
    } catch (error) {
      console.error('Error fetching settings:', error)
      return { data: null, error }
    }
  },

  /**
   * Update site setting (admin only)
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateSetting(key, value) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating setting:', error)
      return { data: null, error }
    }
  }
}

export default {
  reviewService,
  customOrderService,
  newsletterService,
  contactService,
  settingsService
}