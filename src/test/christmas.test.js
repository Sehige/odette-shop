// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { christmas, christmasItems, tr } from '../data/christmas';
import { deliveryText, orderMessage, priceText } from '../components/pages/ChristmasPage';
import { christmasBannerOn } from '../lib/christmasBanner';

const items = christmasItems();
const photoWidths = (section) => (section.layout === 'large' ? [600, 1200] : [400, 800]);

describe('Christmas offer', () => {
  it('every product has a unique id (the anchor on /craciun)', () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every product has a price, and each box size has its own', () => {
    for (const item of items) {
      const priced = item.variants || [item];
      for (const p of priced) expect(p.price, item.id).toBeGreaterThan(0);
    }
  });

  it('every photo exists in both sizes', () => {
    for (const section of christmas.sections) {
      for (const item of section.items) {
        for (const w of photoWidths(section)) {
          expect(fs.existsSync(path.join('src/assets/christmas', `${item.image}-${w}.webp`)), `${item.image}-${w}`).toBe(true);
        }
      }
    }
  });

  it('prices show their unit', () => {
    expect(priceText({ price: 18, per: '100 g' })).toBe('18 lei / 100 g');
    expect(priceText({ price: 189 })).toBe('189 lei');
    expect(priceText({ price: 8, per: 'buc', perEn: 'pc' }, 'en')).toBe('8 lei / pc');
  });

  it('the WhatsApp message names the product and asks for pickup or delivery and the day', () => {
    const text = orderMessage('Cutia colindătorilor (1,22 kg)');
    expect(text).toContain('oferta de Crăciun');
    expect(text).toContain('- Cutia colindătorilor (1,22 kg)');
    expect(text).toContain('Ridicare din laborator sau livrare');
    expect(text).toContain('23–24 decembrie, 30–31 decembrie');
  });

  it('in English, the WhatsApp message is in English too', () => {
    const text = orderMessage('The carolers’ box (1.22 kg)', 'en');
    expect(text).toContain('Christmas offer');
    expect(text).toContain('- The carolers’ box (1.22 kg)');
    expect(text).toContain('Pickup from the lab or delivery');
    expect(text).toContain('23–24 December, 30–31 December');
  });

  it('every text on the page has its English version', () => {
    const fields = { section: ['title', 'nav', 'intro'], item: ['name', 'description', 'contents'] };
    for (const section of christmas.sections) {
      for (const key of fields.section) expect(section[`${key}En`], `${section.id}.${key}En`).toBeTruthy();
      for (const item of section.items) {
        // a name that is the same in both languages ("Crinkle cookies") needs no English copy
        if (!/^[A-Za-z ]+$/.test(item.name)) expect(item.nameEn, `${item.id}.nameEn`).toBeTruthy();
        for (const p of [item, ...(item.variants || [])]) {
          for (const key of fields.item.slice(1)) {
            if (p[key]) expect(p[`${key}En`], `${item.id}.${key}En`).toBeTruthy();
          }
          if (p.contents) expect(p.contentsEn.length, `${item.id} contents`).toBe(p.contents.length);
        }
        for (const v of item.variants || []) expect(v.nameEn, `${item.id} ${v.name}`).toBeTruthy();
      }
    }
    for (const p of christmas.pickup) expect(p.daysEn && p.untilEn, p.days).toBeTruthy();
  });

  it('tr picks the English text when there is one', () => {
    const item = { name: 'Babka cu mac', nameEn: 'Poppy seed babka', per: '100 g' };
    expect(tr(item, 'name', 'en')).toBe('Poppy seed babka');
    expect(tr(item, 'name', 'ro')).toBe('Babka cu mac');
    expect(tr(item, 'per', 'en')).toBe('100 g');
  });

  it('delivery costs the same as on the rest of the site', () => {
    expect(deliveryText('ro')).toBe('15 lei în Cluj-Napoca, 25 lei în afara orașului, gratuit pentru comenzile de peste 250 lei');
    expect(deliveryText('en')).toBe('15 lei in Cluj-Napoca, 25 lei outside the city, free for orders over 250 lei');
  });

  it('every section has a short name for the buttons that jump to it', () => {
    for (const section of christmas.sections) expect(section.nav, section.id).toBeTruthy();
  });

  it('the homepage banner shows until the end of the last day to order, in Romania', () => {
    expect(christmasBannerOn(new Date('2026-11-24T12:00:00+02:00'))).toBe(true);
    expect(christmasBannerOn(new Date('2026-12-21T23:59:00+02:00'))).toBe(true);
    expect(christmasBannerOn(new Date('2026-12-22T00:01:00+02:00'))).toBe(false);
    // 22:30 UTC on the 21st is already the 22nd in Romania
    expect(christmasBannerOn(new Date('2026-12-21T22:30:00Z'))).toBe(false);
  });

  it('every photo the shop SQL names is in public/foto/craciun (scripts/christmas-products-sql.mjs)', () => {
    const dir = 'supabase/sql';
    const file = fs.readdirSync(dir).filter((f) => f.endsWith('_christmas_products.sql')).sort().pop();
    const photos = [...fs.readFileSync(path.join(dir, file), 'utf8').matchAll(/\/foto\/craciun\/([a-z0-9-]+\.webp)/g)].map((m) => m[1]);
    expect(photos.length).toBeGreaterThan(0);
    for (const photo of photos) expect(fs.existsSync(path.join('public/foto/craciun', photo)), photo).toBe(true);
  });

  it('the order deadline is set', () => {
    expect(christmas.orderBy).toBe('21 decembrie');
  });
});
