import React from 'react';
import { Facebook, Instagram, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { directionsUrl } from '../../lib/openingHours';
import HoursBox from './HoursBox';
import ContactMap from '../pages/ContactMap';

const NAVY = '#1e3a8a';
const GOLD = '#d4af37';

// The shop: address, hours with the live status, "Rute" (Google Maps directions to the
// listing), "Vezi pe Google Maps", and the map (loaded on request).
// contacts: also phone, email and social links (contact page); mapSide: where the map sits
// on wide screens (on phones the box always comes first).
const LocationCard = ({ language, headingLevel = 'h3', contacts = false, mapSide = 'right' }) => {
  const t = translations[language].location;
  const Heading = headingLevel;
  const line = 'mt-2 flex items-start gap-2 text-gray-600';
  const icon = 'w-5 h-5 mt-0.5 flex-shrink-0';
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
        <Heading className="text-2xl md:text-3xl font-serif font-bold text-gray-900">{siteConfig.name}</Heading>
        <p className={line}>
          <MapPin className={icon} style={{ color: GOLD }} aria-hidden="true" />
          {siteConfig.contact.address[language]}
        </p>
        {contacts && (
          <>
            <p className={line}>
              <Phone className={icon} style={{ color: GOLD }} aria-hidden="true" />
              <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className="hover:text-blue-900 transition">
                {siteConfig.contact.phone}
              </a>
            </p>
            <p className={line}>
              <Mail className={icon} style={{ color: GOLD }} aria-hidden="true" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-blue-900 transition break-all">
                {siteConfig.contact.email}
              </a>
            </p>
          </>
        )}
        <div className="mt-6">
          <HoursBox language={language} />
        </div>
        <div className="mt-8 md:mt-auto md:pt-8 flex flex-wrap items-center gap-3">
          <a
            href={directionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition"
            style={{ backgroundColor: NAVY }}
          >
            <Navigation className="w-4 h-4" aria-hidden="true" />
            {t.directions}
          </a>
          <a
            href={siteConfig.maps.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-3 rounded-lg font-semibold border-2 hover:bg-blue-50 transition"
            style={{ borderColor: NAVY, color: NAVY }}
          >
            {t.viewOnMaps}
          </a>
          {contacts && (
            <span className="flex items-center gap-3 ml-1">
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-blue-900 transition">
                <Instagram className="w-6 h-6" />
              </a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-blue-900 transition">
                <Facebook className="w-6 h-6" />
              </a>
            </span>
          )}
        </div>
      </div>
      <div className={`bg-gray-200 rounded-2xl overflow-hidden min-h-[17rem] aspect-[16/10] md:aspect-auto md:min-h-[380px] ${mapSide === 'left' ? 'md:order-first' : ''}`}>
        <ContactMap language={language} compact />
      </div>
    </div>
  );
};

export default LocationCard;
