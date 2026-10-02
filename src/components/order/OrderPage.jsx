import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Send, ShoppingBag, Trash2 } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { useOrder } from '../../context/OrderContext';
import { useAllProducts } from '../../hooks/useProducts';
import { orderService } from '../../services/utilityServices';
import { getThumbnailUrl } from '../../utils/imageOptimizer';
import {
  canBeOrdered, deliveryFee, formatDay, formatLei, formatQuantity, isoDay, isPerKg, isValidQuantity, lineTotal, orderDays,
} from '../../order/rules';
import QuantityStepper from './QuantityStepper';
import Toast from '../common/Toast';

const NAVY = '#1e3a8a';
const FIELD = 'w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition disabled:opacity-50';
const LABEL = 'block text-sm font-semibold text-gray-700 mb-2';
const CARD = 'bg-white rounded-2xl p-4 sm:p-6 shadow-sm';
// `website` is a trap: hidden from people, but bots that fill in every field fill it in
const EMPTY_FORM = { fulfilment: 'pickup', delivery_zone: 'cluj', delivery_address: '', wanted_date: '', name: '', phone: '', notes: '', website: '' };

const choiceClass = (checked) =>
  `block rounded-xl border-2 p-4 cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-900 has-[:focus-visible]:ring-offset-2 ${
    checked ? 'border-blue-900 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
  }`;
