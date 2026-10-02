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

const message = { name: 'Ana Pop', email: 'Ana@Example.ro', phone: '0740 000 000', message: 'Bună ziua', elapsed_ms: 9000 };
const inserted = (calls) => calls.find((c) => c.method === 'POST' && c.url.includes('contact_submissions'));
const emailed = (calls) => calls.find((c) => c.url.startsWith('https://api.resend.com'));

describe('submit-enquiry', () => {
  it('answers the browser preflight for the website', async () => {
    const res = await setup().send(null, { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('https://www.odette-confiserie.ro');
  });

  it('saves a message, emails the shop with the customer as reply-to, and records the email', async () => {
    const { calls, send } = setup();
    const res = await send(message);
    expect(res.status).toBe(200);
    expect(inserted(calls).body).toMatchObject({ kind: 'contact', name: 'Ana Pop', email: 'ana@example.ro', spam: false, subject: 'Mesaj' });
    const email = emailed(calls).body;
    expect(email).toMatchObject({ to: ['shop@test.ro'], reply_to: 'ana@example.ro', subject: 'Mesaj nou de pe site: Ana Pop' });
    expect(email.text).toContain('Telefon: 0740 000 000');
    expect(calls.at(-1)).toMatchObject({ method: 'PATCH', url: 'https://db.test/rest/v1/contact_submissions?id=eq.7' });
  });

  it('puts the date and portions of a custom cake in the email', async () => {
    const { calls, send } = setup();
    await send({ ...message, kind: 'custom_cake', event_date: '2026-12-12', guests: '20' });
    expect(inserted(calls).body).toMatchObject({ kind: 'custom_cake', event_date: '2026-12-12', guests: 20 });
    const email = emailed(calls).body;
    expect(email.subject).toBe('Tort personalizat: Ana Pop, 12 decembrie 2026');
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

  it('rejects invalid fields and dates in the past without saving', async () => {
    const { calls, send } = setup();
    const res = await send({ ...message, email: 'not-an-email', kind: 'event', event_date: '2026-10-01', guests: 0 });
    expect(res.status).toBe(400);
    expect((await res.json()).fields).toEqual(['email', 'event_date', 'guests']);
    expect(calls).toHaveLength(0);
  });

  it('keeps messages full of links but marks them as spam and does not email them', async () => {
    const { calls, send } = setup();
    const res = await send({ ...message, message: 'http://a.x http://b.x http://c.x www.d.x' });
    expect(res.status).toBe(200);
    expect(inserted(calls).body.spam).toBe(true);
    expect(emailed(calls)).toBeUndefined();
  });

  it('refuses a sixth message from the same address within an hour', async () => {
    const { calls, send } = setup({ counts: [5, 5] });
    const res = await send(message);
    expect(res.status).toBe(429);
    expect(inserted(calls)).toBeUndefined();
    expect(calls[0].url).toContain('email=eq.ana%40example.ro');
  });
});
