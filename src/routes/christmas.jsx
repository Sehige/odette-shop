import React from 'react';
import ChristmasPage from '../components/pages/ChristmasPage';
import { useAppState } from '../context/AppStateContext';
import { seoConfig } from '../config/seoConfig';
import { christmas } from '../data/christmas';
import { breadcrumbJsonLd, buildMeta } from '../seo/meta';

const PATH = '/craciun';

// The offer as a list (names and anchors); Product markup stays on the product pages
const offerListJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Oferta de Crăciun ${christmas.year} – Odette Confiserie`,
  itemListElement: christmas.sections
    .flatMap((s) => s.items)
    .map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${seoConfig.siteUrl}${PATH}#${item.id}`,
    })),
});

export const meta = () =>
  buildMeta({
    title: 'Cutii de Crăciun și cozonac babka în Cluj-Napoca',
    path: PATH,
    description:
      `Cutii cadou cu prăjituri, cozonac babka, linzere și fursecuri de Crăciun, făcute în Cluj-Napoca. Comenzi până pe ${christmas.orderBy}, cu ridicare sau livrare.`,
    image: `${seoConfig.siteUrl}/craciun-og.jpg`,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Acasă', path: '/' },
        { name: 'Crăciun', path: PATH },
      ]),
      offerListJsonLd(),
    ],
  });

export default function Christmas() {
  const { language } = useAppState();
  return <ChristmasPage language={language} />;
}
