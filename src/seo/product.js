import { seoConfig } from '../config/seoConfig';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const plain = (value) => (value || '').replace(/\s+/g, ' ').trim();

export const productPath = (product) => `/produse/${product.slug}`;
export const productUrl = (product) => `${seoConfig.siteUrl}${productPath(product)}`;

// Cakes are made to order; everything else is in stock when listed
const isMadeToOrder = (product) =>
  /tort/i.test(product.categoryNameRo || '') || /cake/i.test(product.categoryName || '');

/** Meta description: the product description, cut at a word near 160 characters */
export const productDescription = (product) => {
  const text = plain(product.description_ro) || `${product.name_ro} – produs artizanal Odette Confiserie, Cluj-Napoca.`;
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…` : text;
};

/** Link-preview image: the main photo cropped to 1200×630 around its subject */
export const productShareImage = (product) =>
  getOptimizedImageUrl(product.image_url, {
    width: 1200,
    height: 630,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good',
    format: 'jpg',
  });

/** Product JSON-LD for the product page (price in RON; per-kg prices as a unit price) */
export const productJsonLd = (product) => {
  const url = productUrl(product);
  const price = Number(product.price);
  const images = (product.images && product.images.length ? product.images : [product.image_url]).filter(Boolean);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name_ro,
    description: plain(product.description_ro) || undefined,
    image: images,
    url,
    sku: product.id,
    category: product.categoryNameRo || undefined,
    brand: { '@type': 'Brand', name: seoConfig.siteName },
  };

  // No offer for products without a price, rather than advertising 0 RON
  if (price > 0) {
    ld.offers = {
      '@type': 'Offer',
      url,
      price: price.toFixed(2),
      priceCurrency: 'RON',
      availability: isMadeToOrder(product) ? 'https://schema.org/MadeToOrder' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': seoConfig.businessId },
      ...(product.price_unit === 'kg'
        ? {
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: price.toFixed(2),
              priceCurrency: 'RON',
              referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'KGM' },
            },
          }
        : {}),
    };
  }

  return JSON.parse(JSON.stringify(ld)); // drops the undefined fields
};
