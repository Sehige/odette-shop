import { describe, expect, it } from 'vitest';
import { enquiryBody } from '../components/pages/ContactPage';

const form = { kind: 'contact', name: 'Ana Pop', phone: '0740 123 456', event_date: '', message: 'Un tort cu fructe', website: '' };
const meta = { elapsedMs: 5000, language: 'ro' };

describe('contact form', () => {
  it('a message without a date goes as typed', () => {
    expect(enquiryBody(form, meta)).toMatchObject({ kind: 'contact', event_date: '', message: 'Un tort cu fructe', elapsed_ms: 5000, language: 'ro' });
  });

  // submit-enquiry keeps a date in its own field only for custom cakes and events
  it('on a plain message the order date opens the message, so the shop sees it', () => {
    const body = enquiryBody({ ...form, event_date: '2026-12-12' }, meta);
    expect(body.message).toBe('Data dorită: 12 decembrie 2026\n\nUn tort cu fructe');
    expect(body.event_date).toBe('');
  });

  it('a custom cake (old ?subiect= links) keeps the date in its own field', () => {
    const body = enquiryBody({ ...form, kind: 'custom_cake', event_date: '2026-12-12' }, { ...meta, language: 'en' });
    expect(body).toMatchObject({ kind: 'custom_cake', event_date: '2026-12-12', message: 'Un tort cu fructe', language: 'en' });
  });
});
