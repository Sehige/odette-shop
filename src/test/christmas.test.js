// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { christmas, christmasItems } from '../data/christmas';
import { deliveryText, orderMessage, priceText } from '../components/pages/ChristmasPage';

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
  });

  it('the WhatsApp message names the product and asks for pickup or delivery and the day', () => {
    const text = orderMessage('Cutia colindătorilor (1,22 kg)');
    expect(text).toContain('oferta de Crăciun');
    expect(text).toContain('- Cutia colindătorilor (1,22 kg)');
    expect(text).toContain('Ridicare din laborator sau livrare');
    expect(text).toContain('23–24 decembrie, 30–31 decembrie');
  });

  it('delivery costs the same as on the rest of the site', () => {
    expect(deliveryText).toBe('15 lei în Cluj-Napoca, 25 lei în afara orașului, gratuit pentru comenzile de peste 250 lei');
  });

  it('every section has a short name for the buttons that jump to it', () => {
    for (const section of christmas.sections) expect(section.nav, section.id).toBeTruthy();
  });

  it('the order deadline is set', () => {
    expect(christmas.orderBy).toBe('21 decembrie');
  });
});
