// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { handle } from '../../supabase/functions/submit-enquiry/index.ts';

const NOW = new Date('2026-10-02T10:00:00Z');
const env = {
  supabaseUrl: 'https://db.test',
  serviceKey: 'service',
  resendKey: 'resend',
  to: 'shop@test.ro',
  from: 'Shop <shop@test.ro>',
};

// Fake Supabase + Resend: records every call; `counts` answers the rate-limit queries
function setup({ counts = [0, 0] } = {}) {
  const calls = [];
  const remaining = [...counts];
  const fetch = async (url, init = {}) => {
    const call = { url: String(url), method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null };
    calls.push(call);
    if (call.method === 'HEAD') {
      return new Response(null, { status: 200, headers: { 'content-range': `*/${remaining.shift() ?? 0}` } });
    }
    if (call.method === 'POST' && call.url.includes('/rest/v1/contact_submissions')) {
      return new Response(JSON.stringify([{ id: 7 }]), { status: 201 });
    }
    if (call.url.startsWith('https://api.resend.com')) return new Response('{"id":"e1"}', { status: 200 });
    return new Response(null, { status: 204 });
  };
  const send = (body, { method = 'POST', origin = 'https://www.odette-confiserie.ro' } = {}) =>
    handle(
      new Request('https://fn.test/submit-enquiry', {
        method,
        headers: { origin, 'content-type': 'application/json' },
        body: method === 'POST' ? JSON.stringify(body) : undefined,
      }),
      { env, fetch, now: () => NOW }
    );
  return { calls, send };
}

const message = { name: 'Ana Pop', phone: '0740 123 456', message: 'Bună ziua', elapsed_ms: 9000 };
const inserted = (calls) => calls.find((c) => c.method === 'POST' && c.url.includes('contact_submissions'));
const emailed = (calls) => calls.find((c) => c.url.startsWith('https://api.resend.com'));

describe('submit-enquiry', () => {
  it('answers the browser preflight for the website', async () => {
    const res = await setup().send(null, { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('https://www.odette-confiserie.ro');
  });

  it('saves a message, emails the shop with the phone and a WhatsApp link, and records the email', async () => {
    const { calls, send } = setup();
    const res = await send({ ...message, email: 'ignored@example.ro' });
    expect(res.status).toBe(200);
    const row = inserted(calls).body;
    expect(row).toMatchObject({ kind: 'contact', name: 'Ana Pop', phone: '0740123456', spam: false, subject: 'Mesaj' });
    expect(row).not.toHaveProperty('email');
    const email = emailed(calls).body;
    expect(email).toMatchObject({ to: ['shop@test.ro'], subject: '[Comanda Site] Mesaj: Ana Pop' });
    expect(email).not.toHaveProperty('reply_to');
    expect(email.text).toContain('Telefon: 0740123456');
    expect(email.text).toContain('WhatsApp: https://wa.me/40740123456');
    expect(calls.at(-1)).toMatchObject({ method: 'PATCH', url: 'https://db.test/rest/v1/contact_submissions?id=eq.7' });
  });

  it('accepts international numbers and links them on WhatsApp', async () => {
    const { calls, send } = setup();
    await send({ ...message, phone: '0049 151 2345 6789' });
    expect(inserted(calls).body.phone).toBe('+4915123456789');
    expect(emailed(calls).body.text).toContain('WhatsApp: https://wa.me/4915123456789');
  });

  it('puts the date and portions of a custom cake in the email', async () => {
    const { calls, send } = setup();
    await send({ ...message, kind: 'custom_cake', event_date: '2026-12-12', guests: '20' });
    expect(inserted(calls).body).toMatchObject({ kind: 'custom_cake', event_date: '2026-12-12', guests: 20 });
    const email = emailed(calls).body;
    expect(email.subject).toBe('[Comanda Site] Tort personalizat: Ana Pop, 12 decembrie 2026');
    expect(email.text).toContain('Data dorită: 12 decembrie 2026');
    expect(email.text).toContain('Număr de porții: 20');
  });

  it('quietly drops what bots send: hidden field filled in, or sent instantly', async () => {
    for (const body of [{ ...message, website: 'http://spam.example' }, { ...message, elapsed_ms: 400 }, { name: 'x' }]) {
      const { calls, send } = setup();
      const res = await send(body);
      expect(res.status).toBe(200);
      expect(calls).toHaveLength(0);
    }
  });

  it('rejects a missing or invalid phone and dates in the past without saving', async () => {
    for (const phone of [undefined, '', '12345', 'call me', '0740 123 456 789 012 345']) {
      const { calls, send } = setup();
      const res = await send({ ...message, phone, kind: 'event', event_date: '2026-10-01', guests: 0 });
      expect(res.status).toBe(400);
      expect((await res.json()).fields).toEqual(['phone', 'event_date', 'guests']);
      expect(calls).toHaveLength(0);
    }
  });

  it('keeps messages full of links but marks them as spam and does not email them', async () => {
    const { calls, send } = setup();
    const res = await send({ ...message, message: 'http://a.x http://b.x http://c.x www.d.x' });
    expect(res.status).toBe(200);
    expect(inserted(calls).body.spam).toBe(true);
    expect(emailed(calls)).toBeUndefined();
  });

  it('refuses a sixth message from the same phone number within an hour', async () => {
    const { calls, send } = setup({ counts: [5, 5] });
    const res = await send(message);
    expect(res.status).toBe(429);
    expect(inserted(calls)).toBeUndefined();
    expect(calls[0].url).toContain('phone=eq.0740123456');
  });
});
