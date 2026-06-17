import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoConfig } from '../../config/seoConfig';

const MetaTags = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  lang = 'ro',
  noindex = false
}) => {
  const siteTitle = title
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.defaultTitle;
  const siteDescription = description || seoConfig.defaultDescription;
  const siteImage = image || seoConfig.defaultImage;
  const canonicalUrl = url
    ? (url.startsWith('http') ? url : `${seoConfig.siteUrl}${url}`)
    : seoConfig.siteUrl;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:locale" content={seoConfig.locale} />
      <meta property="og:site_name" content={seoConfig.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
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
