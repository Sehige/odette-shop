// ========================================
// PRODUCT API SERVICE
// ========================================

import { supabase } from '../lib/supabase'

/**
 * Product Service
 * Handles all product-related operations
 */
export const productService = {
  /**
   * Get all active products with images and category info
   * @param {Object} options - Query options
   * @param {string} options.categorySlug - Filter by category slug
   * @param {boolean} options.featured - Filter featured products
   * @param {boolean} options.bestSeller - Filter best sellers
   * @param {number} options.limit - Limit results
   * @param {string} options.search - Search term
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getProducts(options = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            alt_text_ro,
            alt_text_en,
            display_order,
            is_primary
          ),
          product_variants (
            id,
            name_ro,
            name_en,
            variant_type,
            price_adjustment,
            stock_quantity,
            display_order,
            is_active
          ),
          categories (
            id,
            name_ro,
            name_en,
            slug
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      // Apply filters
      if (options.categorySlug) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', options.categorySlug)
          .single()
        
        if (category) {
          query = query.eq('category_id', category.id)
        }
      }

      if (options.featured) {
        query = query.eq('is_featured', true)
      }

      if (options.bestSeller) {
        query = query.eq('is_best_seller', true)
      }

      if (options.search) {
        query = query.or(`name_ro.ilike.%${options.search}%,name_en.ilike.%${options.search}%`)
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching products:', error)
      return { data: null, error }
    }
  },

  /**
   * Get single product by slug
   * @param {string} slug - Product slug
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getProductBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            alt_text_ro,
            alt_text_en,
            display_order,
            is_primary
          ),
          product_variants (
            id,
            name_ro,
            name_en,
            variant_type,
            price_adjustment,
            sku,
            stock_quantity,
            display_order,
            is_active
          ),
          categories (
            id,
            name_ro,
            name_en,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error

      // Sort images by display order
      if (data.product_images) {
        data.product_images.sort((a, b) => a.display_order - b.display_order)
      }

      // Sort variants by display order
      if (data.product_variants) {
        data.product_variants.sort((a, b) => a.display_order - b.display_order)
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching product:', error)
      return { data: null, error }
    }
  },

  /**
   * Get product by ID
   * @param {string} productId - Product UUID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getProductById(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          product_variants (*),
          categories (*)
        `)
        .eq('id', productId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching product by ID:', error)
      return { data: null, error }
    }
  },

  /**
   * Get related products (same category)
   * @param {string} productId - Current product ID
   * @param {string} categoryId - Category ID
   * @param {number} limit - Number of products to return
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getRelatedProducts(productId, categoryId, limit = 4) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images!inner (
            image_url,
            is_primary
          )
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .eq('product_images.is_primary', true)
        .neq('id', productId)
        .limit(limit)

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching related products:', error)
      return { data: null, error }
    }
  },

  /**
   * Search products
   * @param {string} searchTerm - Search query
   * @param {string} language - Language code ('ro' or 'en')
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async searchProducts(searchTerm, language = 'ro') {
    try {
      const nameField = language === 'ro' ? 'name_ro' : 'name_en'
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images!inner (
            image_url,
            is_primary
          ),
          categories (
            name_ro,
            name_en,
            slug
          )
        `)
        .eq('is_active', true)
        .eq('product_images.is_primary', true)
        .ilike(nameField, `%${searchTerm}%`)
        .limit(20)

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error searching products:', error)
      return { data: null, error }
    }
  },

  /**
   * Check product availability
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID (optional)
   * @param {number} quantity - Desired quantity
   * @returns {Promise<{available: boolean, stock: number, error: Error|null}>}
   */
  async checkAvailability(productId, variantId = null, quantity = 1) {
    try {
      if (variantId) {
        const { data, error } = await supabase
          .from('product_variants')
          .select('stock_quantity, is_active')
          .eq('id', variantId)
          .single()

        if (error) throw error

        const available = data.is_active && data.stock_quantity >= quantity
        return { available, stock: data.stock_quantity, error: null }
      } else {
        const { data, error } = await supabase
          .from('products')
          .select('stock_quantity, is_active, allow_backorder')
          .eq('id', productId)
          .single()

        if (error) throw error

        const available = data.is_active && (data.stock_quantity >= quantity || data.allow_backorder)
        return { available, stock: data.stock_quantity, error: null }
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      return { available: false, stock: 0, error }
    }
  },

  /**
   * Get product reviews
   * @param {string} productId - Product ID
   * @param {number} limit - Number of reviews to return
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getProductReviews(productId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name
          ),
          review_images (
            image_url
          )
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return { data: null, error }
    }
  },

  /**
   * Get product reviews summary
   * @param {string} productId - Product ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getReviewsSummary(productId) {
    try {
      const { data, error } = await supabase
        .from('product_reviews_summary')
        .select('*')
        .eq('product_id', productId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching reviews summary:', error)
      return { data: null, error }
    }
  }
}

/**
 * Category Service
 * Handles all category-related operations
 */
export const categoryService = {
  /**
   * Get all active categories
   * @param {boolean} includeProducts - Include product count
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getCategories(includeProducts = false) {
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      const { data, error } = await query

      if (error) throw error

      // If including products, fetch count for each category
      if (includeProducts && data) {
        const categoriesWithCount = await Promise.all(
          data.map(async (category) => {
            const { count } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('is_active', true)

            return { ...category, product_count: count || 0 }
          })
        )

        return { data: categoriesWithCount, error: null }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { data: null, error }
    }
  },

  /**
   * Get category by slug
   * @param {string} slug - Category slug
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getCategoryBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching category:', error)
      return { data: null, error }
    }
  }
}

export default {
  productService,
  categoryService
}