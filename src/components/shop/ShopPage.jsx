import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { translations } from '../../data/translations';
import ProductCard from '../products/ProductCard';

import { useAllProducts, useCategories } from '../../hooks/useProducts';
import { useGalleryImages } from '../../hooks/useGallery';
import useSupabaseSession from '../../hooks/useSupabaseSession';
import CakeGalleryCarousel from './CakeGalleryCarousel';
import CakeOrderSteps from './CakeOrderSteps';

// ?product only changes what this page shows, so keep the scroll position
// (the router otherwise scrolls to the top on every URL change).
const KEEP_SCROLL = { preventScrollReset: true };

const filterClass = (active) =>
  `px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition ${
    active ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
  }`;

/**
 * The product grid. On /shop it lists everything; on a category page (/torturi,
 * /babka, ...) `category` narrows it to that category and supplies the heading and
 * intro. The category buttons are links to those pages.
 */
const ShopPage = ({ language, setSelectedProduct, selectedProduct, category }) => {
  const shopT = translations[language].shop;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // Product counts in section titles are shown only to the logged-in admin
  const { isAdmin } = useSupabaseSession();

  const { products: allProducts, loading: productsLoading, error: productsError } = useAllProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { images: galleryImages } = useGalleryImages();
  const selectedCategory = category ? category.id : 'all';

  // Past-work photos for the selected category (e.g. Torturi). Empty on "all".
  const galleryForCategory = selectedCategory === 'all'
    ? []
    : galleryImages.filter((g) => g.category_id === selectedCategory);

  // Whether this is the cakes (Torturi) category, to show the how-to-order steps.
  const isCakeCategory = !!category && (
    (category.name_ro || '').toLowerCase().includes('tort') ||
    (category.name_en || '').toLowerCase().includes('cake')
  );

  // Old links filtered the shop with ?filter=<categoryId>: send them to the category page,
  // which then opens the product the link names, if any
  const filterId = !category && searchParams.get('filter');
  const legacyCategory = filterId ? categories.find((c) => c.id === filterId && c.slug) : null;
  useEffect(() => {
    if (!legacyCategory) return;
    const product = searchParams.get('product');
    navigate(`/${legacyCategory.slug}${product ? `?product=${encodeURIComponent(product)}` : ''}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacyCategory]);

  // Open a product by naming it in the URL (?product=<slug>), so the link can be shared;
  // the effect below then opens it. Opening only once the URL has changed keeps the
  // modal's own history entry on top, so closing the modal leaves no extra entry behind.
  // `replace` avoids stacking a second entry for the same product.
  const openProduct = (product) => {
    if (searchParams.get('product') === product.slug) {
      setSelectedProduct(product);
      return;
    }
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('product', product.slug);
      return params;
    }, { ...KEEP_SCROLL, replace: true });
  };

  // Open the product named in the URL once products have loaded (shared link).
  // Older links carry the product id instead of the slug; both are accepted.
  useEffect(() => {
    const wanted = searchParams.get('product');
    if (!wanted || !allProducts.length || legacyCategory) return;
    const matches = (p) => p && (p.slug === wanted || p.id === wanted);
    if (!matches(selectedProduct)) {
      const product = allProducts.find(matches);
      if (product) setSelectedProduct(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allProducts]);

  // When the modal closes (product -> null), drop the ?product param.
  const prevProductRef = React.useRef(null);
  useEffect(() => {
    const prev = prevProductRef.current;
    prevProductRef.current = selectedProduct;
    if (prev && !selectedProduct && searchParams.get('product')) {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.delete('product');
        return next;
      }, { ...KEEP_SCROLL, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  const filteredProducts = (selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory)
  ).sort((a, b) => {
    const orderA = a.order_index ?? 1000;
    const orderB = b.order_index ?? 1000;
    if (orderA !== orderB) return orderA - orderB;
    const nameA = (language === 'ro' ? a.name_ro : a.name_en) || '';
    const nameB = (language === 'ro' ? b.name_ro : b.name_en) || '';
    return nameA.localeCompare(nameB, language);
  });

  const heading = category
    ? (language === 'ro' ? category.name_ro : category.name_en) || category.name_ro
    : shopT.title;
  const intro = category ? (language === 'ro' ? category.intro_ro : category.intro_en) : null;

  // Loading state - use skeleton that matches final layout to prevent CLS
  if (productsLoading || categoriesLoading) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Skeleton Header */}
          <div className="text-center mb-6 sm:mb-12 min-h-[80px] sm:min-h-[120px]">
            <div className="h-8 sm:h-12 bg-gray-200 rounded-lg w-36 sm:w-48 mx-auto mb-2 sm:mb-4 animate-pulse"></div>
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-48 sm:w-64 mx-auto animate-pulse"></div>
          </div>

          {/* Skeleton Filter */}
          <div className="mb-4 sm:mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[36px] sm:min-h-[44px]">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-3 sm:p-6">
                  <div className="h-4 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 sm:mb-4 hidden sm:block animate-pulse"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {shopT.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            {shopT.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-32 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header - min-height matches skeleton to prevent CLS */}
        <div className="text-center mb-6 sm:mb-12 min-h-[80px] sm:min-h-[120px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 sm:mb-4">
            {heading}
          </h1>
          {intro ? (
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto whitespace-pre-line">
              {intro}
            </p>
          ) : (
            <p className="text-base sm:text-xl text-gray-600">
              {isAdmin
                ? (language === 'ro'
                    ? `Descoperă ${filteredProducts.length} ${shopT.productsCount}`
                    : `Discover ${filteredProducts.length} ${shopT.productsCount}`)
                : shopT.subtitle}
            </p>
          )}
        </div>

        {/* Category links - min-height to prevent CLS. Switching category keeps the scroll position. */}
        <nav
          aria-label={language === 'ro' ? 'Categorii' : 'Categories'}
          className="mb-4 sm:mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[36px] sm:min-h-[44px]"
        >
          {/* Sorted by order_index then alphabetically */}
          {[...categories].sort((a, b) => {
            const orderA = a.order_index ?? 1000;
            const orderB = b.order_index ?? 1000;
            if (orderA !== orderB) return orderA - orderB;
            const nameA = (language === 'ro' ? a.name_ro : a.name_en) || '';
            const nameB = (language === 'ro' ? b.name_ro : b.name_en) || '';
            return nameA.localeCompare(nameB, language);
          }).map(item => {
            const count = allProducts.filter(p => p.category === item.id).length;
            const active = selectedCategory === item.id;
            return (
              <Link
                key={item.id}
                to={`/${item.slug}`}
                preventScrollReset
                aria-current={active ? 'page' : undefined}
                className={filterClass(active)}
              >
                {language === 'ro' ? item.name_ro : item.name_en}{isAdmin ? ` (${count})` : ''}
              </Link>
            );
          })}

          {/* All products - at the end */}
          <Link
            to="/shop"
            preventScrollReset
            aria-current={selectedCategory === 'all' ? 'page' : undefined}
            className={filterClass(selectedCategory === 'all')}
          >
            {shopT.all}{isAdmin ? ` (${allProducts.length})` : ''}
          </Link>
        </nav>

        {/* "How to order a cake" steps — shown in the cakes (Torturi) category */}
        {isCakeCategory && <CakeOrderSteps language={language} />}

        {/* Past-work cake gallery (shown for categories that have gallery photos) */}
        <CakeGalleryCarousel images={galleryForCategory} language={language} />

        {/* "Arome" heading for the priced products, shown alongside the gallery */}
        {galleryForCategory.length > 0 && (
          <h2 className="text-left font-serif font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
            {shopT.flavorsTitle}
          </h2>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                setSelectedProduct={openProduct}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              {shopT.noProducts}
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ShopPage;
