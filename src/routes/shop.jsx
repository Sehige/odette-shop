import React from 'react';
import { useLoaderData } from 'react-router';
import ShopPage from '../components/shop/ShopPage';
import { useAppState } from '../context/AppStateContext';
import { Preload } from '../context/PreloadContext';
import { breadcrumbJsonLd, buildMeta, countRo } from '../seo/meta';
import { productListJsonLd } from '../seo/product';
import { loadShopData } from './_data';

export const loader = () => loadShopData();

const TITLE = 'Magazin Online - Prăjituri și Torturi';

export const meta = ({ loaderData }) => {
  const products = loaderData?.products || [];
  return buildMeta({
    title: TITLE,
    path: '/shop',
    description: `Descoperă ${countRo(products.length, 'prăjitură artizanală', 'prăjituri artizanale')} și torturi premium. Comandă online cu livrare în Cluj-Napoca.`,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Acasă', path: '/' },
        { name: 'Produse', path: '/shop' },
      ]),
      productListJsonLd(TITLE, products),
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
