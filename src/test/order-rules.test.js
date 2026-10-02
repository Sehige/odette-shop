// @vitest-environment node
import { describe, expect, it } from 'vitest';
import * as site from '../order/rules';
import { siteConfig } from '../data/siteConfig';
import * as fn from '../../supabase/functions/submit-enquiry/index.ts';

// The order page and the Edge Function each have their own copy of the rules;
// a difference would show customers days or prices the function then refuses.
describe('order rules: website and Edge Function agree', () => {
  it('on delivery fees and the cut-off hour', () => {
    expect(fn.DELIVERY).toEqual(siteConfig.delivery);
    expect(fn.CUTOFF_HOUR).toBe(site.CUTOFF_HOUR);
    for (const fulfilment of ['pickup', 'delivery']) {
      for (const zone of ['cluj', 'outside']) {
        for (const subtotal of [0, 100, 249.99, 250, 400]) {
          expect(fn.deliveryFee(fulfilment, zone, subtotal)).toBe(site.deliveryFee(fulfilment, zone, subtotal));
        }
      }
    }
  });

  it('on the earliest day, every 3 hours for two weeks, with and without closed days', () => {
    const closedSets = [new Set(), new Set(['2026-12-24', '2026-12-25', '2026-12-26'])];
    for (const closed of closedSets) {
      for (let hours = 0; hours < 14 * 24; hours += 3) {
        const now = new Date(Date.UTC(2026, 11, 18, 0) + hours * 3600 * 1000);
        expect(fn.earliestDay(now, closed)).toBe(site.earliestDay(now, closed));
      }
    }
  });

  it('on which quantities fit a product', () => {
    for (const unit of ['kg', 'buc', 'cutie', '1,5 kg', null]) {
      for (const quantity of [0, 0.25, 0.5, 1, 1.5, 2, 10, 10.5, 50, 51]) {
        expect(fn.isValidQuantity(quantity, unit)).toBe(site.isValidQuantity(quantity, unit));
      }
    }
  });

  it('offers only days the function accepts', () => {
    const now = new Date('2026-12-19T16:30:00Z'); // Saturday 18:30 in Romania
    const closed = new Set(['2026-12-25']);
    const days = site.orderDays(now, closed, 14);
    expect(days[0]).toBe('2026-12-21'); // Monday
    expect(days).not.toContain('2026-12-25');
    expect(days).not.toContain('2026-12-27'); // Sunday
    for (const day of days) expect(fn.isOpenDay(day, closed) && day >= fn.earliestDay(now, closed)).toBe(true);
  });
});
