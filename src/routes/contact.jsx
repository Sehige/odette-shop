import React from 'react';
import ContactPage from '../components/pages/ContactPage';
import { useAppState } from '../context/AppStateContext';
import { seoConfig } from '../config/seoConfig';
import { breadcrumbJsonLd, buildMeta } from '../seo/meta';

export const meta = () =>
  buildMeta({
    title: 'Contact',
    path: '/contact',
    description:
      'Contactează Odette Confiserie pentru comenzi de prăjituri și torturi. Telefon, email, adresă în Cluj-Napoca.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact',
        url: `${seoConfig.siteUrl}/contact`,
        mainEntity: { '@id': seoConfig.businessId },
      },
      breadcrumbJsonLd([
        { name: 'Acasă', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
    ],
  });

export default function Contact() {
  const { language } = useAppState();
  return <ContactPage language={language} />;
}
