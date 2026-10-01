import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLocation, useMatches } from 'react-router';
import './index.css';
import { seoConfig } from './config/seoConfig';
import { bakeryJsonLd, jsonLdString } from './seo/schema';
import { AppStateContext } from './context/AppStateContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { ImageSettingsProvider } from './context/ImageSettingsContext';
import CookieConsentBanner from './components/cookies/CookieConsentBanner';
import CookiePreferencesModal from './components/cookies/CookiePreferencesModal';
import ProductDetail from './components/products/ProductDetail';

// The HTML document shared by every page (replaces the old index.html).
// Page-specific tags (title, description, canonical, Open Graph, JSON-LD)
// come from each route's `meta` export and are rendered by <Meta />.
export function Layout({ children }) {
  return (
    <html lang="ro">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo_swan.png" />
        <link rel="apple-touch-icon" href="/favicon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google Fonts: Parisienne (script hero tagline) + Playfair Display (headings) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Parisienne&family=Playfair+Display:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Product photos are served through Cloudinary */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <meta name="author" content="Odette Confiserie" />
        <meta name="geo.region" content="RO-CJ" />
        <meta name="geo.placename" content="Cluj-Napoca" />
        <meta name="geo.position" content="46.752273185339014; 23.56535278292503" />
        <meta name="ICBM" content="46.752273185339014, 23.56535278292503" />
        <Meta />
        <Links />
        {/* The business itself, once for the whole site; pages refer to it by @id */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(bakeryJsonLd) }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Used only where a page has no meta of its own (the single-page fallback)
export const meta = () => [{ title: seoConfig.defaultTitle }];

export default function App() {
  const [language, setLanguage] = useState('ro');

  // The open product and the page it was opened on: it shows only on that page, so
  // leaving the page closes it ("Contactează-ne" in the modal goes to /contact)
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const [opened, setOpened] = useState(null);
  const setSelectedProduct = useCallback(
    (product) => setOpened(product ? { product, pathname: pathnameRef.current } : null),
    []
  );
  const closeProduct = useCallback(() => setOpened(null), []);
  const selectedProduct = opened && opened.pathname === pathname ? opened.product : null;
  // forget a product left behind on another page, so coming back doesn't reopen it
  useEffect(() => {
    setOpened((current) => (current && current.pathname !== pathname ? null : current));
  }, [pathname]);

  // <html lang> follows the language toggle
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Image framing the current page loaded at build time, if any
  const matches = useMatches();
  const initialImageSettings = matches.find((m) => m.data && m.data.imageSettings)?.data.imageSettings;

  return (
    <CookieConsentProvider>
      <ImageSettingsProvider initialRows={initialImageSettings}>
        <AppStateContext.Provider value={{ language, setLanguage, selectedProduct, setSelectedProduct }}>
          <div className="min-h-screen bg-white">
            <Outlet />

            {/* Product Detail Modal */}
            {selectedProduct && (
              <ProductDetail product={selectedProduct} language={language} onClose={closeProduct} />
            )}

            {/* Cookie Consent Components */}
            <CookieConsentBanner language={language} />
            <CookiePreferencesModal language={language} />
          </div>
        </AppStateContext.Provider>
      </ImageSettingsProvider>
    </CookieConsentProvider>
  );
}

// Shown by the single-page fallback (addresses that are not prerendered) until the app loads
export function HydrateFallback() {
  return <div className="min-h-screen bg-white" />;
}

export function ErrorBoundary({ error }) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1e3a8a] mb-4">
          {notFound ? 'Pagina nu a fost găsită' : 'A apărut o eroare'}
        </h1>
        <a href="/" className="underline text-[#1e3a8a]">Înapoi la pagina principală</a>
      </div>
    </main>
  );
}
