import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoConfig } from '../../config/seoConfig';

const ProductSchema = ({ product, language = 'ro' }) => {
  const productName = language === 'ro' ? product.name_ro : product.name_en;
  const productDescription = language === 'ro' ? product.description_ro : product.description_en;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productName || product.name,
    "image": product.images || [product.image_url],
    "description": productDescription || product.description,
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": seoConfig.business.name
    },
    "offers": {
      "@type": "Offer",
      "url": `${seoConfig.siteUrl}/shop`,
      "priceCurrency": "RON",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": seoConfig.business.name
      }
    },
    "category": product.categoryName || "Pastries"
  };

  if (product.aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.aggregateRating.ratingValue,
      "reviewCount": product.aggregateRating.reviewCount
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default ProductSchema;
