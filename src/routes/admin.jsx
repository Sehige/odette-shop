import React from 'react';
import AdminLoginPage from '../components/pages/AdminLoginPage';
import { useAppState } from '../context/AppStateContext';
import { buildMeta } from '../seo/meta';

export const meta = () =>
  buildMeta({
    title: 'Admin',
    path: '/admin',
    description: 'Administrare Odette Confiserie.',
    noindex: true,
  });

export default function Admin() {
  const { language } = useAppState();
  return <AdminLoginPage language={language} />;
}
