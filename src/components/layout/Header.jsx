import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Facebook, Instagram } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
// Navy variant for the white header; the original (white) SVG is for dark backgrounds
import odetteLogo from '../../Odette_Confiserie_navy.svg';

const Header = ({ language, setLanguage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const t = translations[language];

  // Wedding offer URL
  const weddingOfferUrl = 'https://www.canva.com/design/DAG9eAIoAiU/4Wzi004UggxTwSxsU1Wp8Q/view';

  // TikTok Icon Component
  const TikTokIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <header className="fixed w-full top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: Social Media Icons */}
          <div className="hidden lg:flex items-center gap-3 w-24">
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

          {/* CENTER: Logo + Odette + Navigation */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Swan logo (blue background, no ring) + Odette Confiserie wordmark */}
            <button
              onClick={() => navigate('/')}
              aria-label="Odette Confiserie - Acasă"
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                <img
                  src={`${process.env.PUBLIC_URL}/odette_logo.svg`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <img
                src={odetteLogo}
                alt="Odette Confiserie"
                className="h-12 sm:h-16 w-auto"
              />
            </button>

            {/* Navigation Menu - Desktop Only */}
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
              <a
                href={weddingOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-900 transition font-medium whitespace-nowrap"
              >
                {t.weddingNav}
              </a>
              <button
                onClick={() => navigate('/contact')}
                className="text-gray-700 hover:text-blue-900 transition font-medium whitespace-nowrap"
              >
                {t.contactNav}
              </button>
            </nav>
          </div>

          {/* RIGHT: Language Toggle and Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4 w-24 justify-end">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
              className="text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-900 transition uppercase"
            >
              {language === 'ro' ? 'RO' : 'EN'}
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
              <a
                href={weddingOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium whitespace-nowrap"
              >
                {t.weddingNav}
              </a>
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