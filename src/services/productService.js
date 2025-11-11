// ========================================
// PRODUCT SERVICE - For Create React App
// Path: src/services/productService.js
// ========================================

import { supabase } from '../lib/supabase'

/**
 * Product Service
 * Handles all product-related operations
 */
export const productService = {
  /**
   * Get all active products with images and category info
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
   * Check product availability
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
  }
}

/**
 * Category Service
 * Handles all category-related operations
 */
export const categoryService = {
  /**
   * Get all active categories
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