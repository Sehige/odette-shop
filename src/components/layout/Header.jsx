import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Facebook, Instagram } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';

const Header = ({ language, setLanguage, cartItemsCount, setShowCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const t = translations[language];

  // TikTok Icon Component
  const TikTokIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <header className="fixed w-full top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[80px_auto_1fr_auto] items-center h-20 gap-2 sm:gap-4 lg:gap-6">
          {/* Container 1: Social Media Icons */}
          <div className="hidden sm:flex items-center justify-start gap-2">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={siteConfig.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Container 2: Logo and Brand Name */}
          <div className="flex items-center justify-start gap-2 sm:gap-3">
            {/* Generic Logo Placeholder */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2" style={{ borderColor: '#d4af37' }}>
              <img
                src={`${process.env.PUBLIC_URL}/logo_swan.png`}
                alt="Odette Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-2xl md:text-3xl font-serif font-bold transition"
              style={{ color: '#1e3a8a' }}
            >
              Odette
            </button>
          </div>

          {/* Container 3: Navigation Menu - Desktop Only */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-blue-900 transition font-medium whitespace-nowrap"
            >
              {t.home}
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="text-gray-700 hover:text-blue-900 transition font-medium whitespace-nowrap"
            >
              {t.shopNav}
            </button>
            <button
              onClick={() => navigate('/events')}
              className="text-gray-700 hover:text-blue-900 transition font-medium whitespace-nowrap"
            >
              {t.eventsNav}
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-700 hover:text-blue-900 transition font-medium whitespace-nowrap"
            >
              {t.aboutNav}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-700 hover:text-blue-900 transition font-medium whitespace-nowrap"
            >
              {t.contactNav}
            </button>
          </nav>

          {/* Container 4: Language Toggle and Shopping Cart */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
              className="w-8 sm:w-10 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-900 transition uppercase text-center"
            >
              {language === 'ro' ? 'RO' : 'EN'}
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => setShowCart(true)}
              className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-700 hover:text-blue-900 transition"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  style={{ backgroundColor: '#d4af37' }}>
                  {cartItemsCount}
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
              <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium whitespace-nowrap">
                {t.home}
              </button>
              <button onClick={() => { navigate('/shop'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium whitespace-nowrap">
                {t.shopNav}
              </button>
              <button onClick={() => { navigate('/events'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium whitespace-nowrap">
                {t.eventsNav}
              </button>
              <button onClick={() => { navigate('/about'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium whitespace-nowrap">
                {t.aboutNav}
              </button>
              <button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium whitespace-nowrap">
                {t.contactNav}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;