/**
 * ProductsGrid Component
 * 
 * Displays all products in a responsive grid layout.
 * Uses the custom useAllProducts hook to fetch data from Supabase.
 * 
 * Path: /src/components/products/ProductsGrid.jsx
 */

import React from 'react';
import { useAllProducts } from '../../hooks/useProducts';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

const ProductsGrid = () => {
  const { products, loading, error, refetch } = useAllProducts();

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1e3a8a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">⚠️ Error loading products: {error.message}</p>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-600 text-lg mb-4">No products found</p>
        <p className="text-gray-500 text-sm">
          Make sure your Supabase database has products in the "products" table
        </p>
      </div>
    );
  }

  // Products grid
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2">Our Products</h2>
        <p className="text-gray-600">Showing {products.length} delicious items</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

/**
 * ProductCard Component
 * Individual product card with Odette's navy blue, white, and gold theme
 */
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Best Seller Badge */}
      {product.best_seller_flag && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            ⭐ Best Seller
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={getOptimizedImageUrl(product.image_url, { width: 400 })}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
            <span className="text-white text-4xl">🍰</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <span className="inline-block text-xs font-semibold text-[#1e3a8a] bg-blue-50 px-2 py-1 rounded mb-2">
            {product.category}
          </span>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-[#1e3a8a]">
              ${product.price?.toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <button className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white px-4 py-2 rounded-lg hover:from-[#1e40af] hover:to-[#2563eb] transition-all shadow-md hover:shadow-lg">
            Add to Cart
          </button>
        </div>

        {/* Additional Info */}
        {product.stock_quantity !== undefined && (
          <div className="mt-3 text-xs text-gray-500">
            {product.stock_quantity > 0 ? (
              <span className="text-green-600">✓ In Stock ({product.stock_quantity})</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;