/**
 * useProducts Hook
 * 
 * Custom React hook for fetching and managing products data.
 * Handles loading states, errors, and provides easy-to-use functions.
 * 
 * Path: /src/hooks/useProducts.js
 */

import { useState, useEffect } from 'react';
import {
  getAllProducts,
  getProductsByCategory,
  getBestSellers,
  getProductById,
  searchProducts,
  getProductsByPriceRange,
  getCategories,
  getFeaturedCategories,
  getFilteredProducts
} from '../services/productService';

/**
 * Custom hook to fetch all products
 * 
 * @returns {Object} { products, loading, error, refetch }
 */
export const useAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await getAllProducts();
    
    if (error) {
      setError(error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { 
    products, 
    loading, 
    error,
    refetch: fetchProducts // Function to manually refetch
  };
};

/**
 * Custom hook to fetch products by category
 * 
 * @param {string} category - Category to filter by
 * @returns {Object} { products, loading, error, refetch }
 */
export const useProductsByCategory = (category) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    if (!category) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const { data, error } = await getProductsByCategory(category);
    
    if (error) {
      setError(error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return { 
    products, 
    loading, 
    error,
    refetch: fetchProducts
  };
};

/**
 * Custom hook to fetch best sellers
 * 
 * @returns {Object} { bestSellers, loading, error, refetch }
 */
export const useBestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBestSellers = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await getBestSellers();
    
    if (error) {
      setError(error);
      setBestSellers([]);
    } else {
      setBestSellers(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  return { 
    bestSellers, 
    loading, 
    error,
    refetch: fetchBestSellers
  };
};

/**
 * Custom hook to fetch a single product
 * 
 * @param {number|string} productId - Product ID
 * @returns {Object} { product, loading, error, refetch }
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const { data, error } = await getProductById(productId);
    
    if (error) {
      setError(error);
      setProduct(null);
    } else {
      setProduct(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return { 
    product, 
    loading, 
    error,
    refetch: fetchProduct
  };
};

/**
 * Custom hook for searching products
 * NOTE: This doesn't auto-fetch, you need to call search() manually
 * 
 * @returns {Object} { products, loading, error, search }
 */
export const useProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    const { data, error } = await searchProducts(searchTerm);
    
    if (error) {
      setError(error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    
    setLoading(false);
  };

  return { 
    products, 
    loading, 
    error,
    search // Function to trigger search
  };
};

/**
 * Custom hook to get all categories
 *
 * @returns {Object} { categories, loading, error, refetch }
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await getCategories();

    if (error) {
      setError(error);
      setCategories([]);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

/**
 * Custom hook to get featured categories for home page
 *
 * @returns {Object} { categories, loading, error, refetch }
 */
export const useFeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await getFeaturedCategories();

    if (error) {
      setError(error);
      setCategories([]);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

/**
 * Custom hook for filtered products
 * NOTE: Pass filters as dependency, hook will auto-refetch when filters change
 * 
 * @param {Object} filters - Filter object
 * @returns {Object} { products, loading, error, refetch }
 */
export const useFilteredProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await getFilteredProducts(filters);
    
    if (error) {
      setError(error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return { 
    products, 
    loading, 
    error,
    refetch: fetchProducts
  };
};