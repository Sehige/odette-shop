// End-to-end checks in a real browser (headless Chrome driven by puppeteer-core).
//
//   npm run build && npm run test:e2e                          the local build, served like Vercel
//   BASE=https://www.odette-confiserie.ro npm run test:e2e     the live site
//
// Uses an installed Chrome or Edge; set CHROME_PATH if it lives elsewhere.
// Analytics requests are detected but blocked, so test runs never reach Google Analytics.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { startServer } from './serve.mjs';
import { christmas } from '../src/data/christmas.js';

// The Christmas banner and buttons show until the last day to order (src/lib/christmasBanner.js)
const christmasOn = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(new Date()) <= christmas.bannerUntil;

const executablePath = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && fs.existsSync(p));
if (!executablePath) {
  console.error('No Chrome or Edge found: set CHROME_PATH');
  process.exit(1);
}

const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass: !!pass, detail: String(detail ?? '') });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ANALYTICS = /googletagmanager\.com|google-analytics\.com/;
// the Google map on /contact runs Google's own code, which now and then logs its own network errors
const GOOGLE_MAP = /maps\.googleapis\.com|maps\.gstatic\.com|google\.com\/maps|<gmp-/;
// any Google host (fonts, maps, analytics): nothing may load from these before cookie consent
const GOOGLE = /(^|\.)(google\.[a-z.]+|googleapis\.com|gstatic\.com|googletagmanager\.com|google-analytics\.com|doubleclick\.net)$/;
const CLOSE = '[role="dialog"] button[aria-label="Închide"]';
const STATUS_TEXT = /^(Deschis acum · închide la \d\d:\d\d|Închide în curând · la \d\d:\d\d|Închis( · deschide .+ la \d\d:\d\d)?)$/;
const CARDS = '.grid a[href^="/produse/"]';
const errors = [];

let server;
let BASE = process.env.BASE;
if (!BASE) {
  server = await startServer();
  BASE = server.url;
}
const browser = await puppeteer.launch({ executablePath, headless: true });

async function newPage({ viewport = { width: 1280, height: 800 }, dismissCookies = true } = {}) {
  const page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport(viewport);
  await page.setRequestInterception(true);
  page.analytics = [];
  page.google = [];
  page.enquiries = [];
  page.enquiryAnswer = { status: 200, body: { ok: true } };
  page.dismissCookies = dismissCookies;
  page.on('request', (r) => {
    if (GOOGLE.test(new URL(r.url()).hostname)) page.google.push(r.url());
    // The contact form's message is answered here, never sent: that would email the shop.
    // The browser's permission check (OPTIONS) does reach the real function.
    if (/\/functions\/v1\/submit-enquiry/.test(r.url())) {
      if (r.method() === 'OPTIONS') return r.continue();
      const headers = { 'Access-Control-Allow-Origin': '*' };
      page.enquiries.push(JSON.parse(r.postData() || '{}'));
      return r.respond({ status: page.enquiryAnswer.status, headers, contentType: 'application/json', body: JSON.stringify(page.enquiryAnswer.body) });
    }
    if (ANALYTICS.test(r.url())) { page.analytics.push(r.url()); r.abort(); } else r.continue();
  });
  page.on('pageerror', (e) => errors.push(`${page.url()}: ${e.message}`));
  page.expectErrors = false; // set by checks that provoke an error answer on purpose
  // unknown addresses answer 404 on purpose, and blocked analytics requests fail on purpose;
  // the browser logs both as failed resources
  page.on('console', (m) => {
    const from = m.location()?.url || '';
    if (m.type() !== 'error' || page.expectErrors || /status of 404/.test(m.text()) || ANALYTICS.test(from)) return;
    if (GOOGLE_MAP.test(from) || GOOGLE_MAP.test(m.text())) return;
    errors.push(`${page.url()}: ${m.text()}`);
  });
  return page;
}
const clickText = (page, selector, text) =>
  page.evaluate((s, t) => {
    const el = [...document.querySelectorAll(s)].find((e) => e.textContent.includes(t));
    if (el) el.click();
    return !!el;
  }, selector, text);
// DOM click: works even where the fixed header covers the element
const domClick = (page, selector) =>
  page.evaluate((s) => { const el = document.querySelector(s); if (el) el.click(); return !!el; }, selector);
const scrollY = (page) => page.evaluate(() => window.scrollY);
const where = (page) => page.evaluate(() => location.pathname + location.search);
// waitUntil 'load' where a third-party frame (the Google map) never lets the network go quiet
async function open(page, path, { waitUntil = 'networkidle0' } = {}) {
  // 120 s: on a slow connection the live site can take a while to go quiet
  const res = await page.goto(BASE + path, { waitUntil, timeout: 120000 });
  if (page.dismissCookies) await clickText(page, 'button', 'Respinge opționale');
  return res;
}
async function raw(path) {
  const res = await fetch(BASE + path, { redirect: 'manual' });
  return { status: res.status, location: res.headers.get('location'), html: res.status >= 300 && res.status < 400 ? '' : await res.text() };
}
const pick = (html, re) => (html.match(re) || [])[1];

