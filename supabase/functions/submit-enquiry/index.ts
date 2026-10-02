// submit-enquiry: receives what customers send from the website and emails the shop.
// - the contact form (questions, custom cakes, events) → contact_submissions
// - order requests from /comanda (body.type = 'order') → orders + order_items
// The website calls it instead of writing to the tables, so the checks cannot be skipped.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY  email sending (resend.com). Without it messages are still saved.
//   ENQUIRY_TO      optional, default odette.confiserie@gmail.com
//   ENQUIRY_FROM    optional; needs a domain verified in Resend. Until then Resend's
//                   test sender delivers only to the address the Resend account uses.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.

type Env = { supabaseUrl: string; serviceKey: string; resendKey: string; to: string; from: string };
export type Deps = { env: Env; fetch: typeof fetch; now: () => Date };

const KINDS: Record<string, string> = {
  contact: 'Mesaj',
  custom_cake: 'Tort personalizat',
  event: 'Eveniment',
};
const ORIGINS = [
  /^https:\/\/(www\.)?odette-confiserie\.ro$/,
  /^https:\/\/odette-shop-[a-z0-9-]+-sehiges-projects\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
];
const SUBJECT_PREFIX = '[Comanda Site]'; // starts the subject of every email the site sends
const PHONE = /^\+?[\d\s().\/-]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LINK = /https?:\/\/|www\./gi;
const MIN_FILL_MS = 3000; // nobody types a message faster; bots do
const MAX_PER_PHONE_HOUR = 5; // per phone number, for messages and for orders
const MAX_PER_HOUR = 30; // keeps a flood from using up the email quota

// Order rules; the website shows the same ones (src/order/rules.js, and the delivery fees
// in src/data/siteConfig.js). src/test/order-rules.test.js checks that both agree.
export const DELIVERY = { feeCluj: 15, feeOutside: 25, freeThreshold: 250 };
export const CUTOFF_HOUR = 18; // ordered before 18:00 → ready from the next day
const MAX_DAYS_AHEAD = 90;
const MAX_ITEMS = 30;

const cors = (origin: string | null): Record<string, string> => ({
  'Access-Control-Allow-Origin':
    origin && ORIGINS.some((re) => re.test(origin)) ? origin : 'https://www.odette-confiserie.ro',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
});

// Days as YYYY-MM-DD, and the hour, in Romania
export const isoDay = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(date);
const hourInRomania = (date: Date) =>
  Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Bucharest', hour: '2-digit', hourCycle: 'h23' }).format(date));
const dayRo = (iso: string, weekday = false) =>
  new Intl.DateTimeFormat('ro-RO', {
    ...(weekday ? { weekday: 'long' as const } : {}),
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
export const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
// Pickup and delivery happen Monday to Saturday, except closed days
export const isOpenDay = (iso: string, closed: Set<string>) =>
  new Date(`${iso}T00:00:00Z`).getUTCDay() !== 0 && !closed.has(iso);
export function earliestDay(now: Date, closed: Set<string>) {
  let day = addDays(isoDay(now), hourInRomania(now) >= CUTOFF_HOUR ? 2 : 1);
  while (!isOpenDay(day, closed)) day = addDays(day, 1);
  return day;
}
// Products priced per kg are ordered in half kilos (0.5-10 kg); everything else by the piece (1-50)
export const isPerKg = (unit: unknown) => typeof unit === 'string' && unit.trim().toLowerCase() === 'kg';
export const isValidQuantity = (quantity: unknown, unit: unknown) => {
  if (typeof quantity !== 'number') return false;
  return isPerKg(unit)
    ? quantity >= 0.5 && quantity <= 10 && Number.isInteger(quantity * 2)
    : Number.isInteger(quantity) && quantity >= 1 && quantity <= 50;
};
export const deliveryFee = (fulfilment: string, zone: string | null, subtotal: number) => {
  if (fulfilment !== 'delivery' || subtotal >= DELIVERY.freeThreshold) return 0;
  return zone === 'outside' ? DELIVERY.feeOutside : DELIVERY.feeCluj;
};
const round2 = (value: number) => Math.round(value * 100) / 100;
const number = (value: number) => new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 2 }).format(value);
const lei = (value: number) => `${number(value)} lei`;

// One line, no control characters (names end up in the email subject)
const line = (value: unknown) => (typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim() : '');

// Phone numbers are stored as digits (with + for international ones), so the same
// number always looks the same: 0740 123 456 → 0740123456, 0040 7… → +407…
const normalPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) return `+${digits}`;
  return digits.startsWith('00') ? `+${digits.slice(2)}` : digits;
};
const phoneOk = (raw: string, phone: string) => {
  const digits = phone.replace('+', '');
  return PHONE.test(raw) && digits.length >= 8 && digits.length <= 15;
};
// wa.me needs the international number without +; local numbers are Romanian
const whatsappLink = (phone: string) => {
  const international = phone.startsWith('+') ? phone.slice(1) : /^0\d{9}$/.test(phone) ? `40${phone.slice(1)}` : null;
  return international ? `https://wa.me/${international}` : null;
};
const present = <T,>(lines: (T | null | undefined | false | 0)[]) =>
  lines.filter((l) => l !== null && l !== undefined && l !== false && l !== 0) as T[];

