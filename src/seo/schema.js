import { seoConfig } from '../config/seoConfig';

const { business } = seoConfig;

/**
 * The business itself (Bakery / LocalBusiness), rendered once in the document
 * head of every page (src/root.jsx). Pages refer to it by its @id.
 */
export const bakeryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  '@id': seoConfig.businessId,
  name: business.name,
  legalName: business.legalName,
  url: `${seoConfig.siteUrl}/`,
  logo: `${seoConfig.siteUrl}/logo_swan.png`,
  image: seoConfig.defaultImage,
  telephone: business.phone,
  email: business.email,
  priceRange: business.priceRange,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: 'Cluj',
    postalCode: business.address.postalCode,
    addressCountry: business.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: business.geo.latitude,
    longitude: business.geo.longitude,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '12:00',
    },
  ],
  sameAs: [business.social.instagram, business.social.facebook],
};

/** JSON for a <script type="application/ld+json">, safe against "</script>" in values */
export const jsonLdString = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
