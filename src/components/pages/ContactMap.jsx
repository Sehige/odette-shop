import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { getGoogleMapsUrl } from '../../utils/mapUtils';
import { useCookieConsent } from '../../context/CookieConsentContext';

// Google sets its own cookies as soon as its map loads, so the map waits for a click,
// or loads straight away for visitors who accepted marketing cookies
const ContactMap = ({ language }) => {
  const { consent } = useCookieConsent();
  const [requested, setRequested] = useState(false);
  const ro = language === 'ro';

  if (requested || consent.marketing) {
    return (
      <iframe
        src={siteConfig.mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={ro ? 'Harta: Odette Confiserie' : 'Map: Odette Confiserie'}
      ></iframe>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d4af37' }}>
        <MapPin className="text-white" size={32} aria-hidden="true" />
      </div>
      <p className="max-w-xs font-medium text-gray-700">{siteConfig.contact.address[language]}</p>
      <button
        type="button"
        onClick={() => setRequested(true)}
        className="px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition"
        style={{ backgroundColor: '#1e3a8a' }}
      >
        {ro ? 'Afișează harta' : 'Show the map'}
      </button>
      <p className="max-w-xs text-sm text-gray-600">
        {ro
          ? 'Harta este oferită de Google, care poate seta cookie-uri când o afișați.'
          : 'The map is provided by Google, which may set cookies once it is shown.'}
      </p>
      <a
        href={getGoogleMapsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-blue-900 hover:underline"
      >
        {ro ? 'Deschide în Google Maps' : 'Open in Google Maps'}
      </a>
    </div>
  );
};

export default ContactMap;
