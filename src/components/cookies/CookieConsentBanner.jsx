import React from 'react';
import { Cookie, Settings } from 'lucide-react';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { translations } from '../../data/translations';

const CookieConsentBanner = ({ language }) => {
  const { showBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent();
  const t = translations[language]?.cookieConsent || translations.ro.cookieConsent;

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border-2 p-6 md:p-8"
        style={{ borderColor: '#d4af37' }}
      >
        {/* Header with icon */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#1e3a8a' }}
          >
            <Cookie className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: '#1e3a8a' }}
            >
              {t.bannerTitle}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              {t.bannerDescription}
            </p>
            <a
              href="/cookie-policy"
              className="text-sm underline mt-2 inline-block"
              style={{ color: '#1e3a8a' }}
            >
              {t.learnMore}
            </a>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={acceptAll}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition hover:opacity-90"
            style={{ backgroundColor: '#d4af37', color: '#1e3a8a' }}
          >
            {t.acceptAll}
          </button>
          <button
            onClick={rejectAll}
            className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition hover:bg-gray-50"
            style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
          >
            {t.rejectAll}
          </button>
          <button
            onClick={openPreferences}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" />
            {t.managePreferences}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
