import React from 'react';
import { useLoaderData } from 'react-router';
import HomePage from '../components/pages/HomePage';
import { useAppState } from '../context/AppStateContext';
import { Preload } from '../context/PreloadContext';
import { buildMeta } from '../seo/meta';
import { getBestSellers } from '../services/productService';
import { getAllImageSettings } from '../services/imageSettingsService';
import { christmasBannerOn } from '../lib/christmasBanner';
import { must } from './_data';

export async function loader() {
  const [bestSellers, imageSettings] = await Promise.all([getBestSellers(), getAllImageSettings()]);
  return {
    bestSellers: must(bestSellers, 'best sellers'),
    imageSettings: must(imageSettings, 'image settings'),
    // decided when the page is built, so the browser's first render matches the HTML
    christmasBanner: christmasBannerOn(),
  };
}

export const meta = () =>
  buildMeta({
    path: '/',
    description:
      'Odette Confiserie - Comandă online prăjituri artizanale, torturi personalizate și deserturi premium. Livrare în Cluj-Napoca. Ingrediente premium, rețete tradiționale.',
  });

export default function Home() {
  const data = useLoaderData();
  const { language, setSelectedProduct } = useAppState();
  return (
    <Preload data={data}>
      <HomePage language={language} setSelectedProduct={setSelectedProduct} christmasBanner={data.christmasBanner} />
    </Preload>
  );
}
