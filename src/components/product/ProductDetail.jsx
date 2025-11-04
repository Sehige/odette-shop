import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { translations } from '../../data/translations';
import ProductCard from './ProductCard';

const ProductDetail = ({ product, language, addToCart, onClose, allProducts }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [selectedFlavor, setSelectedFlavor] = useState(
    product.flavors ? product.flavors[language][0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const t = translations[language];

  const handleAddToCart = () => {
    addToCart(product, { size: selectedSize, flavor: selectedFlavor, quantity });
    onClose();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">{product.name[language]}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Image */}
            <div className="aspect-square rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name[language]}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <p className="text-3xl font-bold mb-4" style={{ color: '#d4af37' }}>
                {product.price} {t.lei}
              </p>
              
              <p className="text-gray-600 mb-6">{product.description[language]}</p>

              {/* Size Selection */}
              {product.sizes && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.selectSize}
                  </label>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          selectedSize === size
                            ? 'bg-blue-50 text-blue-900'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        style={selectedSize === size ? { borderColor: '#1e3a8a' } : {}}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flavor Selection */}
              {product.flavors && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.selectFlavor}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {product.flavors[language].map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          selectedFlavor === flavor
                            ? 'bg-blue-50 text-blue-900'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        style={selectedFlavor === flavor ? { borderColor: '#1e3a8a' } : {}}
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
                  {t.quantity}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-100 transition"
                    style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-100 transition"
                    style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition"
                style={{ backgroundColor: '#d4af37' }}
              >
                {t.addToCart} - {product.price * quantity} {t.lei}
              </button>

              {/* Product Info */}
              <div className="mt-8 space-y-4">
                {product.ingredients && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.ingredients}</h4>
                    <p className="text-gray-600 text-sm">{product.ingredients[language]}</p>
                  </div>
                )}
                {product.allergens && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.allergens}</h4>
                    <p className="text-gray-600 text-sm">{product.allergens[language]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                {language === 'ro' ? 'Produse Care Se Potrivesc' : 'Products That Pair Well'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'ro' 
                  ? 'Clienții noștri aleg frecvent aceste produse împreună. Puteți adăuga și lumanări sau litere personalizate.'
                  : 'Our customers often choose these products together. You can also add candles or personalized letters.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    language={language}
                    addToCart={addToCart}
                    setSelectedProduct={() => {}} // Don't open nested modals
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;