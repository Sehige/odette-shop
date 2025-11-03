import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { translations } from '../../data/translations';

const Header = ({ language, setLanguage, cartItems, setCurrentPage, setShowCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-2xl md:text-3xl font-serif font-bold transition"
            style={{ color: '#373ad4ff' }}
          >
            Odette
          </button>

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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
              className="text-sm font-medium text-gray-700 hover:text-blue-900 transition uppercase"
            >
              {language === 'ro' ? 'EN' : 'RO'}
            </button>

            {/* Shopping Cart */}
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 text-gray-700 hover:text-blue-900 transition"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium" 
                  style={{ backgroundColor: '#d4af37' }}>
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Contact Button */}
            <button className="hidden md:block text-white px-4 md:px-6 py-2 rounded-full hover:opacity-90 transition font-medium text-sm"
              style={{ backgroundColor: '#d4af37' }}>
              {t.contact}
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