try {
  // 1. What search engines and link previews get: the HTML, without JavaScript
  const shop = await raw('/shop');
  const productPaths = [...new Set([...shop.html.matchAll(/href="(\/produse\/[^"?]+)"/g)].map((m) => m[1]))];
  const categoryNav = (shop.html.match(/<nav aria-label="Categorii"[\s\S]*?<\/nav>/) || [''])[0];
  const categoryPaths = [...new Set([...categoryNav.matchAll(/href="(\/[^"]+)"/g)].map((m) => m[1]))].filter((p) => p !== '/shop');
  check('HTML: /shop links every product page', productPaths.length >= 30, `${productPaths.length} products`);
  check('HTML: /shop links the category pages', categoryPaths.length >= 3, categoryPaths.join(' '));
  for (const path of ['/', '/shop', '/contact', categoryPaths[0], productPaths[0]]) {
    const r = await raw(path);
    const canonical = pick(r.html, /rel="canonical" href="([^"]+)"/) || '';
    const h1 = (pick(r.html, /<h1[^>]*>([\s\S]*?)<\/h1>/) || '').replace(/<[^>]+>/g, '').trim();
    check(`HTML ${path}: 200, title, own canonical, h1`,
      r.status === 200 && pick(r.html, /<title>([^<]+)<\/title>/) && canonical.endsWith(path) && h1, `${r.status} ${canonical} "${h1}"`);
  }
  const productHtml = (await raw(productPaths[0])).html;
  check('HTML product page: allergens and Product structured data', /Alergeni/.test(productHtml) && /"@type":"Product"/.test(productHtml));
  for (const path of ['/nu-exista-pagina-test', '/a/b/c', '/produse/nu-exista-produs-test']) {
    check(`HTTP ${path}: real 404`, (await raw(path)).status === 404);
  }
  const slash = await raw('/shop/');
  check('HTTP /shop/ redirects to /shop', slash.status === 308 && (slash.location || '').endsWith('/shop'), `${slash.status} ${slash.location}`);
  const locs = ((await raw('/sitemap.xml')).html.match(/<loc>/g) || []).length;
  check('sitemap.xml lists pages, categories and products', locs >= 3 + categoryPaths.length + productPaths.length, `${locs} URLs`);
  const homeHtml = (await raw('/')).html;
  check('HTML /: opening hours are in the page, the live status is not (it is worked out in the browser)',
    homeHtml.includes('Luni – Vineri') && !/Deschis acum|Închide în curând|Închis · deschide/.test(homeHtml));
  const bakery = [...homeHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((d) => d['@type'] === 'Bakery') || {};
  check('structured data: the business has its opening hours and map link',
    (bakery.openingHoursSpecification || []).length === 2 && /google\.com\/maps\/place/.test(bakery.hasMap || ''), JSON.stringify(bakery.openingHoursSpecification));
  const xmas = await raw('/craciun');
  const xmasText = xmas.html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  check('HTML /craciun: the Christmas offer is in the page (boxes, babka, prices, pickup days), indexable, in the sitemap',
    xmas.status === 200 && ['Cutia colindătorilor', 'Babka cu fistic', '18 lei / 100 g', '30–31 decembrie'].every((s) => xmasText.includes(s)) &&
      /name="robots" content="index/.test(xmas.html) && (xmas.html.match(/href="https:\/\/wa\.me\//g) || []).length >= 20 &&
      (await raw('/sitemap.xml')).html.includes('/craciun</loc>'), `${xmas.status}`);
  const waste = await raw('/risipa-alimentara');
  check('HTML /risipa-alimentara: the food waste plan, with the order of measures for products close to expiry',
    waste.status === 200 && waste.html.includes('Ce facem cu produsele aproape de expirare') && waste.html.includes('Transfer gratuit pentru consum uman') &&
      waste.html.includes('Legii nr. 217/2016') && /name="robots" content="noindex/.test(waste.html), `${waste.status}`);
  const oldBrownie = await raw('/produse/brownie2');
  check('HTTP /produse/brownie2 redirects permanently to /produse/brownie-la-kg',
    oldBrownie.status === 301 && (oldBrownie.location || '').endsWith('/produse/brownie-la-kg'), `${oldBrownie.status} ${oldBrownie.location}`);

  // 2. Cookie consent and analytics, as a new visitor
  {
    const page = await newPage({ dismissCookies: false });
    await open(page, '/');
    check('consent: banner shown to a new visitor', await page.evaluate(() => document.body.textContent.includes('Respinge opționale')));
    check('consent: WhatsApp button waits for the choice', !(await page.$('a[href^="https://wa.me/"]')));
    check('consent: nothing loads from Google before a choice (fonts, maps, analytics)', page.google.length === 0, page.google[0]);
    await clickText(page, 'button', 'Respinge opționale');
    await sleep(3500); // analytics would load within ~3 s
    check('consent: no analytics after rejecting', page.analytics.length === 0, `${page.analytics.length} requests`);
    check('consent: WhatsApp button shown after the choice', !!(await page.$('a[href^="https://wa.me/"]')));
    await open(page, '/contact');
    await sleep(1000);
    check('contact map waits for a click after rejecting (nothing from Google)',
      page.google.length === 0 && !(await page.$('iframe')) && (await page.evaluate(() => document.body.textContent.includes('Afișează harta'))), page.google[0]);
    await clickText(page, 'button', 'Afișează harta');
    check('contact map shows after "Afișează harta"', !!(await page.waitForSelector('iframe[src*="google.com/maps"]', { timeout: 5000 }).catch(() => null)));

    const accept = await newPage({ dismissCookies: false });
    await open(accept, '/');
    await clickText(accept, 'button', 'Acceptă toate');
    await sleep(5000);
    check('consent: analytics load after accepting', accept.analytics.some((u) => u.includes('gtag/js')));
    await open(accept, '/contact', { waitUntil: 'load' });
    check('contact map loads by itself after accepting all cookies', !!(await accept.waitForSelector('iframe[src*="google.com/maps"]', { timeout: 5000 }).catch(() => null)));

    const prefs = await newPage({ dismissCookies: false });
    await open(prefs, '/');
    await clickText(prefs, 'button', 'Personalizează');
    await sleep(300);
    check('a11y: cookie preferences is a labelled dialog with focus inside', await prefs.evaluate(() => {
      const d = document.querySelector('[role="dialog"][aria-labelledby="cookie-preferences-title"]');
      return !!d && d.contains(document.activeElement);
    }));
  }

  // 3. Home page
  {
    const page = await newPage();
    await open(page, '/');
    check('home: title', (await page.title()).startsWith('Odette Confiserie'), await page.title());
    const hero = await page.$eval('section img', (i) => ({ ok: i.complete && i.naturalWidth > 0, alt: i.alt, src: i.currentSrc.split('/').pop() }));
    check('home: hero image loaded, with alt text', hero.ok && hero.alt.length > 10, hero.src);
    const opening = await page.evaluate(() => {
      const first = document.querySelector('main section');
      return { h1: first.querySelector('h1')?.textContent || '', links: [...first.querySelectorAll('a')].map((a) => [a.textContent.trim(), a.getAttribute('href')]) };
    });
    check('home: until the last day to order, the Christmas banner opens the page and "Comandă acum" leads to /craciun',
      !christmasOn || (opening.h1.includes('Crăciun') && opening.links.some(([text, href]) => /comandă acum/i.test(text) && href === '/craciun')),
      JSON.stringify(opening));
    check('home: best sellers link their product pages', (await page.$$(CARDS)).length > 0 || (await page.$$('a[href^="/produse/"]')).length > 0);
    await page.keyboard.press('Tab');
    check('a11y: the first Tab reaches "Sari la conținut"', (await page.evaluate(() => document.activeElement?.textContent)) === 'Sari la conținut');
    const font = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        family: getComputedStyle(document.querySelector('h1')).fontFamily,
        loaded: [...document.fonts].some((f) => f.family.includes('Playfair Display Variable') && f.status === 'loaded'),
        hosts: performance.getEntriesByType('resource').filter((e) => /playfair/i.test(e.name)).map((e) => new URL(e.name).host),
      };
    });
    check('fonts: headings use Playfair Display, served by the site itself',
      font.family.includes('Playfair Display Variable') && font.loaded && font.hosts.length > 0 && font.hosts.every((h) => h === new URL(BASE).host),
      JSON.stringify(font));
    check('a11y: every image has an alt attribute', (await page.$$('img:not([alt])')).length === 0);
    check('a11y: footer section titles are h2', (await page.$$('footer h4')).length === 0 && (await page.$$('footer h2')).length >= 3);
    await page.waitForFunction(() => [...document.querySelectorAll('[data-open-status]')].every((p) => p.textContent.trim()), { timeout: 5000 }).catch(() => {});
    const statuses = await page.evaluate(() => [...document.querySelectorAll('[data-open-status]')].map((p) => p.textContent.trim()));
    check('opening hours: the live status appears after loading (card and footer)',
      statuses.length >= 2 && statuses.every((text) => STATUS_TEXT.test(text)), statuses.join(' | '));
    check('home: "Unde ne găsești" with "Rute" to Google Maps directions', await page.evaluate(() =>
      !!document.getElementById('unde-ne-gasesti') &&
      [...document.querySelectorAll('a')].some((a) => a.textContent.trim() === 'Rute' && a.href.startsWith('https://www.google.com/maps/dir/?api=1&destination='))));
    check('footer: company line with the trade register number, and the legal links', await page.evaluate(() => {
      const footer = document.querySelector('footer');
      const nav = footer.querySelector('nav[aria-label="Informații legale"]');
      const hrefs = nav ? [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href')) : [];
      return /© \d{4} Olala Sweets SRL · CUI 52083122 · Reg\. Com\. J2025048164006/.test(footer.textContent) &&
        ['/terms-and-conditions', '/privacy-policy', '/cookie-policy', '/risipa-alimentara'].every((h) => hrefs.includes(h)) &&
        !!nav.querySelector('button');
    }));
    // Ordinul ANPC 449/2022 as changed by 270/2026: the SAL pictogram on the homepage, 250 x 50, to reclamatiisal.anpc.ro;
    // above it the SOL pictogram (kept by the owner), to the EU's consumer redress page
    const badges = await page.evaluate(() => ['https://consumer-redress.ec.europa.eu/index_ro', 'https://reclamatiisal.anpc.ro/'].map((href) => {
      const img = document.querySelector(`footer a[href="${href}"] img`);
      if (!img) return null;
      const box = img.getBoundingClientRect();
      return { top: box.top, w: box.width, h: box.height, loaded: img.complete && img.naturalWidth > 0, alt: img.alt };
    }));
    const [sol, sal] = badges;
    check('footer: the SOL and ANPC SAL pictograms (250 x 50, SOL above) link to the EU redress page and reclamatiisal.anpc.ro',
      sol && sal && [sol, sal].every((b) => b.w === 250 && b.h === 50 && b.loaded) && /ANPC/.test(sal.alt) && /online/.test(sol.alt) && sol.top < sal.top,
      JSON.stringify(badges));
    await page.click('button[aria-label="Switch to English"]');
    await sleep(300);
    check('language toggle switches to English', (await page.evaluate(() => document.documentElement.lang)) === 'en');
  }

  // 4. Shop: quick view, scroll position, focus and history
  {
    const page = await newPage();
    await open(page, '/');
    await domClick(page, 'header nav a[href="/shop"]');
    await page.waitForFunction((s) => location.pathname === '/shop' && document.querySelectorAll(s).length > 10, { timeout: 15000 }, CARDS);
    check('shop: all products shown', (await page.$$(CARDS)).length >= 30, `${(await page.$$(CARDS)).length} cards`);

    await page.evaluate((s) => { const c = document.querySelectorAll(s); c[c.length - 1].scrollIntoView({ block: 'center' }); }, CARDS);
    await sleep(300);
    const y0 = await scrollY(page);
    await page.evaluate((s) => { const c = document.querySelectorAll(s); c[c.length - 1].click(); }, CARDS);
    await page.waitForSelector(CLOSE, { timeout: 10000 });
    await sleep(300);
    check('quick view: opens in place, with ?product= in the URL', Math.abs((await scrollY(page)) - y0) <= 4 && /product=/.test(await where(page)), `${await where(page)}, y ${y0} -> ${await scrollY(page)}`);
    check('quick view: delivery rule says 250 lei', await page.evaluate(() => document.body.textContent.includes('peste 250 lei')));
    check('a11y: quick view is a dialog named by the product', await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"][aria-modal="true"]');
      const h = d && document.getElementById(d.getAttribute('aria-labelledby'));
      return !!h && h.textContent.trim().length > 2;
    }));
    check('a11y: focus starts on the close button', (await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Închide');
    let inside = true;
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      inside = inside && (await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')));
    }
    check('a11y: Tab stays inside the dialog', inside);
    await domClick(page, CLOSE);
    await sleep(700);
    check('quick view: ✕ closes it in place and cleans the URL', !(await page.$('[role="dialog"]')) && Math.abs((await scrollY(page)) - y0) <= 4 && (await where(page)) === '/shop', `${await where(page)}, y ${await scrollY(page)}`);
    await page.goBack();
    await sleep(800);
    check('history: Back after closing leaves the shop, without reopening the product', (await where(page)) === '/' && !(await page.$('[role="dialog"]')), await where(page));
  }
  {
    const page = await newPage();
    await open(page, '/shop');
    await page.evaluate((s) => { const c = document.querySelectorAll(s)[2]; c.scrollIntoView({ block: 'center' }); c.focus(); }, CARDS);
    const opener = await page.evaluate(() => document.activeElement.getAttribute('href'));
    const y0 = await scrollY(page);
    await page.keyboard.press('Enter');
    await page.waitForSelector(CLOSE, { timeout: 10000 });
    await page.keyboard.press('Escape');
    await sleep(700);
    check('a11y: Enter opens a product, Esc closes it, focus returns to the card', !(await page.$('[role="dialog"]')) && (await page.evaluate(() => document.activeElement.getAttribute('href'))) === opener && Math.abs((await scrollY(page)) - y0) <= 4, opener);

    await page.evaluate((s) => document.querySelectorAll(s)[2].click(), CARDS);
    await page.waitForSelector(CLOSE, { timeout: 10000 });
    await page.goBack();
    await sleep(800);
    check('history: Back closes an open product and stays on the shop', !(await page.$('[role="dialog"]')) && (await where(page)) === '/shop', await where(page));

    await open(page, `/shop?product=${productPaths[0].split('/').pop()}`);
    check('shared /shop?product=<slug> link opens the product', !!(await page.waitForSelector(CLOSE, { timeout: 10000 }).catch(() => null)));

    // old links filtered the shop by category id; they now lead to the category page
    await open(page, '/shop');
    const legacy = await page.evaluate(() => {
      const shopData = Object.values(window.__reactRouterDataRouter.state.loaderData).find((d) => d && d.categories);
      const product = shopData.products.find((p) => shopData.categories.some((c) => c.id === p.category && c.slug));
      return { id: product.category, product: product.slug, slug: shopData.categories.find((c) => c.id === product.category).slug };
    });
    await open(page, `/shop?filter=${legacy.id}&product=${legacy.product}`);
    await page.waitForSelector(CLOSE, { timeout: 10000 }).catch(() => {});
    check('old ?filter=<id>&product= link opens the product on its category page',
      (await where(page)) === `/${legacy.slug}?product=${legacy.product}` && !!(await page.$(CLOSE)), await where(page));
    await domClick(page, CLOSE);
    await sleep(700);
    check('closing it leaves the category page', (await where(page)) === `/${legacy.slug}` && !(await page.$('[role="dialog"]')), await where(page));

    await open(page, `/shop?product=${productPaths[0].split('/').pop()}`);
    await page.waitForSelector(CLOSE, { timeout: 10000 });
    await clickText(page, '[role="dialog"] button', 'Contactează-ne');
    await page.waitForFunction(() => location.pathname === '/contact', { timeout: 10000 }).catch(() => {});
    await sleep(300);
    check('quick view: "Contactează-ne" opens the contact page', (await where(page)) === '/contact' && !(await page.$('[role="dialog"]')), await where(page));
    await page.goBack();
    check('history: Back from the contact page returns to the product', !!(await page.waitForSelector(CLOSE, { timeout: 10000 }).catch(() => null)), await where(page));
    // the product is open again: leave through the header and come back
    await domClick(page, 'header nav a[href="/contact"]');
    await page.waitForFunction(() => location.pathname === '/contact', { timeout: 10000 });
    await sleep(300);
    const goneOnContact = !(await page.$('[role="dialog"]'));
    await domClick(page, 'header nav a[href="/shop"]');
    await page.waitForFunction(() => location.pathname === '/shop', { timeout: 10000 });
    await sleep(500);
    check('leaving the page closes the product, and coming back does not reopen it', goneOnContact && !(await page.$('[role="dialog"]')));
  }

  // 5. Category pages
  {
    const page = await newPage();
    const [first, second] = categoryPaths;
    await open(page, first);
    check(`category ${first}: heading and active link`, await page.evaluate((p) =>
      document.querySelector('nav[aria-label="Categorii"] a[aria-current="page"]')?.getAttribute('href') === p && !!document.querySelector('h1'), first));
    await page.evaluate(() => window.scrollTo(0, 300));
    await sleep(200);
    await domClick(page, `nav[aria-label="Categorii"] a[href="${second}"]`);
    await page.waitForFunction((p) => location.pathname === p, { timeout: 10000 }, second);
    await sleep(400);
    check(`category link ${first} -> ${second} keeps the page in place`, (await scrollY(page)) > 0, `y ${await scrollY(page)}`);
    await domClick(page, 'nav[aria-label="Categorii"] a[href="/shop"]');
    await page.waitForFunction((s) => location.pathname === '/shop' && document.querySelectorAll(s).length >= 30, { timeout: 10000 }, CARDS).catch(() => {});
    check('"Toate" returns to all products', (await page.$$(CARDS)).length >= 30);
  }

  // 6. Product page
  {
    const page = await newPage();
    await open(page, productPaths[0]);
    check('product page: h1 and site header', !!(await page.$('h1')) && !!(await page.$('header nav')));
    const section = 'button[aria-controls$="-transport"]';
    const before = await page.$eval(section, (b) => b.getAttribute('aria-expanded'));
    await domClick(page, section);
    await sleep(300);
    const after = await page.$eval(section, (b) => ({ expanded: b.getAttribute('aria-expanded'), hidden: document.getElementById(b.getAttribute('aria-controls'))?.getAttribute('aria-hidden') }));
    check('a11y: information sections announce open/closed', before === 'false' && after.expanded === 'true' && after.hidden === 'false', JSON.stringify({ before, ...after }));
    const crumbs = await page.$$eval('nav[aria-label="Navigare"] a', (as) => as.map((a) => a.getAttribute('href')));
    check('product page: breadcrumb links home, products and the category', crumbs.includes('/') && crumbs.includes('/shop') && crumbs.length >= 3, crumbs.join(' '));
  }

  // 6b. Christmas page: the box size menu and the WhatsApp message
  {
    const page = await newPage();
    await open(page, '/craciun');
    const box = '#nostalgie-la-cutie';
    const order = () => page.$eval(`${box} a[href^="https://wa.me/"]`, (a) => ({ text: a.textContent.trim(), message: new URL(a.href).searchParams.get('text') }));
    const first = await order();
    await page.select(`${box} select`, '1');
    await sleep(200);
    const second = await order();
    const contents = await page.$eval(box, (el) => el.textContent);
    check('/craciun: the Nostalgie size menu switches the contents, price and WhatsApp message to Cutia 2',
      first.text.includes('Cutia 1') && second.text.includes('Cutia 2') && second.message.includes('Nostalgie la cutie – Cutia 2 (1,34 kg)') &&
        contents.includes('12 nuci cu ciocolată') && contents.includes('209 lei'), JSON.stringify(second));

    // One click on a section button lands on that section, under the header. As plain <a href="#…">
    // links, every jump after the first was scrolled back by <ScrollRestoration>.
    const missed = [];
    for (const hash of await page.$$eval('#oferta nav a', (as) => as.map((a) => new URL(a.href).hash))) {
      await page.$eval('#oferta nav', (nav) => nav.scrollIntoView({ block: 'center' }));
      await sleep(300);
      await page.click(`#oferta nav a[href$="${hash}"]`);
      await sleep(700);
      const gap = await page.$eval(hash, (el) => Math.round(el.getBoundingClientRect().top - document.querySelector('header').getBoundingClientRect().bottom));
      if (gap < -4 || gap > 60) missed.push(`${hash} ${gap}px`);
    }
    check('/craciun: one click on each section button scrolls to that section', !missed.length, missed.join(', '));

    // In English, the whole offer is in English, down to the WhatsApp message
    await page.click('button[aria-label="Switch to English"]');
    await sleep(300);
    const en = await page.evaluate(() => document.querySelector('main').innerText);
    const enOrder = await order();
    const romanian = ['Cum comanzi', 'Alege cutia', 'Comandă', 'Cutii cadou de Crăciun', 'Întrebări', 'Ridicare', 'livrare', 'cantitate', 'buc'].filter((s) => en.includes(s));
    check('/craciun in English: steps, boxes, products, FAQ and the WhatsApp message are in English',
      ['How to order', 'Nostalgia in a box', 'Poppy seed babka', '1.34 kg', 'Questions about holiday orders', 'Order early'].every((s) => en.includes(s)) &&
        !romanian.length && enOrder.text.includes('Order Box 2') && enOrder.message.startsWith('Hello!') && enOrder.message.includes('Nostalgia in a box – Box 2 (1.34 kg)'),
      JSON.stringify({ romanian, enOrder }));
  }

  // 6c. The festive "Crăciun" buttons (header and shop), until the last day to order
  if (christmasOn) {
    const headerLink = (page) => page.evaluate(() => {
      const link = [...document.querySelectorAll('header a[href="/craciun"]')].find((a) => a.offsetParent !== null);
      const logo = document.querySelector('header a[aria-label^="Odette"]').getBoundingClientRect();
      return link ? { text: link.textContent.trim(), left: Math.round(link.getBoundingClientRect().left), logoRight: Math.round(logo.right) } : null;
    });
    const laptop = await newPage({ viewport: { width: 1024, height: 800 } });
    await open(laptop, '/shop');
    const laptopLink = await headerLink(laptop);
    const shopLinks = await laptop.$$eval('main a[href="/craciun"]', (as) => as.map((a) => a.textContent.trim()));
    const phone = await newPage({ viewport: { width: 360, height: 800, isMobile: true, hasTouch: true } });
    await open(phone, '/');
    const phoneLink = await headerLink(phone);
    check('"Crăciun" button to /craciun: in the header (1024px laptop, 360px phone clear of the logo) and on the shop page',
      laptopLink?.text === 'Crăciun' && phoneLink?.text === 'Crăciun' && phoneLink.left >= phoneLink.logoRight + 4 && shopLinks.includes('Crăciun'),
      JSON.stringify({ laptopLink, phoneLink, shopLinks }));
    // on desktop it takes the socials' place on the right, clear of the menu; the menu stays clear of the logo
    // (only 15px on a 1024px laptop, as before)
    const onRight = [];
    for (const width of [1024, 1280, 1920]) {
      const wide = await newPage({ viewport: { width, height: 900 } });
      await open(wide, '/');
      onRight.push(await wide.evaluate((w) => {
        const nav = document.querySelector('header nav');
        const items = [...nav.children].filter((el) => el.offsetParent !== null).map((el) => el.textContent.trim());
        const logo = document.querySelector('header a[aria-label^="Odette"]').getBoundingClientRect();
        const button = [...document.querySelectorAll('header a[href="/craciun"]')].find((a) => a.offsetParent !== null);
        const socials = [...document.querySelectorAll('header a[aria-label="Instagram"], header a[aria-label="Facebook"]')]
          .filter((a) => a.offsetParent !== null).length;
        return {
          w, items: items.join(' | '), socials,
          logoClear: Math.round(nav.getBoundingClientRect().left - logo.right),
          buttonClear: button ? Math.round(button.getBoundingClientRect().left - nav.getBoundingClientRect().right) : null,
        };
      }, width));
    }
    check('"Crăciun" button replaces the header socials on the right (1024, 1280, 1920px), clear of the menu',
      onRight.every((m) => m.items === 'Acasă | Meniu | Ofertă evenimente | Contact' && m.socials === 0 && m.logoClear >= (m.w < 1280 ? 12 : 24) && m.buttonClear >= 24),
      JSON.stringify(onRight));
  }

  // 7. Contact page and phone layout
  {
    const page = await newPage();
    await open(page, '/contact');
    check('a11y: every contact form field has a label', await page.evaluate(() =>
      [...document.querySelectorAll('form input, form textarea')].every((el) => el.labels && el.labels.length > 0)));
    check('a11y: icon-only links have names', await page.evaluate(() =>
      // named by aria-label, or by the alt text of the picture inside (the ANPC pictogram)
      [...document.querySelectorAll('a')].filter((a) => !a.textContent.trim()).every((a) => a.getAttribute('aria-label') || a.querySelector('img[alt]:not([alt=""])'))));
    check('contact: the form first, then the map and contact box side by side (map left)', await page.evaluate(() => {
      const map = [...document.querySelectorAll('button')].find((el) => el.textContent.includes('Afișează harta'));
      const rute = [...document.querySelectorAll('main a')].find((el) => el.textContent.trim() === 'Rute');
      const form = document.querySelector('main form');
      if (!map || !rute || !form) return false;
      const [m, r, f] = [map, rute, form].map((el) => el.getBoundingClientRect());
      return m.right < r.left && f.bottom < m.top && f.bottom < r.top &&
        !!document.querySelector('main a[href^="tel:"]') && !!document.querySelector('main a[href^="mailto:"]');
    }));

    // One form (no topic buttons) with an optional date; the message goes to the submit-enquiry function
    const form = await newPage();
    await open(form, '/contact');
    check('contact: one form, no topic buttons; name, phone and message required, the order date optional', await form.evaluate(() => {
      const date = document.getElementById('contact-date');
      return !document.querySelector('input[name="kind"]') && !document.getElementById('contact-guests') &&
        date?.type === 'date' && !date.required && ['contact-name', 'contact-phone', 'contact-message'].every((id) => document.getElementById(id)?.required);
    }));
    check('contact: no email field; the phone is required', await form.evaluate(() =>
      !document.querySelector('form input[type="email"], #contact-email') && document.getElementById('contact-phone')?.required === true));
    check('a11y: every enquiry field has a label', await form.evaluate(() =>
      [...document.querySelectorAll('form input, form textarea')].every((el) => el.labels && el.labels.length > 0)));
    check('contact: the trap field is out of sight and out of the Tab order', await form.evaluate(() => {
      const trap = document.getElementById('contact-website');
      return trap.tabIndex === -1 && trap.getBoundingClientRect().right < 0 && !!trap.closest('[aria-hidden="true"]');
    }));
    const wanted = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    const fill = async () => {
      await form.type('#contact-name', 'Test E2E');
      await form.type('#contact-phone', '0740 123 456');
      // a date input takes its value in the browser's format; set it the way React notices
      await form.evaluate((value) => {
        const input = document.getElementById('contact-date');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, wanted);
      await form.type('#contact-message', 'Un tort de test');
      await domClick(form, 'form button[type="submit"]');
    };
    await fill();
    await form.waitForFunction(() => document.body.textContent.includes('Mulțumim!'), { timeout: 10000 }).catch(() => {});
    const sent = form.enquiries[0] || {};
    // the function keeps a date in its own field only for cakes and events, so here it opens the message
    const wantedRo = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${wanted}T00:00:00Z`));
    check('contact: the message, with its date, reaches the function, trap empty, success shown',
      sent.kind === 'contact' && sent.phone === '0740 123 456' && !('email' in sent) && sent.message === `Data dorită: ${wantedRo}\n\nUn tort de test` &&
        sent.website === '' && sent.elapsed_ms > 0 && sent.language === 'ro' && (await form.evaluate(() => document.body.textContent.includes('Mulțumim!'))), JSON.stringify(sent));
    const cake = await newPage();
    await open(cake, '/contact?subiect=tort-personalizat');
    await cake.type('#contact-name', 'Test E2E');
    await cake.type('#contact-phone', '0740 123 456');
    await cake.evaluate((value) => {
      const input = document.getElementById('contact-date');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, wanted);
    await cake.type('#contact-message', 'Un tort de test');
    await domClick(cake, 'form button[type="submit"]');
    await cake.waitForFunction(() => document.body.textContent.includes('Mulțumim!'), { timeout: 10000 }).catch(() => {});
    const cakeSent = cake.enquiries[0] || {};
    check('contact: an old ?subiect=tort-personalizat link still labels a custom cake, the date in its own field',
      cakeSent.kind === 'custom_cake' && cakeSent.event_date === wanted && cakeSent.message === 'Un tort de test', JSON.stringify(cakeSent));

    form.enquiryAnswer = { status: 429, body: { error: 'too_many' } };
    form.expectErrors = true;
    await open(form, '/contact');
    await fill();
    await form.waitForFunction(() => document.body.textContent.includes('mai multe mesaje'), { timeout: 10000 }).catch(() => {});
    check('contact: the "too many messages" answer is explained to the visitor', await form.evaluate(() => document.body.textContent.includes('mai multe mesaje de la acest număr de telefon')));

    const phone = await newPage({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } });
    // a phone widens its own view to fit a too-wide page (innerWidth grows with it), so the
    // page is compared with the screen's width (clientWidth)
    const wide = [];
    for (const width of [360, 390]) {
      const narrow = await newPage({ viewport: { width, height: 800, isMobile: true, hasTouch: true } });
      for (const path of ['/', '/contact', '/shop', productPaths[0], '/risipa-alimentara', '/craciun']) {
        await open(narrow, path);
        const sizes = await narrow.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
        if (sizes[0] > sizes[1]) wide.push(`${width}px ${path} (${sizes[0]}px)`);
      }
    }
    check('phones (360 and 390px): no page is wider than the screen', wide.length === 0, wide.join(', '));
    const covered = [];
    for (const [label, viewport] of [['wide', { width: 1920, height: 900 }], ['phone', { width: 375, height: 800, isMobile: true, hasTouch: true }]]) {
      const view = await newPage({ viewport });
      for (const path of ['/risipa-alimentara', '/terms-and-conditions', '/privacy-policy', '/cookie-policy', '/contact', '/shop', '/craciun', productPaths[0], '/nu-exista-pagina-test']) {
        await open(view, path);
        // the first thing on the page: its title, or the breadcrumb above a product's title
        const gap = await view.evaluate(() =>
          Math.round(document.querySelector('main h1, main nav').getBoundingClientRect().top - document.querySelector('header').getBoundingClientRect().bottom));
        if (gap < 32) covered.push(`${label} ${path} (${gap}px)`);
      }
    }
    check('every page title sits at least 32px below the fixed header (1920px and phone)', covered.length === 0, covered.join(', '));

    // The site's buttons are navy with white text; none is gold any more (the cookie banner included)
    const gold = [];
    const isGold = (els, where) => els.filter((el) => getComputedStyle(el).backgroundColor === 'rgb(212, 175, 55)')
      .map((el) => `${where}: ${el.textContent.trim().slice(0, 30) || el.getAttribute('aria-label')}`);
    for (const path of ['/', '/contact', '/shop']) {
      const view = await newPage({ dismissCookies: false });
      await open(view, path);
      gold.push(...(await view.$$eval('button, a', isGold, path)));
      if (path === '/') {
        await clickText(view, 'button', 'Personalizează');
        await sleep(300);
        gold.push(...(await view.$$eval('[role="dialog"] button, button[aria-label^="Toggle"]', isGold, 'cookie settings')));
      }
    }
    check('no gold buttons: navy with white text instead (cookie banner and settings, contact form)', gold.length === 0, gold.join(', '));
    await open(phone, '/');
    const menu = 'button[aria-controls="mobile-menu"]';
    const before = await phone.$eval(menu, (b) => b.getAttribute('aria-expanded'));
    await domClick(phone, menu);
    await sleep(200);
    const after = await phone.$eval(menu, (b) => b.getAttribute('aria-expanded'));
    check('a11y: mobile menu button reports open/closed', before === 'false' && after === 'true' && !!(await phone.$('#mobile-menu')), `${before} -> ${after}`);
    await open(phone, '/shop');
    await phone.evaluate((s) => { const c = document.querySelectorAll(s); c[c.length - 1].scrollIntoView({ block: 'center' }); }, CARDS);
    await sleep(300);
    const y0 = await scrollY(phone);
    await phone.evaluate((s) => { const c = document.querySelectorAll(s); c[c.length - 1].click(); }, CARDS);
    await phone.waitForSelector(CLOSE, { timeout: 10000 });
    await domClick(phone, CLOSE);
    await sleep(700);
    check('phone: quick view opens and closes in place', y0 > 800 && Math.abs((await scrollY(phone)) - y0) <= 4, `y ${y0} -> ${await scrollY(phone)}`);
  }

  // 8. Not-found pages: real 404, the not-found page, and the app still works
  for (const path of ['/nu-exista-pagina-test', '/produse/nu-exista-produs-test', '/a/b/c']) {
    const page = await newPage();
    const res = await open(page, path);
    const h1 = await page.$eval('h1', (h) => h.textContent).catch(() => '');
    await domClick(page, 'header nav a[href="/shop"]');
    const alive = await page.waitForFunction(() => location.pathname === '/shop', { timeout: 10000 }).then(() => true).catch(() => false);
    check(`not found ${path}: 404, not-found page, links work`, res.status() === 404 && h1.includes('Pagina nu a fost găsită') && alive, `${res.status()} "${h1}"`);
  }

  // 9. Every page in the sitemap opens without JavaScript errors (hydration included)
  {
    const page = await newPage();
    const paths = [...(await raw('/sitemap.xml')).html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    const before = errors.length;
    for (const path of paths) await open(page, path);
    check(`all ${paths.length} sitemap pages open without JavaScript errors`, errors.length === before, errors.slice(before, before + 3).join(' | '));
  }

  check('no JavaScript errors (including hydration) on any page', errors.length === 0, errors.slice(0, 3).join(' | '));
} catch (error) {
  check('suite ran to the end', false, error.stack || error.message);
} finally {
  await browser.close();
  if (server) await server.close();
}

for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && !r.pass ? `  — ${r.detail}` : ''}`);
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${BASE}: ${results.length - failed} of ${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;
