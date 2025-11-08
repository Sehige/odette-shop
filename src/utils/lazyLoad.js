import { lazy, Suspense } from 'react';

// Lazy load route components
export const HomePage = lazy(() => import('../pages/HomePage'));
export const ShopPage = lazy(() => import('../pages/ShopPage'));
export const ProductPage = lazy(() => import('../pages/ProductPage'));
export const AboutPage = lazy(() => import('../pages/AboutPage'));
export const ContactPage = lazy(() => import('../pages/ContactPage'));

// Loading component
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
  </div>
);

// Wrapper component
export const LazyRoute = ({ component: Component }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);