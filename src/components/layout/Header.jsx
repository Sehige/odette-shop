import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Facebook, Instagram } from 'lucide-react';
import { translations } from '../../data/translations';

const Header = ({ language, setLanguage, cartItems, setCurrentPage, setShowCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <header className="fixed w-full top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Social Media Icons */}
          <div className="flex items-center gap-3">
            <a 
              href="https://instagram.com/odettepastry" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://facebook.com/odettepastry" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>

          {/* Center Section: Logo and Brand Name */}
          <div className="flex items-center gap-3">
            {/* Generic Logo Placeholder */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: '#d4af37' }}>
              <img 
                src="/mnt/project/placeholder_cake_picture_2.jpeg" 
                alt="Odette Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setCurrentPage('home')}
              className="text-2xl md:text-3xl font-serif font-bold transition"
              style={{ color: '#1e3a8a' }}
            >
              Odette
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.home}
            </button>
            <button onClick={() => setCurrentPage('shop')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.shop}
            </button>
            <button onClick={() => setCurrentPage('events')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.events}
            </button>
            <button onClick={() => setCurrentPage('about')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.about}
            </button>
            <button onClick={() => setCurrentPage('contact')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.contact}
            </button>
          </nav>

          {/* Right Section: Language Toggle and Shopping Cart */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
              className="text-sm font-medium text-gray-700 hover:text-blue-900 transition uppercase"
            >
              {language === 'ro' ? 'EN' : 'RO'}
            </button>

            {/* Shopping Cart with Total */}
            <button 
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 p-2 text-gray-700 hover:text-blue-900 transition"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartItemCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium" 
                    style={{ backgroundColor: '#d4af37' }}>
                    {cartItemCount}
                  </span>
                  <span className="hidden md:inline text-sm font-semibold" style={{ color: '#d4af37' }}>
                    {cartTotal} {t.lei}
                  </span>
                </>
              )}
              {cartItemCount === 0 && (
                <span className="hidden md:inline text-sm font-semibold text-gray-500">
                  0 {t.lei}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.home}
              </button>
              <button onClick={() => { setCurrentPage('shop'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.shop}
              </button>
              <button onClick={() => { setCurrentPage('events'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.events}
              </button>
              <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.about}
              </button>
              <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.contact}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;