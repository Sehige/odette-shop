import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { useCookieConsent } from '../../context/CookieConsentContext';
import HoursBox from '../location/HoursBox';
// White wordmark and swan, as in the header
import odetteLogo from '../../Odette_Confiserie.svg';
import logoMark from '../../Stickere.svg';

const NAVY = '#1e3a8a';

const Footer = ({ language }) => {
  const t = translations[language];
  const f = t.footer;
  const { openPreferences } = useCookieConsent();
  const { company } = siteConfig;

  const linkClass = 'hover:text-white transition';
  // small, muted; at least 24px tall to tap
  const legalLink = 'inline-block py-1 hover:text-white focus-visible:text-white transition';

  return (
    <footer className="text-white" style={{ backgroundColor: NAVY }}>
      {/* pb-24: the floating WhatsApp button would cover the last row otherwise */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" aria-label={`${siteConfig.name} - ${t.home}`} className="inline-flex items-center gap-3">
              <img src={logoMark} alt="" className="h-16 w-auto object-contain" />
              <img src={odetteLogo} alt={siteConfig.name} className="h-12 w-auto" />
            </Link>
            <div className="mt-5 flex items-center gap-4">
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-blue-100 hover:text-white transition">
                <Instagram className="w-6 h-6" />
              </a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-100 hover:text-white transition">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Opening hours, with the live status (on wide screens each column sits centred in its space) */}
          <div className="lg:justify-self-center">
            <h2 className="text-lg font-semibold mb-3">{t.contact.labels.hours}</h2>
            <HoursBox language={language} tone="dark" />
          </div>

          {/* Contact */}
          <div className="lg:justify-self-center">
            <h2 className="text-lg font-semibold mb-3">{t.contactNav}</h2>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className={linkClass}>{siteConfig.contact.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${siteConfig.contact.email}`} className={`${linkClass} break-all`}>{siteConfig.contact.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a href={siteConfig.maps.placeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {siteConfig.contact.address[language]}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="lg:justify-self-center">
            <h2 className="text-lg font-semibold mb-3">{t.quickLinks}</h2>
            <ul className="space-y-3 text-blue-100">
              <li><Link to="/" className={linkClass}>{t.home}</Link></li>
              <li><Link to="/shop" className={linkClass}>{t.shopNav}</Link></li>
              <li><Link to="/contact" className={linkClass}>{t.contactNav}</Link></li>
            </ul>
          </div>
        </div>

        {/* Company identification (Legea 365/2002) and the legal links */}
        <div className="mt-10 pt-5 border-t border-white/20 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between text-sm text-blue-100">
          <p>
            {/* the year comes from the build; the browser may already be in the next one */}
            <span suppressHydrationWarning>© {new Date().getFullYear()}</span>{' '}
            {company.legalName} · CUI {company.cui} · {f.tradeRegister} {company.tradeRegister}
          </p>
          <nav aria-label={f.legalNav}>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              <li><Link to="/terms-and-conditions" className={legalLink}>{f.terms}</Link></li>
              <li><Link to="/privacy-policy" className={legalLink}>{f.privacy}</Link></li>
              <li><Link to="/cookie-policy" className={legalLink}>{f.cookies}</Link></li>
              <li><Link to="/risipa-alimentara" className={legalLink}>{f.foodWaste}</Link></li>
              <li>
                <button type="button" onClick={openPreferences} className={legalLink}>
                  {t.cookieConsent?.manageCookies || 'Manage cookies'}
                </button>
              </li>
              <li><a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className={legalLink}>{f.anpc}</a></li>
              <li><a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" className={legalLink}>{f.euDisputes}</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
