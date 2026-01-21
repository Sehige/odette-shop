/**
 * Products Service
 * 
 * This service handles all database operations for the products table.
 * It provides clean, reusable functions that can be called from any component.
 * 
 * Path: /src/services/productsService.js
 */

import { supabase } from '../config/supabaseClient';

/**
 * Fetch all products from the database
 * 
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('isActive', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all products:', error);
    return { data: null, error };
  }
};

/**
 * Fetch products by category
 * 
 * @param {string} category - The category to filter by
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getProductsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('isActive', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching products for category "${category}":`, error);
    return { data: null, error };
  }
};

/**
 * Fetch only best seller products
 * 
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getBestSellers = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('best_seller_flag', true)
      .eq('isActive', true)
      .order('name_ro', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return { data: null, error };
  }
};

/**
 * Fetch a single product by ID
 * 
 * @param {number|string} productId - The product ID
 * @returns {Promise<{data: Object, error: Error|null}>}
 */
export const getProductById = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('isActive', true)
      .single(); // Returns single object instead of array

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    return { data: null, error };
  }
};

/**
 * Search products by name
 * 
 * @param {string} searchTerm - The search term
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const searchProducts = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`) // Case-insensitive search
      .eq('isActive', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error(`Error searching products with term "${searchTerm}":`, error);
    return { data: null, error };
  }
};

/**
 * Filter products by price range
 * 
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getProductsByPriceRange = async (minPrice, maxPrice) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .eq('isActive', true)
      .order('price', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching products in price range ${minPrice}-${maxPrice}:`, error);
    return { data: null, error };
  }
};

/**
 * Get unique categories from products
 *
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getCategories = async () => {
  try {
      // Step 1: Get all unique category UUIDs from products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('category')
        .eq('isActive', true);

      if (productsError) throw productsError;

      // Step 2: Extract unique category UUIDs (filter out null/undefined)
      const uniqueCategoryIds = [...new Set(productsData.map(p => p.category).filter(Boolean))];

      console.log('Unique category UUIDs from products:', uniqueCategoryIds);

      // If no valid categories found, return empty array
      if (uniqueCategoryIds.length === 0) {
        console.log('No categories found with active products');
        return { data: [], error: null };
      }

      // Step 3: Fetch the full category data (id, name_ro, name_en) from categories table
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name_ro, name_en')
        .in('id', uniqueCategoryIds)
        .order('name_en', { ascending: true });

      if (categoriesError) throw categoriesError;

      console.log('Categories with names:', categoriesData);

      return { data: categoriesData, error: null };

  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: [], error };
  }
};

/**
 * Get featured categories for home page
 *
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getFeaturedCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_ro, name_en, imageURL')
      .eq('isFeatured', true)
      .order('name_en', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    return { data: [], error };
  }
};

/**
 * Advanced filter: Get products with multiple filters
 * 
 * @param {Object} filters - Filter object
 * @param {string} filters.category - Category filter
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {boolean} filters.bestSeller - Filter for best sellers only
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export const getFilteredProducts = async (filters = {}) => {
  try {
    let query = supabase.from('products').select('*').eq('isActive', true);

    // Apply filters conditionally
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.bestSeller === true) {
      query = query.eq('best_seller_flag', true);
    }

    // Execute query
    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    return { data: null, error };
  }
};