const monthOf = (iso, language) => {
  const month = new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${iso}T00:00:00Z`));
  return month.charAt(0).toUpperCase() + month.slice(1);
};
const nameOf = (item, language) => (language === 'ro' ? item.name_ro : item.name_en || item.name_ro);
// "1,5 kg Tort exotic" / "2 × Babka cu nucă"
const amountOf = (item, language) => `${formatQuantity(item.quantity, item.price_unit, language)}${isPerKg(item.price_unit) ? '' : ' ×'}`;

const OrderPage = ({ language }) => {
  const t = translations[language].order;
  const { items, ready, setQuantity, remove, clear } = useOrder();
  const { products, loading, error: productsError } = useAllProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const [days, setDays] = useState([]);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [sent, setSent] = useState(null); // what was just ordered, for the thank-you screen
  // When the form appeared: the server ignores forms sent within seconds (bots)
  const shownAt = useRef(0);

  // The days on offer depend on today's date and the closed days, so they are worked out here
  const loadDays = async () => {
    const closed = new Set(await orderService.getClosedDays(isoDay(new Date())));
    setDays(orderDays(new Date(), closed));
  };
  useEffect(() => {
    shownAt.current = Date.now();
    loadDays();
  }, []);

  // Current names, prices and availability; the list's own copy until products load
  const current = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const lines = items.map((item) => {
    const product = current.get(item.id);
    const checked = !loading && !productsError;
    const latest = product
      ? { name_ro: product.name_ro, name_en: product.name_en, slug: product.slug, price: Number(product.price), price_unit: product.price_unit }
      : {};
    const line = { ...item, ...latest };
    const available = !checked || (canBeOrdered(product) && isValidQuantity(item.quantity, product.price_unit));
    return { ...line, available, total: lineTotal(line.price, item.quantity) };
  });
  const subtotal = lines.filter((l) => l.available).reduce((sum, l) => sum + l.total, 0);
  const isDelivery = form.fulfilment === 'delivery';
  const fee = deliveryFee(form.fulfilment, form.delivery_zone, subtotal);
  const total = subtotal + fee;
  const dayGroups = [...days.reduce((groups, day) => {
    const month = monthOf(day, language);
    groups.set(month, [...(groups.get(month) || []), day]);
    return groups;
  }, new Map())];

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const fail = (message) => setToast({ message, type: 'error' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;
    if (lines.some((l) => !l.available)) return fail(t.errors.items);
    if (!form.name.trim() || !form.phone.trim() || !form.wanted_date || (isDelivery && !form.delivery_address.trim())) {
      return fail(t.errors.fill);
    }
    const digits = form.phone.replace(/\D/g, '');
    if (!/^\+?[\d\s().\/-]+$/.test(form.phone.trim()) || digits.length < 8 || digits.length > 15) return fail(t.errors.phone);

    setSending(true);
    try {
      const { error } = await orderService.submitOrder({
        name: form.name,
        phone: form.phone,
        fulfilment: form.fulfilment,
        delivery_zone: isDelivery ? form.delivery_zone : null,
        delivery_address: isDelivery ? form.delivery_address : null,
        wanted_date: form.wanted_date,
        notes: form.notes,
        items: lines.map((l) => ({ product_id: l.id, quantity: l.quantity })),
        website: form.website,
        elapsed_ms: Date.now() - shownAt.current,
        language,
      });
      if (error) {
        const fields = error.fields || [];
        if (error.reason === 'too_many') return fail(t.errors.tooMany);
        if (error.reason !== 'invalid') return fail(t.errors.server);
        if (fields.includes('wanted_date')) {
          setForm((current) => ({ ...current, wanted_date: '' }));
          loadDays();
          return fail(t.errors.day);
        }
        if (fields.includes('items')) return fail(t.errors.items);
        if (fields.includes('phone')) return fail(t.errors.phone);
        return fail(t.errors.invalid);
      }
      setSent({ day: form.wanted_date, fulfilment: form.fulfilment, lines, total });
      clear();
      setForm(EMPTY_FORM);
      window.scrollTo({ top: 0 });
    } finally {
      setSending(false);
    }
  };

  let content = null;
  if (sent) {
    content = (
      <div className={`${CARD} text-center`} role="status">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-white" size={32} aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.successTitle}</h2>
        <p className="text-gray-600 mb-6">{t.successText}</p>
        <p className="font-semibold text-gray-900">
          {formatDay(sent.day, language)} · {sent.fulfilment === 'pickup' ? t.pickup : t.deliveryOption}
        </p>
        <ul className="mt-3 space-y-1 text-gray-700">
          {sent.lines.map((l) => (
            <li key={l.id}>{amountOf(l, language)} {nameOf(l, language)}</li>
          ))}
        </ul>
        <p className="mt-3 font-semibold text-gray-900">{t.total}: {formatLei(sent.total, language)}</p>
        <Link to="/shop" className="inline-block mt-6 px-6 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: NAVY }}>
          {t.backToShop}
        </Link>
      </div>
    );
  } else if (ready && lines.length === 0) {
    content = (
      <div className={`${CARD} text-center`}>
        <ShoppingBag className="mx-auto w-12 h-12 text-gray-400 mb-4" aria-hidden="true" />
        <p className="text-gray-600 mb-6">{t.empty}</p>
        <Link to="/shop" className="inline-block px-6 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: NAVY }}>
          {t.browse}
        </Link>
      </div>
    );
  } else if (ready) {
    content = (
      <>
        <p className="text-center text-gray-600 mb-8">{t.subtitle}</p>

        <section aria-labelledby="order-products" className={`${CARD} mb-6`}>
          <h2 id="order-products" className="text-xl font-bold mb-2" style={{ color: NAVY }}>{t.products}</h2>
          <ul className="divide-y divide-gray-200">
            {lines.map((l) => (
              <li key={l.id} className="py-4 flex gap-4">
                <img src={getThumbnailUrl(l.image_url)} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <Link to={`/produse/${l.slug}`} className="font-semibold text-gray-900 hover:underline break-words">{nameOf(l, language)}</Link>
                    {l.available && <span className="font-semibold text-gray-900 whitespace-nowrap">{formatLei(l.total, language)}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{formatLei(l.price, language)}{l.price_unit ? `/${l.price_unit}` : ''}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {l.available ? (
                      <QuantityStepper
                        size="sm"
                        quantity={l.quantity}
                        unit={l.price_unit}
                        language={language}
                        onChange={(quantity) => setQuantity(l.id, quantity)}
                        label={`${t.quantity}: ${nameOf(l, language)}`}
                      />
                    ) : (
                      <p className="text-sm text-red-700">{t.unavailable}</p>
                    )}
                    <button type="button" onClick={() => remove(l.id)} className="text-sm text-gray-600 hover:text-red-700 inline-flex items-center gap-1">
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                      {t.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className={`${CARD} space-y-5`}>
            <fieldset>
              <legend className="text-xl font-bold mb-4" style={{ color: NAVY }}>{t.howTitle}</legend>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className={choiceClass(!isDelivery)}>
                  <input type="radio" name="fulfilment" value="pickup" checked={!isDelivery} onChange={set('fulfilment')} className="sr-only" />
                  <span className="block font-semibold text-gray-900">{t.pickup}</span>
                  <span className="block text-sm text-gray-600 mt-1">{siteConfig.contact.address[language]}</span>
                </label>
                <label className={choiceClass(isDelivery)}>
                  <input type="radio" name="fulfilment" value="delivery" checked={isDelivery} onChange={set('fulfilment')} className="sr-only" />
                  <span className="block font-semibold text-gray-900">{t.deliveryOption}</span>
                  <span className="block text-sm text-gray-600 mt-1">
                    {t.zoneCluj} {siteConfig.delivery.feeCluj} lei · {t.zoneOutside} {siteConfig.delivery.feeOutside} lei · {t.freeFrom} {siteConfig.delivery.freeThreshold} lei
                  </span>
                </label>
              </div>
            </fieldset>

            {isDelivery && (
              <>
                <fieldset>
                  <legend className={LABEL}>{t.zoneTitle}</legend>
                  <div className="flex flex-wrap gap-2">
                    {[['cluj', t.zoneCluj, siteConfig.delivery.feeCluj], ['outside', t.zoneOutside, siteConfig.delivery.feeOutside]].map(([zone, label, price]) => (
                      <label
                        key={zone}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-semibold cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-900 has-[:focus-visible]:ring-offset-2 ${
                          form.delivery_zone === zone ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <input type="radio" name="delivery_zone" value={zone} checked={form.delivery_zone === zone} onChange={set('delivery_zone')} className="sr-only" />
                        {label} ({price} lei)
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="order-address" className={LABEL}>{t.address} *</label>
                  <textarea id="order-address" rows={2} required autoComplete="street-address" value={form.delivery_address} onChange={set('delivery_address')} className={`${FIELD} resize-none`} />
                </div>
              </>
            )}

            <div>
              <label htmlFor="order-day" className={LABEL}>{t.day} *</label>
              <select id="order-day" required value={form.wanted_date} onChange={set('wanted_date')} className={`${FIELD} bg-white`}>
                <option value="">{t.chooseDay}</option>
                {dayGroups.map(([month, list]) => (
                  <optgroup key={month} label={month}>
                    {list.map((day) => (
                      <option key={day} value={day}>{formatDay(day, language)}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-600">{t.dayHint}</p>
            </div>
          </section>

          <section className={`${CARD} space-y-4`}>
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>{t.details}</h2>
            <div>
              <label htmlFor="order-name" className={LABEL}>{t.name} *</label>
              <input id="order-name" type="text" required autoComplete="name" value={form.name} onChange={set('name')} className={FIELD} />
            </div>
            <div>
              <label htmlFor="order-phone" className={LABEL}>{t.phone} *</label>
              <input id="order-phone" type="tel" required autoComplete="tel" placeholder="07xx xxx xxx" value={form.phone} onChange={set('phone')} className={FIELD} />
            </div>
            <div>
              <label htmlFor="order-notes" className={LABEL}>{t.notes}</label>
              <textarea id="order-notes" rows={3} value={form.notes} onChange={set('notes')} placeholder={t.notesPlaceholder} className={`${FIELD} resize-none`} />
            </div>
            <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
              <label htmlFor="order-website">Website</label>
              <input id="order-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
            </div>
          </section>

          <section className={CARD}>
            <dl className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <dt>{t.products}</dt>
                <dd>{formatLei(subtotal, language)}</dd>
              </div>
              {isDelivery && (
                <div className="flex justify-between">
                  <dt>{t.delivery}</dt>
                  <dd>{fee ? formatLei(fee, language) : t.free}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
                <dt>{t.total}</dt>
                <dd id="order-total">{formatLei(total, language)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-gray-600">{t.estimateNote}</p>
            <button
              type="submit"
              disabled={sending}
              className="mt-5 w-full py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              // navy on gold, as on the contact form (readable contrast)
              style={{ backgroundColor: sending ? '#6b7280' : '#d4af37', color: sending ? '#ffffff' : NAVY }}
            >
              <Send size={20} aria-hidden="true" />
              {sending ? t.sending : t.submit}
            </button>
          </section>
        </form>
      </>
    );
  }

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3 text-center">{t.title}</h1>
        {content}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default OrderPage;
