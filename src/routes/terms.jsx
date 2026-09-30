import React from 'react';
import TermsAndConditionsPage from '../components/pages/TermsAndConditionsPage';
import { useAppState } from '../context/AppStateContext';
import { buildMeta } from '../seo/meta';

export const meta = () =>
  buildMeta({
    title: 'Termeni și Condiții',
    path: '/terms-and-conditions',
    description: 'Termeni și condiții de utilizare pentru Odette Confiserie.',
    noindex: true,
  });

export default function Terms() {
  const { language } = useAppState();
  return <TermsAndConditionsPage language={language} />;
}
