import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { translations } from '../../data/translations';
import ProductCard from './ProductCard';
import { createCartItem, validateCartItem } from '../../services/cartOrderService';
import { useAuth } from '../../hooks/useAuth';
import { useProduct } from '../../hooks/useProducts';

const ProductDetails = ({ productId, language, addToCart }) => {
  
  const { product, loading, error } = useProduct(productId);
  
  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Product not found</p>;
  if (!product) return <p>Product doesn't exist</p>;
  
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        {/* Details */}
        <div>
          {/* Best Seller Badge */}
          {product.best_seller_flag && (
            <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold">
              ⭐ Best Seller
            </span>
          )}
          
          <h1 className="text-4xl font-bold mt-4">{product.name}</h1>
          
          <p className="text-gray-600 mt-2">{product.category}</p>
          
          <p className="text-gray-700 mt-6 text-lg">{product.description}</p>
          
          <div className="mt-8">
            <span className="text-5xl font-bold text-blue-900">
              ${product.price.toFixed(2)}
            </span>
            
            {product.original_price && product.original_price > product.price && (
              <span className="text-2xl text-gray-400 line-through ml-4">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-blue-900 text-white py-4 rounded-lg text-xl font-bold mt-8 hover:bg-blue-800 transition"
          >
            {language === 'ro' ? 'Adaugă în Coș' : 'Add to Cart'}
          </button>
          
          {/* Stock Status */}
          <div className="mt-6">
            {product.stock_quantity > 0 ? (
              <p className="text-green-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                {language === 'ro' ? 'În stoc' : 'In Stock'} ({product.stock_quantity} {language === 'ro' ? 'bucăți' : 'available'})
              </p>
            ) : (
              <p className="text-red-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {language === 'ro' ? 'Stoc epuizat' : 'Out of Stock'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;