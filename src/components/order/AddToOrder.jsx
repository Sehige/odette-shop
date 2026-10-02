import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import { translations } from '../../data/translations';
import { useOrder } from '../../context/OrderContext';
import { canBeOrdered, defaultQuantity } from '../../order/rules';
import QuantityStepper from './QuantityStepper';

// Quantity + "Adaugă la comandă", under the product's price (modal and product page)
const AddToOrder = ({ product, language }) => {
  const t = translations[language].order;
  const { add, count } = useOrder();
  const [quantity, setQuantity] = useState(defaultQuantity(product.price_unit));
  const [added, setAdded] = useState(false);
  if (!canBeOrdered(product)) return null;

  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-stretch gap-3">
        <QuantityStepper
          quantity={quantity}
          unit={product.price_unit}
          language={language}
          onChange={(next) => { setQuantity(next); setAdded(false); }}
        />
        <button
          type="button"
          onClick={() => { add(product, quantity); setAdded(true); }}
          className="flex-1 min-w-[12rem] text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: '#1e40af' }}
        >
          <ShoppingBag className="w-5 h-5" aria-hidden="true" />
          {t.add}
        </button>
      </div>
      <p role="status" className="mt-2 min-h-[1.5rem] text-sm">
        {added && (
          <span className="inline-flex flex-wrap items-center gap-x-2 text-green-700">
            <Check className="w-4 h-4" aria-hidden="true" />
            {t.added}
            <Link to="/comanda" className="font-semibold text-blue-900 underline">
              {t.view} ({count})
            </Link>
          </span>
        )}
      </p>
    </div>
  );
};

export default AddToOrder;
