import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { getGoogleMapsUrl } from '../../utils/mapUtils';

const Footer = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language];
  
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Legal & Company Information */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.legalInfo}</h4>

            {/* Minimal Company Data */}
            <div className="mb-4 pb-4 border-b border-blue-700">
              <p className="text-blue-100 text-sm font-semibold">{siteConfig.company.legalName}</p>
              <p className="text-blue-100 text-sm">CUI: {siteConfig.company.cui}</p>
            </div>

            {/* Legal Links */}
            <ul className="space-y-3 text-blue-100 text-base">
              <li>
                <button onClick={() => navigate('/terms-and-conditions')} className="hover:text-white transition">
                  {t.termsAndConditions}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition">
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cookie-policy')} className="hover:text-white transition">
                  {t.cookiePolicy}
                </button>
              </li>
              <li>
                <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-2">
                  {t.anpc}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-2">
                  {t.euDispute}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-3 text-blue-100 text-base">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition">
                  {t.home}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition">
                  {t.shopNav}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events')} className="hover:text-white transition">
                  {t.eventsNav}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition">
                  {t.aboutNav}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition">
                  {t.contactNav}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.contactNav}</h4>
            <ul className="space-y-3 text-blue-100 text-base">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white transition">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <a
                  href={getGoogleMapsUrl(siteConfig.contact.address[language])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {siteConfig.contact.address[language]}
                </a>
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