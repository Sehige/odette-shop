import React from 'react';
import { useLoaderData } from 'react-router';
import ShopPage from '../components/shop/ShopPage';
import { useAppState } from '../context/AppStateContext';
import { Preload } from '../context/PreloadContext';
import { breadcrumbJsonLd, buildMeta } from '../seo/meta';
import { getAllProducts, getCategories } from '../services/productService';
import { getGalleryImages } from '../services/galleryService';
import { getAllImageSettings } from '../services/imageSettingsService';
import { must } from './_data';

export async function loader() {
  const [products, categories, galleryImages, imageSettings] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getGalleryImages(),
    getAllImageSettings(),
  ]);
  return {
    products: must(products, 'products'),
    categories: must(categories, 'categories'),
    galleryImages: must(galleryImages, 'gallery images'),
    imageSettings: must(imageSettings, 'image settings'),
  };
}

const TITLE = 'Magazin Online - Prăjituri și Torturi';

export const meta = ({ loaderData }) => {
  const products = loaderData?.products || [];
  // Same order as the shop grid: order_index, then name
  const ordered = [...products].sort(
    (a, b) => (a.order_index ?? 1000) - (b.order_index ?? 1000) || (a.name_ro || '').localeCompare(b.name_ro || '', 'ro')
  );
  return buildMeta({
    title: TITLE,
    path: '/shop',
    description: `Descoperă ${products.length} prăjituri artizanale și torturi premium. Comandă online cu livrare în Cluj-Napoca.`,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Acasă', path: '/' },
        { name: 'Magazin', path: '/shop' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: TITLE,
        numberOfItems: products.length,
        itemListElement: ordered.slice(0, 10).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name_ro,
            image: product.image_url,
            offers: { '@type': 'Offer', price: product.price, priceCurrency: 'RON' },
          },
        })),
      },
    ],
  });
};

export default function Shop() {
  const data = useLoaderData();
  const { language, selectedProduct, setSelectedProduct } = useAppState();
  return (
    <Preload data={data}>
      <ShopPage language={language} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
    </Preload>
  );
}
