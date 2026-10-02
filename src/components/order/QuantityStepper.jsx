import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { translations } from '../../data/translations';
import { formatQuantity, maxQuantity, minQuantity, quantityStep } from '../../order/rules';

// − 1,5 kg + : half kilos for products sold by weight, whole pieces otherwise
const QuantityStepper = ({ quantity, unit, language, onChange, label, size = 'md' }) => {
  const t = translations[language].order;
  const step = quantityStep(unit);
  const min = minQuantity(unit);
  const max = maxQuantity(unit);
  const button = `${size === 'sm' ? 'p-2' : 'p-3'} text-gray-700 hover:bg-gray-100 transition disabled:opacity-30 disabled:hover:bg-transparent`;
  return (
    <div role="group" aria-label={label || t.quantity} className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-white">
      <button type="button" className={button} onClick={() => onChange(Math.max(min, quantity - step))} disabled={quantity <= min} aria-label={t.less}>
        <Minus className="w-4 h-4" />
      </button>
      <output aria-live="polite" className={`${size === 'sm' ? 'min-w-[3.5rem]' : 'min-w-[4.5rem]'} text-center font-semibold text-gray-900`}>
        {formatQuantity(quantity, unit, language)}
      </output>
      <button type="button" className={button} onClick={() => onChange(Math.min(max, quantity + step))} disabled={quantity >= max} aria-label={t.more}>
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantityStepper;
