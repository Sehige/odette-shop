import React from 'react';
import PrivacyPolicyPage from '../components/pages/PrivacyPolicyPage';
import { useAppState } from '../context/AppStateContext';
import { buildMeta } from '../seo/meta';

export const meta = () =>
  buildMeta({
    title: 'Politica de Confidențialitate',
    path: '/privacy-policy',
    description: 'Politica de confidențialitate și protecția datelor personale pentru Odette Confiserie.',
    noindex: true,
  });

export default function Privacy() {
  const { language } = useAppState();
  return <PrivacyPolicyPage language={language} />;
}
