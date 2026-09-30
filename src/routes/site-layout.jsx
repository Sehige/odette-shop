import React from 'react';
import Layout from '../components/layout/Layout';
import { useAppState } from '../context/AppStateContext';

// Header + footer around every page; Layout renders the page in its <Outlet />
export default function SiteLayout() {
  const { language, setLanguage } = useAppState();
  return <Layout language={language} setLanguage={setLanguage} />;
}
