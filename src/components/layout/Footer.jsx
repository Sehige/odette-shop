import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { translations } from '../../data/translations';

const Footer = ({ language, setCurrentPage }) => {
  const t = translations[language];
  
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4" style={{ color: '#d4af37' }}>Odette</h3>
            <p className="text-blue-100 text-sm">
              {language === 'ro' 
                ? 'Patiserie artizanală de calitate premium din ingrediente locale.' 
                : 'Artisan pastry of premium quality from local ingredients.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-white transition">
                  {t.home}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-white transition">
                  {t.shop}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('events')} className="hover:text-white transition">
                  {t.events}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-white transition">
                  {t.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t.contact}</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+40 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@odette.ro</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Cluj-Napoca, Romania</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">{t.followUs}</h4>
            <div className="flex gap-4">
              <a href="#" className="text-blue-100 hover:text-white transition">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 pt-8 text-center text-blue-100 text-sm">
          <p>© 2024 Odette. {t.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;