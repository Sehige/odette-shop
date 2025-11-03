import React from 'react';
import { translations } from '../../data/translations';

const TrustBadges = ({ language }) => {
  const t = translations[language];
  
  const badges = [
    { icon: '🌱', title: t.freshDaily },
    { icon: '🏔️', title: t.localIngredients },
    { icon: '🎨', title: t.customOrders },
    { icon: '🚀', title: t.expressDelivery }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#dbeafe' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h3 className="font-semibold text-gray-900">{badge.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;