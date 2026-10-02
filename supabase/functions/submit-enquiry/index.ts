// submit-enquiry: receives the website's contact form (questions, custom cakes, events),
// checks it, saves it in contact_submissions and emails the shop. The website calls it
// instead of writing to the table, so spam checks cannot be skipped.
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
const LINK = /https?:\/\/|www\./gi;
const MIN_FILL_MS = 3000; // nobody types a message faster; bots do
const MAX_PER_PHONE_HOUR = 5;
const MAX_PER_HOUR = 30; // keeps a flood from using up the email quota

const cors = (origin: string | null): Record<string, string> => ({
  'Access-Control-Allow-Origin':
    origin && ORIGINS.some((re) => re.test(origin)) ? origin : 'https://www.odette-confiserie.ro',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
});

// A date as YYYY-MM-DD in Romania
const isoDay = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(date);
const dayRo = (iso: string) =>
  new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${iso}T00:00:00Z`));
// One line, no control characters (names end up in the email subject)
const line = (value: unknown) => (typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim() : '');

// Phone numbers are stored as digits (with + for international ones), so the same
// number always looks the same: 0740 123 456 → 0740123456, 0040 7… → +407…
const normalPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) return `+${digits}`;
  return digits.startsWith('00') ? `+${digits.slice(2)}` : digits;
};
// wa.me needs the international number without +; local numbers are Romanian
const whatsappLink = (phone: string) => {
  const international = phone.startsWith('+') ? phone.slice(1) : /^0\d{9}$/.test(phone) ? `40${phone.slice(1)}` : null;
  return international ? `https://wa.me/${international}` : null;
};

export function validate(body: Record<string, unknown>, now: Date) {
  const kind = typeof body.kind === 'string' && Object.hasOwn(KINDS, body.kind) ? body.kind : 'contact';
  const name = line(body.name);
  const rawPhone = line(body.phone);
  const phone = normalPhone(rawPhone);
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const errors: string[] = [];
  if (!name || name.length > 200) errors.push('name');
  if (!PHONE.test(rawPhone) || phone.replace('+', '').length < 8 || phone.replace('+', '').length > 15) errors.push('phone');
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
  const text = [
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
  ].filter((l) => l !== null && l !== undefined && l !== false);
  return { subject, text: text.join('\n') };
}

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
  const { errors, value } = validate(body, now);
  if (errors.length) return reply(400, { error: 'invalid', fields: errors });

  const { supabaseUrl, serviceKey, resendKey, to, from } = deps.env;
  const db = (path: string, init: RequestInit = {}) =>
    deps.fetch(`${supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', ...init.headers },
    });
  const countSince = async (filter: string) => {
    const since = new Date(now.getTime() - 3600 * 1000).toISOString();
    const res = await db(`contact_submissions?select=id&created_at=gte.${encodeURIComponent(since)}${filter}`, {
      method: 'HEAD',
      headers: { Prefer: 'count=exact' },
    });
    if (!res.ok) throw new Error(`count failed: HTTP ${res.status}`);
    return Number((res.headers.get('content-range') || '').split('/')[1]) || 0;
  };
  // Every email the site sends goes through here, so each subject starts with SUBJECT_PREFIX
  const sendEmail = (message: { subject: string; text: string }) =>
    deps.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject: `${SUBJECT_PREFIX} ${message.subject}`, text: message.text }),
    });

  try {
    if (
      (await countSince(`&phone=eq.${encodeURIComponent(value.phone)}`)) >= MAX_PER_PHONE_HOUR ||
      (await countSince('')) >= MAX_PER_HOUR
    ) {
      return reply(429, { error: 'too_many' });
    }

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

    if (!spam && resendKey) {
      const sent = await sendEmail(emailFor(value));
      // The message is saved either way; emailed_at stays empty if the email failed
      if (sent.ok) {
        await db(`contact_submissions?id=eq.${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ emailed_at: now.toISOString() }),
        });
      } else {
        console.error(`email failed: HTTP ${sent.status} ${await sent.text()}`);
      }
    } else if (!resendKey) {
      console.warn('RESEND_API_KEY is not set: message saved, no email sent');
    }
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
