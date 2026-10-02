import { siteConfig } from '../data/siteConfig';

// Order-request rules as the website shows them. The submit-enquiry Edge Function
// checks the same rules again (its own copy, since it is deployed on its own);
// src/test/order-rules.test.js makes sure both copies agree.

export const CUTOFF_HOUR = 18; // ordered before 18:00 → ready from the next day
export const DAYS_SHOWN = 60; // how far ahead the order page offers days
const ZONE = 'Europe/Bucharest';

// A day as YYYY-MM-DD, and the hour (0-23), in Romania
export const isoDay = (date) => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(date);
const hourInRomania = (date) =>
  Number(new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, hour: '2-digit', hourCycle: 'h23' }).format(date));

export const addDays = (iso, days) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

// Pickup and delivery happen Monday to Saturday, except closed days
export const isOpenDay = (iso, closedDays) => new Date(`${iso}T00:00:00Z`).getUTCDay() !== 0 && !closedDays.has(iso);

export function earliestDay(now, closedDays) {
  let day = addDays(isoDay(now), hourInRomania(now) >= CUTOFF_HOUR ? 2 : 1);
  while (!isOpenDay(day, closedDays)) day = addDays(day, 1);
  return day;
}

// The days a customer can choose, soonest first
export function orderDays(now, closedDays, count = DAYS_SHOWN) {
  const first = earliestDay(now, closedDays);
  const days = [];
  for (let i = 0; i < count; i += 1) {
    const day = addDays(first, i);
    if (isOpenDay(day, closedDays)) days.push(day);
  }
  return days;
}

// Products priced per kg are ordered in half kilos (0.5-10 kg); everything else by the piece (1-50)
export const isPerKg = (unit) => (unit || '').trim().toLowerCase() === 'kg';
export const quantityStep = (unit) => (isPerKg(unit) ? 0.5 : 1);
export const minQuantity = (unit) => (isPerKg(unit) ? 0.5 : 1);
export const maxQuantity = (unit) => (isPerKg(unit) ? 10 : 50);
export const defaultQuantity = () => 1;
export const isValidQuantity = (quantity, unit) =>
  typeof quantity === 'number' &&
  quantity >= minQuantity(unit) &&
  quantity <= maxQuantity(unit) &&
  Number.isInteger(quantity / quantityStep(unit));

export const canBeOrdered = (product) => !!product && Number(product.price) > 0;

const round2 = (value) => Math.round(value * 100) / 100;
export const lineTotal = (price, quantity) => round2(Number(price) * quantity);

export function deliveryFee(fulfilment, zone, subtotal) {
  const { feeCluj, feeOutside, freeThreshold } = siteConfig.delivery;
  if (fulfilment !== 'delivery' || subtotal >= freeThreshold) return 0;
  return zone === 'outside' ? feeOutside : feeCluj;
}

// 1.5 → "1,5" (Romanian decimal comma)
export const formatNumber = (value, language) =>
  new Intl.NumberFormat(language === 'ro' ? 'ro-RO' : 'en-GB', { maximumFractionDigits: 2 }).format(value);

// 1.5 kg → "1,5 kg"; pieces are just the count
export const formatQuantity = (quantity, unit, language) =>
  isPerKg(unit) ? `${formatNumber(quantity, language)} kg` : formatNumber(quantity, language);

export const formatLei = (value, language) => `${formatNumber(value, language)} lei`;

// "sâmbătă, 12 decembrie"
export const formatDay = (iso, language) =>
  new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(new Date(`${iso}T00:00:00Z`));
