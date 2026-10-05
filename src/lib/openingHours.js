import { siteConfig } from '../data/siteConfig';

// Opening hours and the live "Deschis acum / Închis · deschide …" status. Always in the
// business's time zone (Europe/Bucharest), whatever the visitor's clock is set to.
// special days: { 'YYYY-MM-DD': { open, close } | null } (null = closed all day)

const ZONE = 'Europe/Bucharest';
const CLOSING_SOON_MINUTES = 30;
const LOOK_AHEAD_DAYS = 14;

const WEEKDAYS = {
  ro: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const minutesOf = (hhmm) => {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return hours * 60 + minutes;
};

// Year, month, day and minutes since midnight in Romania
function localNow(now) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now).map((part) => [part.type, part.value])
  );
  return { y: Number(parts.year), m: Number(parts.month), d: Number(parts.day), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

// Calendar day `offset` days after y-m-d (calendar arithmetic, so clock changes never skip a day)
function calendarDay(y, m, d, offset = 0) {
  const date = new Date(Date.UTC(y, m - 1, d + offset));
  return { iso: date.toISOString().slice(0, 10), weekday: date.getUTCDay() };
}

// The hours that apply on a day: a special day wins over the weekly hours
export function hoursOn(iso, weekday, specialDays = {}, weekly = siteConfig.openingHours) {
  if (Object.prototype.hasOwnProperty.call(specialDays, iso)) return specialDays[iso];
  return weekly[weekday] || null;
}

/**
 * @returns {{ state: 'open'|'closing', closes: string }
 *   | { state: 'closed', opens?: string, when?: 'today'|'tomorrow'|'later', weekday?: number, date?: string, inDays?: number }}
 */
export function getOpenStatus(now, specialDays = {}, weekly = siteConfig.openingHours) {
  const { y, m, d, minutes } = localNow(now);
  const today = calendarDay(y, m, d);
  const hours = hoursOn(today.iso, today.weekday, specialDays, weekly);
  if (hours && minutes >= minutesOf(hours.open) && minutes < minutesOf(hours.close)) {
    const left = minutesOf(hours.close) - minutes;
    return { state: left <= CLOSING_SOON_MINUTES ? 'closing' : 'open', closes: hours.close };
  }
  if (hours && minutes < minutesOf(hours.open)) return { state: 'closed', opens: hours.open, when: 'today' };
  for (let offset = 1; offset <= LOOK_AHEAD_DAYS; offset += 1) {
    const day = calendarDay(y, m, d, offset);
    const next = hoursOn(day.iso, day.weekday, specialDays, weekly);
    if (next) {
      return { state: 'closed', opens: next.open, when: offset === 1 ? 'tomorrow' : 'later', weekday: day.weekday, date: day.iso, inDays: offset };
    }
  }
  return { state: 'closed' };
}

const dayAndMonth = (iso, language) =>
  new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(new Date(`${iso}T00:00:00Z`));

// "Deschis acum · închide la 19:00", "Închis · deschide luni la 09:00", ...
export function statusText(status, language = 'ro') {
  const ro = language === 'ro';
  if (status.state === 'open') return ro ? `Deschis acum · închide la ${status.closes}` : `Open now · closes at ${status.closes}`;
  if (status.state === 'closing') return ro ? `Închide în curând · la ${status.closes}` : `Closing soon · at ${status.closes}`;
  if (!status.opens) return ro ? 'Închis' : 'Closed';
  if (status.when === 'today') return ro ? `Închis · deschide azi la ${status.opens}` : `Closed · opens today at ${status.opens}`;
  if (status.when === 'tomorrow') return ro ? `Închis · deschide mâine la ${status.opens}` : `Closed · opens tomorrow at ${status.opens}`;
  // a week or more away, the weekday alone would be ambiguous
  const day = WEEKDAYS[ro ? 'ro' : 'en'][status.weekday] + (status.inDays >= 7 ? `, ${dayAndMonth(status.date, language)}` : '');
  return ro ? `Închis · deschide ${day} la ${status.opens}` : `Closed · opens ${day} at ${status.opens}`;
}

// The week as rows, consecutive days with the same hours grouped: Luni – Vineri 09:00 – 19:00
export function weeklyRows(language = 'ro', weekly = siteConfig.openingHours) {
  const names = WEEKDAYS[language === 'ro' ? 'ro' : 'en'].map(capitalize);
  const order = [1, 2, 3, 4, 5, 6, 0];
  const key = (day) => (weekly[day] ? `${weekly[day].open}-${weekly[day].close}` : 'closed');
  const rows = [];
  for (const day of order) {
    const last = rows[rows.length - 1];
    if (last && last.key === key(day)) last.to = day;
    else rows.push({ key: key(day), from: day, to: day });
  }
  return rows.map(({ from, to }) => ({
    days: from === to ? names[from] : `${names[from]} – ${names[to]}`,
    hours: weekly[from] ? `${weekly[from].open} – ${weekly[from].close}` : language === 'ro' ? 'Închis' : 'Closed',
  }));
}

// Special days from today on, for listing under the weekly hours
export function upcomingSpecialDays(now, specialDays, language = 'ro', days = 30) {
  const { y, m, d } = localNow(now);
  const first = calendarDay(y, m, d).iso;
  const last = calendarDay(y, m, d, days).iso;
  const weekdays = WEEKDAYS[language === 'ro' ? 'ro' : 'en'];
  return Object.keys(specialDays)
    .filter((iso) => iso >= first && iso <= last)
    .sort()
    .map((iso) => {
      const hours = specialDays[iso];
      const weekday = new Date(`${iso}T00:00:00Z`).getUTCDay();
      return {
        iso,
        day: `${capitalize(weekdays[weekday])}, ${dayAndMonth(iso, language)}`,
        hours: hours ? `${hours.open} – ${hours.close}` : language === 'ro' ? 'Închis' : 'Closed',
      };
    });
}

// Google Maps directions to the shop, and its listing
export function directionsUrl() {
  const { name, maps, contact } = siteConfig;
  const destination = `${name}, ${contact.postalAddress.street}, ${contact.postalAddress.city}`;
  const placeId = maps.placeId ? `&destination_place_id=${encodeURIComponent(maps.placeId)}` : '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}${placeId}`;
}
