import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  lang = 'ro'
}) => {
  const siteTitle = title ? `${title} | Odette` : 'Odette - Prăjituri Artizanale și Torturi Premium';
  const siteDescription = description || 'Comandă online prăjituri artizanale, torturi personalizate și deserturi premium. Livrare în Cluj-Napoca.';
  const siteImage = image || 'https://www.odette.ro/default-og-image.jpg';
  const siteUrl = url || 'https://www.odette.ro';
  
  return (
    <Helmet>
      <html lang={lang} />
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={siteUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default MetaTags;