// ---------------------------------------------------------------- contact form

export function validate(body: Record<string, unknown>, now: Date) {
  const kind = typeof body.kind === 'string' && Object.hasOwn(KINDS, body.kind) ? body.kind : 'contact';
  const name = line(body.name);
  const rawPhone = line(body.phone);
  const phone = normalPhone(rawPhone);
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const errors: string[] = [];
  if (!name || name.length > 200) errors.push('name');
  if (!phoneOk(rawPhone, phone)) errors.push('phone');
  if (!message || message.length > 5000) errors.push('message');

  let eventDate: string | null = null;
  const date = line(body.event_date);
  if (kind !== 'contact' && date) {
    const latest = isoDay(new Date(now.getTime() + 2 * 365 * 24 * 3600 * 1000));
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date));
    if (!valid || date < isoDay(now) || date > latest) errors.push('event_date');
    else eventDate = date;
  }
  let guests: number | null = null;
  if (kind !== 'contact' && body.guests !== undefined && body.guests !== null && body.guests !== '') {
    const count = Number(body.guests);
    if (!Number.isInteger(count) || count < 1 || count > 5000) errors.push('guests');
    else guests = count;
  }
  return { errors, value: { kind, name, phone, message, event_date: eventDate, guests } };
}

// The email to the shop; the subject gets SUBJECT_PREFIX when it is sent
export function emailFor(value: ReturnType<typeof validate>['value']) {
  const isEvent = value.kind === 'event';
  const when = value.event_date ? dayRo(value.event_date) : null;
  const whatsapp = whatsappLink(value.phone);
  const subject = `${KINDS[value.kind]}: ${value.name}${when ? `, ${when}` : ''}`;
  const text = present([
    `${KINDS[value.kind]} de la ${value.name}`,
    '',
    `Nume: ${value.name}`,
    `Telefon: ${value.phone}`,
    whatsapp && `WhatsApp: ${whatsapp}`,
    when && `${isEvent ? 'Data evenimentului' : 'Data dorită'}: ${when}`,
    value.guests && `${isEvent ? 'Număr de invitați' : 'Număr de porții'}: ${value.guests}`,
    '',
    'Mesaj:',
    value.message,
    '',
    '—',
    'Răspundeți clientului la telefon sau pe WhatsApp.',
    'Toate mesajele: Supabase → Table Editor → contact_submissions.',
  ]);
  return { subject, text: text.join('\n') };
}

// ------------------------------------------------------------------- orders

// The order as sent; days, products and prices are checked against the database later
export function validateOrder(body: Record<string, unknown>) {
  const name = line(body.name);
  const rawPhone = line(body.phone);
  const phone = normalPhone(rawPhone);
  const fulfilment = body.fulfilment === 'pickup' || body.fulfilment === 'delivery' ? body.fulfilment : null;
  const isDelivery = fulfilment === 'delivery';
  const zone = isDelivery && (body.delivery_zone === 'cluj' || body.delivery_zone === 'outside') ? body.delivery_zone : null;
  const address = isDelivery ? line(body.delivery_address) : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
  const wantedDate = line(body.wanted_date);
  const errors: string[] = [];
  if (!name || name.length > 200) errors.push('name');
  if (!phoneOk(rawPhone, phone)) errors.push('phone');
  if (!fulfilment) errors.push('fulfilment');
  if (isDelivery && !zone) errors.push('delivery_zone');
  if (isDelivery && (address.length < 5 || address.length > 300)) errors.push('delivery_address');
  if (notes.length > 1000) errors.push('notes');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(wantedDate) || Number.isNaN(Date.parse(wantedDate))) errors.push('wanted_date');

  // Same product twice counts once, with the quantities added up
  const quantities = new Map<string, number>();
  const items = Array.isArray(body.items) ? body.items : [];
  const wellFormed = items.every(
    (item) => item && typeof item.product_id === 'string' && UUID.test(item.product_id) &&
      typeof item.quantity === 'number' && Number.isFinite(item.quantity) && item.quantity > 0
  );
  if (wellFormed) for (const item of items) quantities.set(item.product_id, round2((quantities.get(item.product_id) || 0) + item.quantity));
  if (!wellFormed || quantities.size === 0 || quantities.size > MAX_ITEMS) errors.push('items');

  return {
    errors,
    value: {
      name, phone, fulfilment, delivery_zone: zone, delivery_address: address || null, notes: notes || null,
      wanted_date: wantedDate, language: body.language === 'en' ? 'en' : 'ro',
      items: [...quantities].map(([product_id, quantity]) => ({ product_id, quantity })),
    },
  };
}

