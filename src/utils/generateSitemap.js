// This should be run as a build script
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.odette.ro';

const staticPages = [
  { url: '', changefreq: 'daily', priority: '1.0' },
  { url: '/shop', changefreq: 'daily', priority: '0.9' },
  { url: '/about', changefreq: 'monthly', priority: '0.7' },
  { url: '/contact', changefreq: 'monthly', priority: '0.7' },
  { url: '/events', changefreq: 'monthly', priority: '0.8' },
  { url: '/faq', changefreq: 'monthly', priority: '0.6' },
];

// You'll need to fetch products dynamically from your database
const generateProductPages = (products) => {
  return products.map(product => ({
    url: `/products/${product.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: product.updatedAt
  }));
};

const generateSitemap = (products = []) => {
  const pages = [...staticPages, ...generateProductPages(products)];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '../../public/sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully!');
};

module.exports = generateSitemap;