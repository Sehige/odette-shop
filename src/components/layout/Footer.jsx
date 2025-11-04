import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { translations } from '../../data/translations';

const Footer = ({ language, setCurrentPage }) => {
  const t = translations[language];
  
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Odette</h3>
            <p className="text-blue-100 text-base leading-relaxed">
              {language === 'ro' 
                ? 'Patiserie artizanală de calitate premium din ingrediente locale.' 
                : 'Artisan pastry of premium quality from local ingredients.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-3 text-blue-100 text-base">
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
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-white transition">
                  {t.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.contact}</h4>
            <ul className="space-y-3 text-blue-100 text-base">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>+40 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>contact@odette.ro</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>Cluj-Napoca, Romania</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 pt-8 text-center text-blue-100 text-base">
          <p>© 2024 Odette. {t.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;