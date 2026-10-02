import React from 'react';
import OrderPage from '../components/order/OrderPage';
import { useAppState } from '../context/AppStateContext';
import { buildMeta } from '../seo/meta';

// The visitor's own order list: nothing for search engines here
export const meta = () =>
  buildMeta({
    title: 'Comanda ta',
    path: '/comanda',
    description: 'Trimite comanda către Odette Confiserie: ridicare din magazin sau livrare în Cluj-Napoca.',
    noindex: true,
  });

export default function Order() {
  const { language } = useAppState();
  return <OrderPage language={language} />;
}
