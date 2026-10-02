// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { handle } from '../../supabase/functions/submit-enquiry/index.ts';

// Friday 2 October 2026, 13:00 in Romania
const FRIDAY_1PM = new Date('2026-10-02T10:00:00Z');
const FRIDAY_630PM = new Date('2026-10-02T15:30:00Z');
const CAKE = { id: '11111111-1111-4111-8111-111111111111', name_ro: 'Tort exotic', price: 180, price_unit: 'kg', isActive: true };
const BABKA = { id: '22222222-2222-4222-8222-222222222222', name_ro: 'Babka cu nucă', price: 80, price_unit: 'buc', isActive: true };
const OLD = { id: '33333333-3333-4333-8333-333333333333', name_ro: 'Retras', price: 50, price_unit: 'buc', isActive: false };
const env = { supabaseUrl: 'https://db.test', serviceKey: 'service', resendKey: 'resend', to: 'shop@test.ro', from: 'Shop <shop@test.ro>' };

// Fake Supabase + Resend: records every call
function setup({ now = FRIDAY_1PM, counts = [0, 0], closed = [] } = {}) {
  const calls = [];
  const remaining = [...counts];
  const fetch = async (url, init = {}) => {
    const call = { url: String(url), method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null };
    calls.push(call);
    if (call.method === 'HEAD') return new Response(null, { headers: { 'content-range': `*/${remaining.shift() ?? 0}` } });
    if (call.url.includes('/rest/v1/closed_days')) return Response.json(closed.map((day) => ({ day })));
    if (call.url.includes('/rest/v1/products')) return Response.json([CAKE, BABKA, OLD].filter((p) => call.url.includes(p.id)));
    if (call.url.includes('/rest/v1/rpc/create_order')) return Response.json('order-uuid');
    if (call.url.startsWith('https://api.resend.com')) return Response.json({ id: 'e1' });
    return new Response(null, { status: 204 });
  };
  const send = (body) =>
    handle(
      new Request('https://fn.test/submit-enquiry', {
        method: 'POST',
        headers: { origin: 'https://www.odette-confiserie.ro', 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
      { env, fetch, now: () => now }
    );
  return { calls, send };
}

const order = (extra = {}) => ({
  type: 'order',
  name: 'Ana Pop',
  phone: '0740 123 456',
  fulfilment: 'pickup',
  wanted_date: '2026-10-03',
  items: [{ product_id: CAKE.id, quantity: 1.5, price: 1 }, { product_id: BABKA.id, quantity: 2 }],
  elapsed_ms: 20000,
  website: '',
  ...extra,
});
const created = (calls) => calls.find((c) => c.url.endsWith('/rpc/create_order'))?.body;
const emailed = (calls) => calls.find((c) => c.url.startsWith('https://api.resend.com'))?.body;
const fieldsOf = async (res) => (await res.json()).fields;

describe('submit-enquiry: orders', () => {
  it('saves the order with prices from the database and emails the shop', async () => {
    const { calls, send } = setup();
    const res = await send(order());
    expect(res.status).toBe(200);
    const { p_order, p_items } = created(calls);
    expect(p_order).toMatchObject({
      customer_name: 'Ana Pop', customer_phone: '0740123456', fulfilment: 'pickup', wanted_date: '2026-10-03',
      subtotal_estimate: 430, delivery_fee: 0, total_estimate: 430,
    });
    expect(p_items).toEqual([
      { product_id: CAKE.id, name_snapshot: 'Tort exotic', unit_price_snapshot: 180, price_unit_snapshot: 'kg', quantity: 1.5, line_total_estimate: 270 },
      { product_id: BABKA.id, name_snapshot: 'Babka cu nucă', unit_price_snapshot: 80, price_unit_snapshot: 'buc', quantity: 2, line_total_estimate: 160 },
    ]);
    const email = emailed(calls);
    expect(email.subject).toBe('[Comanda Site] Comandă: Ana Pop, sâmbătă, 3 octombrie 2026 (ridicare)');
    expect(email.text).toContain('• 1,5 kg Tort exotic: 270 lei (180 lei/kg)');
    expect(email.text).toContain('• 2 × Babka cu nucă: 160 lei (80 lei/buc)');
    expect(email.text).toContain('Total estimat: 430 lei');
    expect(email.text).toContain('WhatsApp: https://wa.me/40740123456');
    expect(email.text).not.toContain('Livrare:');
    expect(calls.at(-1)).toMatchObject({ method: 'PATCH', url: 'https://db.test/rest/v1/orders?id=eq.order-uuid' });
  });

  it('charges delivery below 250 lei: 15 in Cluj, 25 outside; free from 250', async () => {
    const cases = [
      [{ delivery_zone: 'cluj', items: [{ product_id: BABKA.id, quantity: 2 }] }, 15, 175],
      [{ delivery_zone: 'outside', items: [{ product_id: BABKA.id, quantity: 2 }] }, 25, 185],
      [{ delivery_zone: 'outside', items: [{ product_id: BABKA.id, quantity: 4 }] }, 0, 320],
    ];
    for (const [extra, fee, total] of cases) {
      const { calls, send } = setup();
      const res = await send(order({ fulfilment: 'delivery', delivery_address: 'Str. Lungă 1, Cluj', ...extra }));
      expect(res.status).toBe(200);
      expect(created(calls).p_order).toMatchObject({ delivery_fee: fee, total_estimate: total, delivery_address: 'Str. Lungă 1, Cluj' });
      expect(emailed(calls).text).toContain(fee ? `Livrare: ${fee} lei` : 'Livrare: gratuită');
    }
  });

  it('adds up the same product sent twice', async () => {
    const { calls, send } = setup();
    await send(order({ items: [{ product_id: CAKE.id, quantity: 1 }, { product_id: CAKE.id, quantity: 0.5 }] }));
    expect(created(calls).p_items).toHaveLength(1);
    expect(created(calls).p_items[0]).toMatchObject({ quantity: 1.5, line_total_estimate: 270 });
  });

  it('after 18:00 the earliest day moves on, skipping Sunday', async () => {
    const late = setup({ now: FRIDAY_630PM });
    expect(await fieldsOf(await late.send(order({ wanted_date: '2026-10-03' })))).toEqual(['wanted_date']);
    expect((await setup({ now: FRIDAY_630PM }).send(order({ wanted_date: '2026-10-05' }))).status).toBe(200);
  });

  it('refuses Sundays, closed days, past days and days too far ahead', async () => {
    for (const [wanted_date, closed] of [['2026-10-04', []], ['2026-10-03', ['2026-10-03']], ['2026-10-02', []], ['2027-01-05', []]]) {
      const { calls, send } = setup({ closed });
      expect(await fieldsOf(await send(order({ wanted_date })))).toEqual(['wanted_date']);
      expect(created(calls)).toBeUndefined();
    }
  });

  it('refuses quantities that do not fit the product, and products that cannot be ordered', async () => {
    for (const items of [
      [{ product_id: CAKE.id, quantity: 0.3 }],
      [{ product_id: CAKE.id, quantity: 1.25 }],
      [{ product_id: BABKA.id, quantity: 1.5 }],
      [{ product_id: BABKA.id, quantity: 60 }],
      [{ product_id: OLD.id, quantity: 1 }],
      [{ product_id: '44444444-4444-4444-8444-444444444444', quantity: 1 }],
    ]) {
      const { calls, send } = setup();
      expect(await fieldsOf(await send(order({ items })))).toEqual(['items']);
      expect(created(calls)).toBeUndefined();
    }
  });

  it('checks the form before looking anything up', async () => {
    const { calls, send } = setup();
    const res = await send(order({ phone: '123', fulfilment: 'delivery', items: [], wanted_date: 'soon' }));
    expect(await fieldsOf(res)).toEqual(['phone', 'delivery_zone', 'delivery_address', 'wanted_date', 'items']);
    expect(calls).toHaveLength(0);
  });

  it('quietly drops orders sent by bots', async () => {
    const { calls, send } = setup();
    expect((await send(order({ elapsed_ms: 500 }))).status).toBe(200);
    expect((await send(order({ website: 'x' }))).status).toBe(200);
    expect(calls).toHaveLength(0);
  });

  it('refuses a sixth order from the same phone number within an hour', async () => {
    const { calls, send } = setup({ counts: [5, 5] });
    const res = await send(order());
    expect(res.status).toBe(429);
    expect(calls[0].url).toContain('/rest/v1/orders?');
    expect(calls[0].url).toContain('customer_phone=eq.0740123456');
    expect(created(calls)).toBeUndefined();
  });
});
