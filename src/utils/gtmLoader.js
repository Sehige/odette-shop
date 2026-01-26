// GTM Container ID
const GTM_ID = 'GTM-PQZXG9RP';

let gtmLoaded = false;

/**
 * Initialize Google Consent Mode v2 with default denied state
 * Must be called before GTM loads
 */
export const initializeConsentMode = () => {
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  // Set default consent state - all denied until user consents
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted',
    'wait_for_update': 500
  });

  window.gtag = gtag;
};

/**
 * Dynamically loads Google Tag Manager only when consent is given
 * @param {Object} consent - Consent object with analytics and marketing flags
 */
export const loadGTM = (consent) => {
  if (gtmLoaded) return;
  if (!consent.analytics && !consent.marketing) return;

  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];

  // Update consent before loading GTM
  updateGTMConsent(consent);

  // Push GTM start event
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  // Create and inject GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);

  gtmLoaded = true;
};

/**
 * Updates GTM consent mode (for users who change preferences after load)
 * Uses Google Consent Mode v2
 * @param {Object} consent - Consent object with analytics and marketing flags
 */
export const updateGTMConsent = (consent) => {
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag('consent', 'update', {
    'analytics_storage': consent.analytics ? 'granted' : 'denied',
    'ad_storage': consent.marketing ? 'granted' : 'denied',
    'ad_user_data': consent.marketing ? 'granted' : 'denied',
    'ad_personalization': consent.marketing ? 'granted' : 'denied'
  });

  // Push consent update event for GTM triggers
  window.dataLayer.push({
    event: 'consent_update',
    consent_analytics: consent.analytics,
    consent_marketing: consent.marketing
  });
};

/**
 * Check if GTM is already loaded
 * @returns {boolean}
 */
export const isGTMLoaded = () => gtmLoaded;
