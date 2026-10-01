import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ExternalLink, Cookie, Facebook, Instagram } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { getGoogleMapsUrl } from '../../utils/mapUtils';
import { useCookieConsent } from '../../context/CookieConsentContext';

const Footer = ({ language }) => {
  const t = translations[language];
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* LEFT: Legal & Company Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.legalInfo}</h2>

            {/* Minimal Company Data */}
            <div className="mb-4 pb-4 border-b border-blue-700">
              <p className="text-blue-100 text-sm font-semibold">{siteConfig.company.legalName}</p>
              <p className="text-blue-100 text-sm">CUI: {siteConfig.company.cui}</p>
            </div>

            {/* Legal Links */}
            <ul className="space-y-3 text-blue-100 text-base">
              <li>
                <Link to="/terms-and-conditions" className="hover:text-white transition">
                  {t.termsAndConditions}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition">
                  {t.cookiePolicy}
                </Link>
              </li>
              <li>
                <button onClick={openPreferences} className="hover:text-white transition flex items-center gap-2">
                  <Cookie className="w-4 h-4" />
                  {t.cookieConsent?.manageCookies || 'Manage cookies'}
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

          {/* MIDDLE: Contact + Opening Hours */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.contactNav}</h2>
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

            {/* Opening Hours */}
            <h2 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t.contact.labels.hours}
            </h2>
            <ul className="space-y-1 text-blue-100 text-base">
              {siteConfig.hours[language].split('\n').map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Quick Links + Social Media */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.quickLinks}</h2>
            <ul className="space-y-3 text-blue-100 text-base">
              <li>
                <Link to="/" className="hover:text-white transition">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  {t.shopNav}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  {t.contactNav}
                </Link>
              </li>
            </ul>

            {/* Social Media */}
            <h2 className="text-xl font-semibold mt-6 mb-3">{t.followUs}</h2>
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-blue-100 hover:text-white transition"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-blue-100 hover:text-white transition"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 pt-8 text-center text-blue-100 text-base">
          <p>© 2026 Odette. {t.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
