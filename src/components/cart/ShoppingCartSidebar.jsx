import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { translations } from '../../data/translations';

const ShoppingCartSidebar = ({ language, cartItems, updateQuantity, removeFromCart, onClose, setCurrentPage }) => {
  const t = translations[language];
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = 20;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.cart}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">{t.cartEmpty}</p>
              <button
                onClick={() => { onClose(); setCurrentPage('shop'); }}
                className="font-medium hover:opacity-80"
                style={{ color: '#1e3a8a' }}
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name[language]}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.product.name[language]}
                    </h3>
                    {item.size && (
                      <p className="text-xs text-gray-600">Size: {item.size}</p>
                    )}
                    {item.flavor && (
                      <p className="text-xs text-gray-600">Flavor: {item.flavor}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {item.product.price * item.quantity} {t.lei}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.subtotal}</span>
              <span className="font-semibold">{subtotal} {t.lei}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.deliveryFee}</span>
              <span className="font-semibold">{deliveryFee} {t.lei}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>{t.total}</span>
              <span style={{ color: '#d4af37' }}>{total} {t.lei}</span>
            </div>
            <button
              onClick={() => { onClose(); setCurrentPage('checkout'); }}
              className="w-full text-white py-4 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: '#d4af37' }}
            >
              {t.checkout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartSidebar;