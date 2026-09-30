import React from 'react';
import { data, useLoaderData } from 'react-router';
import ShopPage from '../components/shop/ShopPage';
import NotFoundPage from '../components/pages/NotFoundPage';
import { useAppState } from '../context/AppStateContext';
import { Preload } from '../context/PreloadContext';
import { breadcrumbJsonLd, buildMeta, countRo } from '../seo/meta';
import { productListJsonLd } from '../seo/product';
import { loadShopData } from './_data';

// Category pages (/torturi, /babka, ...): the shop grid narrowed to one category.
// Only categories with active products exist (getCategories), so others are 404.
export async function loader({ params }) {
  const shopData = await loadShopData();
  const category = shopData.categories.find((c) => c.slug === params.category);
  if (!category) throw data(null, { status: 404 });
  return { ...shopData, category };
}

const plain = (value) => (value || '').replace(/\s+/g, ' ').trim();
const cut = (text) => (text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…` : text);

// Title, description and intro come from the category's SEO fields in Supabase when filled in
export const meta = ({ loaderData, location }) => {
  const category = loaderData?.category;
  if (!category) {
    return buildMeta({
      title: 'Pagina nu a fost găsită',
      path: location.pathname,
      description: 'Pagina căutată nu există pe odette-confiserie.ro.',
      noindex: true,
    });
  }
  const products = (loaderData.products || []).filter((p) => p.category === category.id);
  const path = `/${category.slug}`;
  const description =
    plain(category.seo_description) ||
    cut(plain(category.intro_ro)) ||
    `${category.name_ro} de la Odette Confiserie, cofetărie artizanală din Cluj-Napoca: ${countRo(products.length, 'produs', 'produse')}, cu ingrediente, alergeni și prețuri. Livrare în Cluj-Napoca.`;
  return buildMeta({
    title: plain(category.seo_title) || category.name_ro,
    path,
    description,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Acasă', path: '/' },
        { name: 'Produse', path: '/shop' },
        { name: category.name_ro, path },
      ]),
      productListJsonLd(category.name_ro, products),
    ],
  });
};

export default function Category() {
  const loaderData = useLoaderData();
  const { language, selectedProduct, setSelectedProduct } = useAppState();
  return (
    <Preload data={loaderData}>
      <ShopPage
        category={loaderData.category}
        language={language}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </Preload>
  );
}

// Unknown category (or any other unknown one-segment address): not-found page in the layout
export function ErrorBoundary() {
  const { language } = useAppState();
  return <NotFoundPage language={language} />;
}