type OrderLine = {
  product_id: string; name_snapshot: string; unit_price_snapshot: number;
  price_unit_snapshot: string | null; quantity: number; line_total_estimate: number;
};
type Order = ReturnType<typeof validateOrder>['value'] & { subtotal: number; fee: number; total: number };

export function orderEmailFor(order: Order, lines: OrderLine[]) {
  const when = dayRo(order.wanted_date, true);
  const whatsapp = whatsappLink(order.phone);
  const pickup = order.fulfilment === 'pickup';
  const quantity = (l: OrderLine) => (isPerKg(l.price_unit_snapshot) ? `${number(l.quantity)} kg` : `${number(l.quantity)} ×`);
  const subject = `Comandă: ${order.name}, ${when} (${pickup ? 'ridicare' : 'livrare'})`;
  const text = present([
    `Comandă nouă de la ${order.name}`,
    '',
    `Ziua: ${when}`,
    pickup
      ? 'Ridicare din magazin'
      : `Livrare ${order.delivery_zone === 'cluj' ? 'în Cluj-Napoca' : 'în afara Clujului'}: ${order.delivery_address}`,
    `Nume: ${order.name}`,
    `Telefon: ${order.phone}`,
    whatsapp && `WhatsApp: ${whatsapp}`,
    '',
    'Produse:',
    ...lines.map((l) =>
      `• ${quantity(l)} ${l.name_snapshot}: ${lei(l.line_total_estimate)} (${lei(l.unit_price_snapshot)}${l.price_unit_snapshot ? `/${l.price_unit_snapshot}` : ''})`),
    '',
    `Produse: ${lei(order.subtotal)}`,
    !pickup && `Livrare: ${order.fee ? lei(order.fee) : 'gratuită'}`,
    `Total estimat: ${lei(order.total)}`,
    order.notes && '',
    order.notes && 'Mențiuni:',
    order.notes,
    '',
    '—',
    'Sunați clientul sau scrieți-i pe WhatsApp pentru a confirma comanda, totalul și ora.',
    'Toate comenzile: Supabase → Table Editor → schema private → orders_overview.',
  ]);
  return { subject, text: text.join('\n') };
}

// ------------------------------------------------------------------ handler

