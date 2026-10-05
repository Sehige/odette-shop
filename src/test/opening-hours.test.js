// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest';
import { directionsUrl, getOpenStatus, statusText, upcomingSpecialDays, weeklyRows } from '../lib/openingHours';

// Instants given as Romanian local time: October 2026 is UTC+3 until the 25th, then UTC+2
const at = (iso) => new Date(iso);
const text = (iso, special) => statusText(getOpenStatus(at(iso), special));

const cases = [
  ['Tue 10:00', '2026-10-06T10:00:00+03:00', 'Deschis acum · închide la 19:00'],
  ['Tue 18:45', '2026-10-06T18:45:00+03:00', 'Închide în curând · la 19:00'],
  ['Tue 19:00', '2026-10-06T19:00:00+03:00', 'Închis · deschide mâine la 09:00'],
  ['Sat 07:30', '2026-10-10T07:30:00+03:00', 'Închis · deschide azi la 08:00'],
  ['Sat 11:40', '2026-10-10T11:40:00+03:00', 'Închide în curând · la 12:00'],
  ['Sat 12:00', '2026-10-10T12:00:00+03:00', 'Închis · deschide luni la 09:00'],
  ['Sun 15:00', '2026-10-11T15:00:00+03:00', 'Închis · deschide mâine la 09:00'],
  ['Sun 25 Oct 23:30, after the clocks go back', '2026-10-25T23:30:00+02:00', 'Închis · deschide mâine la 09:00'],
  ['Sat 27 Mar 23:30, before the clocks go forward', '2027-03-27T23:30:00+02:00', 'Închis · deschide luni la 09:00'],
];

describe('opening hours', () => {
  const originalTz = process.env.TZ;
  afterEach(() => { process.env.TZ = originalTz; });

  it.each(cases)('%s', (_, iso, expected) => {
    expect(text(iso)).toBe(expected);
  });

  it('gives the same answer whatever time zone the computer is set to', () => {
    for (const tz of ['UTC', 'America/New_York', 'Asia/Tokyo']) {
      process.env.TZ = tz;
      for (const [, iso, expected] of cases) expect(text(iso)).toBe(expected);
    }
  });

  it('skips special days that are closed', () => {
    const christmas = { '2026-12-24': null, '2026-12-25': null };
    expect(text('2026-12-23T20:00:00+02:00', christmas)).toBe('Închis · deschide sâmbătă la 08:00');
    expect(text('2026-12-24T10:00:00+02:00', christmas)).toBe('Închis · deschide sâmbătă la 08:00');
  });

  it('uses special hours instead of the weekly ones', () => {
    const eve = { '2026-12-24': { open: '08:00', close: '14:00' } };
    expect(text('2026-12-24T13:40:00+02:00', eve)).toBe('Închide în curând · la 14:00');
    expect(text('2026-12-24T15:00:00+02:00', eve)).toBe('Închis · deschide mâine la 09:00');
    expect(text('2026-12-24T07:00:00+02:00', eve)).toBe('Închis · deschide azi la 08:00');
  });

  it('names the date when the next opening is a week or more away, and gives up after two weeks', () => {
    const week = Object.fromEntries(['2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-04'].map((d) => [d, null]));
    expect(text('2026-12-26T13:00:00+02:00', week)).toBe('Închis · deschide marți, 5 ianuarie la 09:00');
    const fortnight = {};
    for (let day = 1; day <= 20; day += 1) fortnight[`2027-01-${String(day).padStart(2, '0')}`] = null;
    expect(text('2026-12-31T20:00:00+02:00', fortnight)).toBe('Închis');
  });

  it('writes English too', () => {
    expect(statusText(getOpenStatus(at('2026-10-10T12:00:00+03:00')), 'en')).toBe('Closed · opens Monday at 09:00');
  });

  it('lists the week grouped, and upcoming special days', () => {
    expect(weeklyRows('ro')).toEqual([
      { days: 'Luni – Vineri', hours: '09:00 – 19:00' },
      { days: 'Sâmbătă', hours: '08:00 – 12:00' },
      { days: 'Duminică', hours: 'Închis' },
    ]);
    const special = { '2026-12-24': { open: '08:00', close: '14:00' }, '2026-12-25': null, '2027-03-01': null };
    expect(upcomingSpecialDays(at('2026-12-20T10:00:00+02:00'), special)).toEqual([
      { iso: '2026-12-24', day: 'Joi, 24 decembrie', hours: '08:00 – 14:00' },
      { iso: '2026-12-25', day: 'Vineri, 25 decembrie', hours: 'Închis' },
    ]);
  });

  it('links directions to the shop', () => {
    expect(directionsUrl()).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=Odette%20Confiserie%2C%20Strada%20C%C3%A2mpului%20133%2C%20Cluj-Napoca'
    );
  });
});
