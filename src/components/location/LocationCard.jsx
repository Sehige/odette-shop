import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { directionsUrl } from '../../lib/openingHours';
import HoursBox from './HoursBox';
import ContactMap from '../pages/ContactMap';

const NAVY = '#1e3a8a';

// The shop: address, hours with the live status, "Rute" (Google Maps directions to the
// listing), "Vezi pe Google Maps", and the map (loaded on request). Homepage and contact page.
const LocationCard = ({ language, headingLevel = 'h3' }) => {
  const t = translations[language].location;
  const Heading = headingLevel;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
        <Heading className="text-2xl md:text-3xl font-serif font-bold text-gray-900">{siteConfig.name}</Heading>
        <p className="mt-2 flex items-start gap-2 text-gray-600">
          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#d4af37' }} aria-hidden="true" />
          {siteConfig.contact.address[language]}
        </p>
        <div className="mt-6">
          <HoursBox language={language} />
        </div>
        <div className="mt-8 md:mt-auto md:pt-8 flex flex-wrap gap-3">
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
        </div>
      </div>
      <div className="bg-gray-200 rounded-2xl overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[380px]">
        <ContactMap language={language} compact />
      </div>
    </div>
  );
};

export default LocationCard;