export async function handle(req: Request, deps: Deps): Promise<Response> {
  const headers = cors(req.headers.get('origin'));
  const reply = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return reply(405, { error: 'method' });

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 20000) return reply(413, { error: 'too_large' });
    body = JSON.parse(raw);
    if (!body || typeof body !== 'object') throw new Error('not an object');
  } catch {
    return reply(400, { error: 'invalid', fields: [] });
  }

  // Bots fill in the hidden field, or send the form instantly: answer as if it worked
  const trapped = typeof body.website === 'string' && body.website.trim() !== '';
  const tooFast = typeof body.elapsed_ms !== 'number' || body.elapsed_ms < MIN_FILL_MS;
  if (trapped || tooFast) return reply(200, { ok: true });

  const now = deps.now();
  const isOrder = body.type === 'order';
  const checked = isOrder ? validateOrder(body) : validate(body, now);
  if (checked.errors.length) return reply(400, { error: 'invalid', fields: checked.errors });

  const { supabaseUrl, serviceKey, resendKey, to, from } = deps.env;
  const db = (path: string, init: RequestInit = {}) =>
    deps.fetch(`${supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', ...init.headers },
    });
  const readJson = async (path: string) => {
    const res = await db(path);
    if (!res.ok) throw new Error(`read failed: ${path.split('?')[0]} HTTP ${res.status}`);
    return res.json();
  };
  const countSince = async (table: string, filter: string) => {
    const since = new Date(now.getTime() - 3600 * 1000).toISOString();
    const res = await db(`${table}?select=id&created_at=gte.${encodeURIComponent(since)}${filter}`, {
      method: 'HEAD',
      headers: { Prefer: 'count=exact' },
    });
    if (!res.ok) throw new Error(`count failed: HTTP ${res.status}`);
    return Number((res.headers.get('content-range') || '').split('/')[1]) || 0;
  };
  const tooMany = async (table: string, phoneColumn: string, phone: string) =>
    (await countSince(table, `&${phoneColumn}=eq.${encodeURIComponent(phone)}`)) >= MAX_PER_PHONE_HOUR ||
    (await countSince(table, '')) >= MAX_PER_HOUR;
  // Every email the site sends goes through here, so each subject starts with SUBJECT_PREFIX.
  // Saved rows get emailed_at once the email is accepted (empty: the email failed).
  const sendEmail = async (message: { subject: string; text: string }, savedAt: string) => {
    if (!resendKey) return console.warn('RESEND_API_KEY is not set: saved, no email sent');
    const sent = await deps.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject: `${SUBJECT_PREFIX} ${message.subject}`, text: message.text }),
    });
    if (!sent.ok) return console.error(`email failed: HTTP ${sent.status} ${await sent.text()}`);
    await db(savedAt, { method: 'PATCH', body: JSON.stringify({ emailed_at: now.toISOString() }) });
  };

  try {
    if (isOrder) {
      const order = checked.value as ReturnType<typeof validateOrder>['value'];
      if (await tooMany('orders', 'customer_phone', order.phone)) return reply(429, { error: 'too_many' });

      // The day: from the earliest allowed one, open, at most MAX_DAYS_AHEAD ahead
      const today = isoDay(now);
      const closed = new Set<string>((await readJson(`closed_days?select=day&day=gte.${today}`)).map((d: { day: string }) => d.day));
      if (order.wanted_date < earliestDay(now, closed) || order.wanted_date > addDays(today, MAX_DAYS_AHEAD) || !isOpenDay(order.wanted_date, closed)) {
        return reply(400, { error: 'invalid', fields: ['wanted_date'] });
      }

      // Products and prices come from the database, never from the browser
      const ids = order.items.map((item) => item.product_id).join(',');
      const products = new Map<string, { id: string; name_ro: string; price: number; price_unit: string | null; isActive: boolean }>(
        (await readJson(`products?select=id,name_ro,price,price_unit,isActive&id=in.(${ids})`)).map((p: { id: string }) => [p.id, p])
      );
      const lines: OrderLine[] = [];
      for (const item of order.items) {
        const product = products.get(item.product_id);
        if (!product || !product.isActive || !(Number(product.price) > 0) || !isValidQuantity(item.quantity, product.price_unit)) {
          return reply(400, { error: 'invalid', fields: ['items'] });
        }
        lines.push({
          product_id: product.id,
          name_snapshot: product.name_ro,
          unit_price_snapshot: Number(product.price),
          price_unit_snapshot: product.price_unit,
          quantity: item.quantity,
          line_total_estimate: round2(Number(product.price) * item.quantity),
        });
      }
      const subtotal = round2(lines.reduce((sum, l) => sum + l.line_total_estimate, 0));
      const fee = deliveryFee(order.fulfilment as string, order.delivery_zone as string | null, subtotal);
      const total = round2(subtotal + fee);

      const created = await db('rpc/create_order', {
        method: 'POST',
        body: JSON.stringify({
          p_order: {
            customer_name: order.name, customer_phone: order.phone, fulfilment: order.fulfilment,
            delivery_zone: order.delivery_zone, delivery_address: order.delivery_address, wanted_date: order.wanted_date,
            notes: order.notes, subtotal_estimate: subtotal, delivery_fee: fee, total_estimate: total, language: order.language,
          },
          p_items: lines,
        }),
      });
      if (!created.ok) throw new Error(`order failed: HTTP ${created.status} ${await created.text()}`);
      const id = await created.json();
      await sendEmail(orderEmailFor({ ...order, subtotal, fee, total }, lines), `orders?id=eq.${id}`);
      return reply(200, { ok: true });
    }

    const value = checked.value as ReturnType<typeof validate>['value'];
    if (await tooMany('contact_submissions', 'phone', value.phone)) return reply(429, { error: 'too_many' });
    // Many links is what spam looks like: keep it (marked) but don't email it
    const spam = (value.message.match(LINK) || []).length > 3;
    const language = body.language === 'en' ? 'en' : 'ro';
    const saved = await db('contact_submissions?select=id', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ ...value, subject: KINDS[value.kind], details: { language }, spam }),
    });
    if (!saved.ok) throw new Error(`insert failed: HTTP ${saved.status} ${await saved.text()}`);
    const [{ id }] = await saved.json();
    if (!spam) await sendEmail(emailFor(value), `contact_submissions?id=eq.${id}`);
    return reply(200, { ok: true });
  } catch (error) {
    console.error(error);
    return reply(500, { error: 'server' });
  }
}

const deno = (globalThis as any).Deno;
if (deno) {
  const env = (name: string, fallback = '') => deno.env.get(name) || fallback;
  deno.serve((req: Request) =>
    handle(req, {
      env: {
        supabaseUrl: env('SUPABASE_URL'),
        serviceKey: env('SUPABASE_SERVICE_ROLE_KEY'),
        resendKey: env('RESEND_API_KEY'),
        to: env('ENQUIRY_TO', 'odette.confiserie@gmail.com'),
        from: env('ENQUIRY_FROM', 'Odette Confiserie <onboarding@resend.dev>'),
      },
      fetch,
      now: () => new Date(),
    })
  );
}
