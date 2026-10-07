import React from 'react';
import { Building2, ClipboardList, FileText, Leaf, Recycle, Scale, Store, Users, Boxes, PackageOpen } from 'lucide-react';
import { foodWastePlan as plan } from '../../data/foodWastePlan';

const NAVY = '#1e3a8a';
const GOLD = '#d4af37';
const MEASURE_ICONS = { H_A: ClipboardList, H_B: Users, H_C: Boxes, H_E: PackageOpen };

// Section title with the gold icon, as on the other legal pages
const Heading = ({ icon: Icon, id, children }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
      <Icon className="text-white" size={24} aria-hidden="true" />
    </div>
    <h2 id={id} className="text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>{children}</h2>
  </div>
);
const Section = ({ shade, children }) => (
  <section className={`py-12 md:py-16 ${shade ? 'bg-gray-50' : 'bg-white'}`}>
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed">{children}</div>
    </div>
  </section>
);
const Bullets = ({ items }) => (
  <ul className="list-disc pl-6 space-y-2">{items.map((item) => <li key={item}>{item}</li>)}</ul>
);
const Table = ({ head, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm md:text-base border-collapse">
      {head && (
        <thead>
          <tr>{head.map((cell) => <th key={cell} scope="col" className="py-2 pr-4 border-b-2 border-gray-300 font-semibold text-gray-900">{cell}</th>)}</tr>
        </thead>
      )}
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]} className="border-b border-gray-200 align-top">
            {row.map((cell, i) => (i === 0 && !head
              ? <th key={i} scope="row" className="py-2 pr-4 font-semibold text-gray-900 w-2/5">{cell}</th>
              : <td key={i} className="py-2 pr-4">{cell}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// /risipa-alimentara: what happens to products close to their expiry date, and the full
// food waste reduction plan (Legea nr. 217/2016). The plan is published in Romanian;
// English visitors get a short summary first.
const FoodWastePage = ({ language }) => {
  const en = language === 'en';
  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: NAVY }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{en ? 'Reducing food waste' : 'Diminuarea risipei alimentare'}</h1>
            <p className="text-xl md:text-2xl mb-2" style={{ color: GOLD }}>{plan.title} {plan.legalBasis}</p>
            <p className="text-sm text-blue-200">{plan.period} · {plan.drawnUp}</p>
          </div>
        </div>
      </section>

      {/* What happens to products close to their expiry date (section 8 of the plan) */}
      <Section shade>
        <Heading icon={Recycle} id="ierarhie">
          {en ? 'What we do with products close to their expiry date' : 'Ce facem cu produsele aproape de expirare'}
        </Heading>
        {en ? (
          <p className="mb-6">
            Romanian law (Law no. 217/2016) asks food businesses to prevent waste and to publish their plan. We bake to order or
            in small batches, so little is left over; whatever is close to its expiry date is handled in this order of priority.
            The official plan below is in Romanian.
          </p>
        ) : (
          <p className="mb-6">
            Produsele noastre sunt realizate la comandă sau în serii mici, ca să rămână cât mai puțin nevândut. Pentru produsele
            aflate în apropierea termenului de valabilitate sau care nu pot fi comercializate, aplicăm, în ordinea priorității,
            măsurile de mai jos (art. 2 din Legea nr. 217/2016).
          </p>
        )}
        <ol className="space-y-3">
          {plan.hierarchy.map((step, index) => (
            <li key={step.measure} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
              <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: NAVY }}>
                {index + 1}
              </span>
              <span>
                <span className="block font-semibold text-gray-900">{step.measure}</span>
                <span className="block text-gray-600">{step.how}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <Heading icon={Building2}>1. Date de identificare ale operatorului economic</Heading>
        <Table rows={plan.identification} />
      </Section>

      <Section shade>
        <Heading icon={Store}>2. Obiectul de activitate și descrierea operațiunilor</Heading>
        {plan.activity.map((paragraph) => <p key={paragraph} className="mb-4">{paragraph}</p>)}
      </Section>

      <Section>
        <Heading icon={Scale}>3. Cadrul legislativ aplicabil</Heading>
        <p className="mb-4">Prezentul plan este elaborat în conformitate cu următoarele acte normative:</p>
        <Bullets items={plan.legalFramework} />
      </Section>

      {plan.measures.map((measure, index) => (
        <Section key={measure.code} shade={index % 2 === 0}>
          <Heading icon={MEASURE_ICONS[measure.code] || Leaf}>
            {index + 4}. Măsura {measure.code} – {measure.title}
          </Heading>
          <h3 className="font-semibold text-gray-900 mb-2">Obiectiv</h3>
          <p className="mb-6">{measure.objective}</p>
          <h3 className="font-semibold text-gray-900 mb-2">{measure.listTitle}</h3>
          {measure.intro && <p className="mb-3">{measure.intro}</p>}
          <ol className="list-decimal pl-6 space-y-2 mb-6">
            {measure.items.map(([title, text]) => (
              <li key={title}><strong className="text-gray-900">{title}:</strong> {text}</li>
            ))}
          </ol>
          {measure.extra && (
            <>
              <h3 className="font-semibold text-gray-900 mb-2">{measure.extraTitle}</h3>
              {measure.extraIntro && <p className="mb-3">{measure.extraIntro}</p>}
              <Bullets items={measure.extra} />
            </>
          )}
          {measure.table && (
            <>
              <h3 className="font-semibold text-gray-900 mb-3">{measure.tableTitle}</h3>
              <Table head={measure.tableHead} rows={measure.table} />
            </>
          )}
        </Section>
      ))}

      <Section shade>
        <Heading icon={Recycle}>8. Ierarhia măsurilor de prevenire și reducere a risipei alimentare</Heading>
        <p>
          Ordinea în care tratăm produsele aflate în apropierea termenului de valabilitate este descrisă la începutul paginii:{' '}
          <a href="#ierarhie" className="font-semibold text-blue-900 underline">Ce facem cu produsele aproape de expirare</a>.
        </p>
      </Section>

      <Section>
        <Heading icon={FileText}>9. Raportare și arhivare</Heading>
        <h3 className="font-semibold text-gray-900 mb-2">9.1. Raportare anuală</h3>
        <p className="mb-3">{plan.reporting.annual.intro}</p>
        <div className="mb-6"><Bullets items={plan.reporting.annual.items} /></div>
        <h3 className="font-semibold text-gray-900 mb-2">9.2. Publicare</h3>
        <p className="mb-6">{plan.reporting.publication}</p>
        <h3 className="font-semibold text-gray-900 mb-2">9.3. Arhivare</h3>
        <p className="mb-8">{plan.reporting.archiving}</p>
        <p className="border-t border-gray-200 pt-6 text-gray-600">
          Întocmit de: {plan.signedBy.name}, {plan.signedBy.role} · {plan.signedBy.date}
        </p>
      </Section>
    </div>
  );
};

export default FoodWastePage;
