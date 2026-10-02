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
async function open(page, path) {
  const res = await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 60000 });
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
    await open(accept, '/contact');
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
    check('a11y: footer section titles are h2', (await page.$$('footer h4')).length === 0 && (await page.$$('footer h2')).length >= 4);
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

  // 7. Contact page and phone layout
  {
    const page = await newPage();
    await open(page, '/contact');
    check('a11y: every contact form field has a label', await page.evaluate(() =>
      [...document.querySelectorAll('form input, form textarea')].every((el) => el.labels && el.labels.length > 0)));
    check('a11y: icon-only links have names', await page.evaluate(() =>
      [...document.querySelectorAll('a')].filter((a) => !a.textContent.trim()).every((a) => a.getAttribute('aria-label'))));

    // Enquiry form: a link preselects the topic; the message goes to the submit-enquiry function
    const form = await newPage();
    await open(form, '/contact?subiect=tort-personalizat');
    check('contact: ?subiect=tort-personalizat preselects a custom cake, with date and portions', await form.evaluate(() =>
      document.querySelector('input[name="kind"][value="custom_cake"]')?.checked && !!document.getElementById('contact-date') && !!document.getElementById('contact-guests')));
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
      await form.type('#contact-guests', '20');
      await form.type('#contact-message', 'Un tort de test');
      await domClick(form, 'form button[type="submit"]');
    };
    await fill();
    await form.waitForFunction(() => document.body.textContent.includes('Mulțumim!'), { timeout: 10000 }).catch(() => {});
    const sent = form.enquiries[0] || {};
    check('contact: a custom-cake enquiry reaches the function, trap empty, success shown',
      sent.kind === 'custom_cake' && sent.phone === '0740 123 456' && !('email' in sent) && sent.event_date === wanted && sent.guests === '20' && sent.website === '' && sent.elapsed_ms > 0 &&
        sent.language === 'ro' && (await form.evaluate(() => document.body.textContent.includes('Mulțumim!'))), JSON.stringify(sent));

    form.enquiryAnswer = { status: 429, body: { error: 'too_many' } };
    form.expectErrors = true;
    await open(form, '/contact?subiect=tort-personalizat');
    await fill();
    await form.waitForFunction(() => document.body.textContent.includes('mai multe mesaje'), { timeout: 10000 }).catch(() => {});
    check('contact: the "too many messages" answer is explained to the visitor', await form.evaluate(() => document.body.textContent.includes('mai multe mesaje de la acest număr de telefon')));

    const phone = await newPage({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } });
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
