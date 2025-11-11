// ========================================
// AUTHENTICATION & USER API SERVICE
// ========================================

import { supabase } from '../lib/supabase'

/**
 * Auth Service
 * Handles all authentication operations
 */
export const authService = {
  /**
   * Sign up new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user data
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name || '',
            phone: metadata.phone || '',
            preferred_language: metadata.preferred_language || 'ro'
          }
        }
      })

      if (error) throw error

      // Create profile after successful signup
      if (data.user) {
        await this.createProfile(data.user.id, {
          email: data.user.email,
          full_name: metadata.full_name,
          phone: metadata.phone,
          preferred_language: metadata.preferred_language || 'ro'
        })
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error }
    }
  },

  /**
   * Sign in user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    }
  },

  /**
   * Sign in with social provider (Google, Facebook, etc.)
   * @param {string} provider - Provider name
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async signInWithProvider(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      return { data: null, error }
    }
  },

  /**
   * Sign out user
   * @returns {Promise<{error: Error|null}>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    }
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { data: null, error }
    }
  },

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating password:', error)
      return { data: null, error }
    }
  },

  /**
   * Get current session
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error getting session:', error)
      return { data: null, error }
    }
  },

  /**
   * Get current user
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) throw error

      return { data: user, error: null }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { data: null, error }
    }
  },

  /**
   * Create user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async createProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          ...profileData
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating profile:', error)
      return { data: null, error }
    }
  },

  /**
   * Listen for auth state changes
   * @param {Function} callback - Callback function
   * @returns {Object} Subscription object
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

/**
 * Profile Service
 * Handles user profile operations
 */
export const profileService = {
  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  },

  /**
   * Get user addresses
   * @param {string} userId - User ID
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getAddresses(userId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      return { data: null, error }
    }
  },

  /**
   * Add new address
   * @param {string} userId - User ID
   * @param {Object} addressData - Address information
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async addAddress(userId, addressData) {
    try {
      // If this is default address, unset other defaults
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          ...addressData
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error adding address:', error)
      return { data: null, error }
    }
  },

  /**
   * Update address
   * @param {string} addressId - Address ID
   * @param {Object} updates - Address updates
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateAddress(addressId, updates) {
    try {
      // If setting as default, unset other defaults
      if (updates.is_default) {
        const { data: address } = await supabase
          .from('addresses')
          .select('user_id')
          .eq('id', addressId)
          .single()

        if (address) {
          await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', address.user_id)
        }
      }

      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', addressId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating address:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete address
   * @param {string} addressId - Address ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async deleteAddress(addressId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error deleting address:', error)
      return { data: null, error }
    }
  },

  /**
   * Get default address
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getDefaultAddress(userId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching default address:', error)
      return { data: null, error }
    }
  }
}

/**
 * Wishlist Service
 * Handles user wishlist operations
 */
export const wishlistService = {
  /**
   * Get user wishlist
   * @param {string} userId - User ID
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getWishlist(userId) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          products (
            id,
            name_ro,
            name_en,
            slug,
            base_price,
            is_active,
            stock_quantity,
            product_images!inner (
              image_url,
              is_primary
            ),
            categories (
              name_ro,
              name_en
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      return { data: null, error }
    }
  },

  /**
   * Add product to wishlist
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async addToWishlist(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: userId,
          product_id: productId
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      return { data: null, error }
    }
  },

  /**
   * Remove product from wishlist
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async removeFromWishlist(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      return { data: null, error }
    }
  },

  /**
   * Check if product is in wishlist
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @returns {Promise<{inWishlist: boolean, error: Error|null}>}
   */
  async isInWishlist(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { inWishlist: !!data, error: null }
    } catch (error) {
      console.error('Error checking wishlist:', error)
      return { inWishlist: false, error }
    }
  }
}

export default {
  authService,
  profileService,
  wishlistService
}