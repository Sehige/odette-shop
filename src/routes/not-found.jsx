import React from 'react';
import NotFoundPage from '../components/pages/NotFoundPage';
import { useAppState } from '../context/AppStateContext';
import { buildMeta } from '../seo/meta';

export const meta = ({ location }) =>
  buildMeta({
    title: 'Pagina nu a fost găsită',
    path: location.pathname,
    description: 'Pagina căutată nu există pe odette-confiserie.ro.',
    noindex: true,
  });

export default function NotFound() {
  const { language } = useAppState();
  return <NotFoundPage language={language} />;
}
