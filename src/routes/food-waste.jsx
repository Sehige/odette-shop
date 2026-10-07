import React from 'react';
import FoodWastePage from '../components/pages/FoodWastePage';
import { useAppState } from '../context/AppStateContext';
import { buildMeta } from '../seo/meta';

// Legal information like the terms and policies: published for anyone to read, kept out of search results
export const meta = () =>
  buildMeta({
    title: 'Diminuarea risipei alimentare',
    path: '/risipa-alimentara',
    description:
      'Ce facem cu produsele aproape de expirare și planul Olala Sweets SRL de diminuare a risipei alimentare, conform Legii nr. 217/2016.',
    noindex: true,
  });

export default function FoodWaste() {
  const { language } = useAppState();
  return <FoodWastePage language={language} />;
}
