import React from 'react';
import HeroSection from '../home/HeroSection';
import AboutStory from '../home/AboutStory';
import BestSellers from '../home/BestSellers';
import FAQ from '../home/FAQ';
import MetaTags from '../SEO/MetaTags';
import { seoConfig } from '../../config/seoConfig';

const HomePage = ({ language, setSelectedProduct }) => {
  const isRomanian = language === 'ro';

  const pageData = {
    description: isRomanian
      ? 'Odette Confiserie - Comanda online prajituri artizanale, torturi personalizate si deserturi premium. Livrare in Cluj-Napoca. Ingrediente premium, retete traditionale.'
      : 'Odette Confiserie - Order online artisan pastries, custom cakes and premium desserts. Delivery in Cluj-Napoca. Premium ingredients, traditional recipes.',
    keywords: isRomanian
      ? 'prajituri Cluj-Napoca, torturi personalizate, cofetarie online, deserturi premium, torturi nunta, prajituri evenimente'
      : 'pastries Cluj-Napoca, custom cakes, online bakery, premium desserts, wedding cakes, event pastries'
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Bakery", "LocalBusiness"],
    "@id": `${seoConfig.siteUrl}/#organization`,
    "name": seoConfig.business.name,
    "legalName": seoConfig.business.legalName,
    "url": seoConfig.siteUrl,
    "logo": `${seoConfig.siteUrl}/logo_swan.png`,
    "image": seoConfig.defaultImage,
    "telephone": seoConfig.business.phone,
    "email": seoConfig.business.email,
    "priceRange": seoConfig.business.priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoConfig.business.address.street,
      "addressLocality": seoConfig.business.address.city,
      "postalCode": seoConfig.business.address.postalCode,
      "addressCountry": seoConfig.business.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": seoConfig.business.geo.latitude,
      "longitude": seoConfig.business.geo.longitude
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "12:00"
      }
    ],
    "sameAs": [
      seoConfig.business.social.instagram,
      seoConfig.business.social.facebook
    ]
  };

  return (
    <>
      <MetaTags
        description={pageData.description}
        keywords={pageData.keywords}
        url={seoConfig.siteUrl}
        structuredData={organizationSchema}
        lang={language}
      />
      <HeroSection language={language} />
      <AboutStory language={language} />
      <BestSellers
        language={language}
        setSelectedProduct={setSelectedProduct}
      />
      <FAQ language={language} />
    </>
  );
};

export default HomePage;
