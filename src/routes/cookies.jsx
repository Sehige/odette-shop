import React from 'react';
import CookiePolicyPage from '../components/pages/CookiePolicyPage';
import { useAppState } from '../context/AppStateContext';
import { buildMeta } from '../seo/meta';

export const meta = () =>
  buildMeta({
    title: 'Politica de Cookies',
    path: '/cookie-policy',
    description: 'Politica de cookies pentru Odette Confiserie.',
    noindex: true,
  });

export default function Cookies() {
  const { language } = useAppState();
  return <CookiePolicyPage language={language} />;
}
