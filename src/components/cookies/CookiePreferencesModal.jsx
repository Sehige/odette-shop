import React, { useState, useEffect, useRef } from 'react';
import { X, Cookie, Shield, BarChart3, Target, Check } from 'lucide-react';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { translations } from '../../data/translations';

const CookiePreferencesModal = ({ language }) => {
  const {
    showPreferences,
    closePreferences,
    savePreferences,
    consent,
    acceptAll,
    rejectAll
  } = useCookieConsent();

  const modalRef = useRef(null);
  const t = translations[language]?.cookieConsent || translations.ro.cookieConsent;

  // Local state for preferences before saving
  const [preferences, setPreferences] = useState({
    analytics: consent.analytics,
    marketing: consent.marketing
  });

  // Sync with consent state when modal opens
  useEffect(() => {
    if (showPreferences) {
      setPreferences({
        analytics: consent.analytics,
        marketing: consent.marketing
      });
    }
  }, [showPreferences, consent]);

  // Handle ESC key and body scroll
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && showPreferences) {
        closePreferences();
      }
    };

    if (showPreferences) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showPreferences, closePreferences]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closePreferences();
    }
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  if (!showPreferences) return null;

  const cookieCategories = [
    {
      id: 'essential',
      icon: Shield,
      title: t.essentialTitle,
      description: t.essentialDescription,
      enabled: true,
      locked: true
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: t.analyticsTitle,
      description: t.analyticsDescription,
      enabled: preferences.analytics,
      locked: false
    },
    {
      id: 'marketing',
      icon: Target,
      title: t.marketingTitle,
      description: t.marketingDescription,
      enabled: preferences.marketing,
      locked: false
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div
          className="p-6 text-white"
          style={{ backgroundColor: '#1e3a8a' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cookie className="w-8 h-8" />
              <h2 className="text-2xl font-bold">{t.preferencesTitle}</h2>
            </div>
            <button
              onClick={closePreferences}
              className="p-2 hover:bg-white/10 rounded-full transition"
              aria-label={translations[language]?.close || 'Close'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-2 text-blue-100">{t.preferencesDescription}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="space-y-4">
            {cookieCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="border rounded-xl p-4 transition"
                  style={{
                    borderColor: category.enabled ? '#d4af37' : '#e5e7eb',
                    backgroundColor: category.enabled ? '#fefce8' : 'white'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: category.enabled ? '#d4af37' : '#e5e7eb' }}
                    >
                      <Icon className={`w-5 h-5 ${category.enabled ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{category.title}</h3>
                        {category.locked ? (
                          <span
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{ backgroundColor: '#1e3a8a', color: 'white' }}
                          >
                            {t.alwaysActive}
                          </span>
                        ) : (
                          <button
                            onClick={() => setPreferences(prev => ({
                              ...prev,
                              [category.id]: !prev[category.id]
                            }))}
                            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                              category.enabled ? '' : 'bg-gray-300'
                            }`}
                            style={{ backgroundColor: category.enabled ? '#d4af37' : undefined }}
                            aria-label={`Toggle ${category.title}`}
                          >
                            <span
                              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                                category.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={rejectAll}
              className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition hover:bg-gray-100"
              style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
            >
              {t.rejectAll}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1e3a8a', color: 'white' }}
            >
              <Check className="w-5 h-5" />
              {t.savePreferences}
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition hover:opacity-90"
              style={{ backgroundColor: '#d4af37', color: '#1e3a8a' }}
            >
              {t.acceptAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesModal;
