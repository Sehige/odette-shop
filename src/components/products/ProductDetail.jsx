import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { translations } from '../../data/translations';
import ProductCard from './ProductCard';
import { createCartItem, validateCartItem } from '../../services/cartOrderService';
import { useAuth } from '../../hooks/useAuth';

const ProductDetail = ({ product, language, addToCart, onClose, allProducts }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [selectedFlavor, setSelectedFlavor] = useState(
    product.flavors ? product.flavors[language][0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const t = translations[language];
  
  const modalContentRef = useRef(null);

  // ✅ NEW: Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // ✅ NEW: Handle click outside modal
  const handleBackdropClick = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    try {
      // Validate before adding to cart
      const options = { 
        size: selectedSize, 
        flavor: selectedFlavor, 
        quantity 
      };
      
      // This will throw an error if validation fails
      validateCartItem(product, options);
      
      // Add to cart
      addToCart(product, options);
      
      // Close modal
      onClose();
    } catch (error) {
      // Show error to user (you can enhance this with a toast notification later)
      alert(error.message);
    }
  };

  // Calculate total price based on size multiplier
  const calculateTotalPrice = () => {
    const basePrice = product.price || 0;
    const sizeMultiplier = selectedSize?.priceMultiplier || 1;
    return (basePrice * sizeMultiplier * quantity).toFixed(2);
  };

  // Get related/paired products
  const getRelatedProducts = () => {
    if (!allProducts) return [];
    
    // Simple logic: show 3 random products from the same category or complementary items
    // In a real app, this would be based on actual pairing data
    const related = allProducts
      .filter(p => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return related;
  };

  const relatedProducts = getRelatedProducts();

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalContentRef}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">{language === 'ro' ? product.name_ro : product.name_en}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={language === 'ro' ? product.name_ro : product.name_en}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <p className="text-3xl font-bold mb-4" style={{ color: '#d4af37' }}>
                {product.price} {t.lei}
                {selectedSize?.priceMultiplier && selectedSize.priceMultiplier !== 1 && (
                  <span className="text-lg ml-2 text-gray-600">
                    ({selectedSize.priceMultiplier})
                  </span>
                )}
              </p>
              
              <p className="text-gray-600 mb-6">{language === 'ro' ? product.description_ro : product.description_en}</p>
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.selectSize || 'Select Size'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.value || size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          selectedSize === size
                            ? 'border-blue-900 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        style={selectedSize === size ? { borderColor: '#1e3a8a', backgroundColor: '#eff6ff' } : {}}
                      >
                        {size.label ? size.label : size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flavor Selection */}
              {product.flavors && product.flavors && product.flavors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.selectFlavor || 'Select Flavor'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          selectedFlavor === flavor
                            ? 'border-blue-900 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        style={selectedFlavor === flavor ? { borderColor: '#1e3a8a', backgroundColor: '#eff6ff' } : {}}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t.quantity || 'Quantity'}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-100 transition"
                    style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-100 transition"
                    style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition shadow-lg"
                style={{ backgroundColor: '#d4af37' }}
              >
                {t.addToCart || 'Add to Cart'} - {calculateTotalPrice()} {t.lei}
              </button>

              {/* User Authentication Prompt (Optional) */}
              {!isAuthenticated && (
                <p className="mt-3 text-sm text-gray-500 text-center">
                  {language === 'ro' 
                    ? 'Creează un cont pentru a salva preferințele tale' 
                    : 'Create an account to save your preferences'}
                </p>
              )}

              {/* Product Info */}
              <div className="mt-8 space-y-4">
                {product.ingredients && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t.ingredients || 'Ingredients'}
                    </h4>
                    <p className="text-gray-600 text-sm">{product.ingredients}</p>
                  </div>
                )}
                {product.allergens && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t.allergens || 'Allergens'}
                    </h4>
                    <p className="text-gray-600 text-sm">{product.allergens}</p>
                  </div>
                )}
                {product.storage && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t.storage || 'Storage'}
                    </h4>
                    <p className="text-gray-600 text-sm">{product.storage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;