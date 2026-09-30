import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadGTM, updateGTMConsent, initializeConsentMode } from '../utils/gtmLoader';

// Storage key for consent preferences
const CONSENT_STORAGE_KEY = 'odette_cookie_consent';

// Default consent state (all optional cookies disabled by default for GDPR)
const DEFAULT_CONSENT = {
  essential: true,
  analytics: false,
  marketing: false,
  hasConsented: false,
  consentDate: null,
  consentVersion: '1.0'
};

const CookieConsentContext = createContext(null);

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(DEFAULT_CONSENT);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize consent mode on mount (before checking stored consent)
  useEffect(() => {
    initializeConsentMode();
  }, []);

  // Load consent from storage on mount
  useEffect(() => {
    const loadStoredConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (stored) {
          const parsedConsent = JSON.parse(stored);
          setConsent(parsedConsent);

          // If user has previously consented, load GTM accordingly
          if (parsedConsent.hasConsented) {
            loadGTM({
              analytics: parsedConsent.analytics,
              marketing: parsedConsent.marketing
            });
          }
        } else {
          // No stored consent - show banner
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error loading cookie consent:', error);
        setShowBanner(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredConsent();
  }, []);

  // Save consent to storage
  const saveConsent = useCallback((newConsent) => {
    try {
      const consentToSave = {
        ...newConsent,
        hasConsented: true,
        consentDate: new Date().toISOString(),
        consentVersion: '1.0'
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentToSave));
      setConsent(consentToSave);
      setShowBanner(false);
      setShowPreferences(false);

      // Load or update GTM based on consent
      loadGTM({
        analytics: consentToSave.analytics,
        marketing: consentToSave.marketing
      });
      updateGTMConsent({
        analytics: consentToSave.analytics,
        marketing: consentToSave.marketing
      });

      return true;
    } catch (error) {
      console.error('Error saving cookie consent:', error);
      return false;
    }
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true
    });
  }, [saveConsent]);

  // Reject all optional cookies
  const rejectAll = useCallback(() => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false
    });
  }, [saveConsent]);

  // Save custom preferences
  const savePreferences = useCallback((preferences) => {
    saveConsent({
      essential: true,
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false
    });
  }, [saveConsent]);

  // Open preferences modal
  const openPreferences = useCallback(() => {
    setShowPreferences(true);
    setShowBanner(false);
  }, []);

  // Close preferences modal
  const closePreferences = useCallback(() => {
    setShowPreferences(false);
    // Show banner again if user hasn't consented
    if (!consent.hasConsented) {
      setShowBanner(true);
    }
  }, [consent.hasConsented]);

  // Reset consent (for testing or user request)
  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsent(DEFAULT_CONSENT);
    setShowBanner(true);
  }, []);

  const value = {
    consent,
    showBanner,
    showPreferences,
    isLoading,
    acceptAll,
    rejectAll,
    savePreferences,
    openPreferences,
    closePreferences,
    resetConsent,
    hasConsented: consent.hasConsented
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

// Custom hook
export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
};

export default CookieConsentContext;
