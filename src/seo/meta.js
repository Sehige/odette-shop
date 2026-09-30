import { seoConfig } from '../config/seoConfig';

/**
 * The complete <head> tags for one route, in React Router's `meta` format.
 * Each route returns the full set (a route's meta replaces its parents'), so
 * every page gets its own title, description, self-referencing canonical,
 * Open Graph / Twitter tags and, optionally, JSON-LD — all in the prerendered HTML.
 *
 * @param {object} o
 * @param {string} [o.title]       page title; the site name is appended. Omit for the default title.
 * @param {string} o.description
 * @param {string} o.path          '/', '/shop', ...
 * @param {string} [o.image]       absolute URL; defaults to the site share image
 * @param {boolean} [o.noindex]
 * @param {object[]} [o.jsonLd]    structured-data objects
 */
export function buildMeta({ title, description, path, image, noindex = false, jsonLd = [] }) {
  const fullTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  const url = `${seoConfig.siteUrl}${path}`;
  const shareImage = image || seoConfig.defaultImage;
  const isDefaultImage = shareImage === seoConfig.defaultImage;

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { name: 'robots', content: noindex ? 'noindex, follow' : 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:image', content: shareImage },
    ...(isDefaultImage
      ? [
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
          { property: 'og:image:alt', content: seoConfig.defaultImageAlt },
        ]
      : []),
    { property: 'og:locale', content: seoConfig.locale },
    { property: 'og:site_name', content: seoConfig.siteName },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: shareImage },
    ...jsonLd.map((data) => ({ 'script:ld+json': data })),
  ];
}

/** BreadcrumbList JSON-LD from [{ name, path }] */
export const breadcrumbJsonLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${seoConfig.siteUrl}${item.path}`,
  })),
});

/** Romanian count: "1 produs", "10 produse", "35 de produse" (numbers from 20 up take "de") */
export const countRo = (n, singular, plural) => {
  if (n === 1) return `1 ${singular}`;
  const de = n % 100 >= 20 || (n > 0 && n % 100 === 0) ? ' de' : '';
  return `${n}${de} ${plural}`;
};
