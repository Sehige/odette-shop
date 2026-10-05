import { seoConfig } from '../config/seoConfig';
import { siteConfig } from '../data/siteConfig';

const { contact, company, social, openingHours } = siteConfig;
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Days with the same hours become one entry: Monday-Friday 09:00-19:00, Saturday 08:00-12:00
const openingHoursSpecification = Object.values(
  Object.entries(openingHours).reduce((groups, [day, hours]) => {
    if (!hours) return groups;
    const key = `${hours.open}-${hours.close}`;
    groups[key] = groups[key] || { ...hours, days: [] };
    groups[key].days.push(DAY_NAMES[day]);
    return groups;
  }, {})
).map(({ open, close, days }) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: days.length === 1 ? days[0] : days,
  opens: open,
  closes: close,
}));

/**
 * The business itself (Bakery / LocalBusiness), rendered once in the document
 * head of every page (src/root.jsx). Pages refer to it by its @id.
 */
export const bakeryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  '@id': seoConfig.businessId,
  name: siteConfig.name,
  legalName: company.legalName,
  url: `${seoConfig.siteUrl}/`,
  logo: `${seoConfig.siteUrl}/logo_swan.png`,
  image: seoConfig.defaultImage,
  telephone: contact.phone.replace(/\s/g, ''),
  email: contact.email,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.postalAddress.street,
    addressLocality: contact.postalAddress.city,
    addressRegion: contact.postalAddress.region,
    postalCode: contact.postalAddress.postalCode,
    addressCountry: contact.postalAddress.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: contact.geo.latitude,
    longitude: contact.geo.longitude,
  },
  hasMap: siteConfig.maps.placeUrl,
  openingHoursSpecification,
  sameAs: [social.instagram, social.facebook],
};

/** JSON for a <script type="application/ld+json">, safe against "</script>" in values */
export const jsonLdString = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
