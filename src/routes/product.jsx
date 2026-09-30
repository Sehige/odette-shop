import React from 'react';
import { data, useLoaderData } from 'react-router';
import ProductPage from '../components/products/ProductPage';
import NotFoundPage from '../components/pages/NotFoundPage';
import { useAppState } from '../context/AppStateContext';
import { breadcrumbJsonLd, buildMeta } from '../seo/meta';
import { productDescription, productJsonLd, productPath, productShareImage } from '../seo/product';
import { getProductBySlug } from '../services/productService';
import { getAllImageSettings } from '../services/imageSettingsService';
import { must } from './_data';

export async function loader({ params }) {
  const [product, imageSettings] = await Promise.all([getProductBySlug(params.slug), getAllImageSettings()]);
  if (product.error) must(product, `product ${params.slug}`); // a Supabase failure fails the build
  if (!product.data) throw data(null, { status: 404 });
  return { product: product.data, imageSettings: must(imageSettings, 'image settings') };
}

export const meta = ({ loaderData, params }) => {
  const product = loaderData?.product;
  if (!product) {
    return buildMeta({
      title: 'Pagina nu a fost găsită',
      path: `/produse/${params.slug}`,
      description: 'Produsul căutat nu există pe odette-confiserie.ro.',
      noindex: true,
    });
  }
  const path = productPath(product);
  return buildMeta({
    title: product.name_ro,
    path,
    description: productDescription(product),
    image: productShareImage(product),
    jsonLd: [
      productJsonLd(product),
      breadcrumbJsonLd([
        { name: 'Acasă', path: '/' },
        { name: 'Produse', path: '/shop' },
        { name: product.name_ro, path },
      ]),
    ],
  });
};

export default function Product() {
  const { product } = useLoaderData();
  const { language } = useAppState();
  return <ProductPage product={product} language={language} />;
}

// Unknown or removed product: not-found page inside the site layout
export function ErrorBoundary() {
  const { language } = useAppState();
  return <NotFoundPage language={language} />;
}
