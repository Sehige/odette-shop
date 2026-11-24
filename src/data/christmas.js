// The Christmas and New Year offer (/craciun), from the owner's catalogue
// "Oferta de Crăciun 2026" (Canva). Update it every November; the page and its address stay.
// Prices in lei. `image` is the photo's name in src/assets/christmas (<image>-<width>.webp).
// `product` links a card to an existing product page (/produse/<slug>), which has the
// ingredients and allergens.

export const christmas = {
  year: 2026,
  // last change of this offer, for the sitemap
  updated: '2026-11-24',

  // last day to order
  orderBy: '21 decembrie',
  orderByEn: '21 December',

  // Orders are picked up from the lab or delivered only on these days, so everything is fresh
  pickup: [
    { days: '23–24 decembrie', until: 'pe 24 decembrie până la ora 12:00', en: '23–24 December (on the 24th until 12:00)' },
    { days: '30–31 decembrie', until: 'pe 31 decembrie până la ora 12:00', en: '30–31 December (on the 31st until 12:00)' },
  ],
  // the same, in short
  pickupHours: 'pe 24 și pe 31 până la ora 12:00',

  sections: [
    {
      id: 'cutii',
      title: 'Cutii cadou de Crăciun',
      intro: 'Asortimente gata făcute pentru masa de sărbători sau pentru un cadou: prăjituri ca pe vremuri, fursecuri, macarons și madeleine, așezate frumos în cutie.',
      layout: 'large',
      items: [
        {
          id: 'nostalgie-la-cutie',
          name: 'Nostalgie la cutie',
          image: 'nostalgie-la-cutie',
          description: 'Cutia preferată a tuturor clienților cărora le e poftă de prăjituri „ca pe vremuri”. Am folosit rețetele familiei mele din Maramureș și le-am adaptat cu tehnici profesionale și ingrediente premium pentru a obține un pachet perfect echilibrat.',
          variants: [
            {
              name: 'Cutia 1',
              weight: '1,08 kg',
              pieces: 32,
              price: 169,
              contents: ['8 choux cu vanilie', '6 Doboș', '6 Albinița', '6 Albă-ca-zăpada', '6 nuci cu ciocolată'],
            },
            {
              name: 'Cutia 2',
              weight: '1,34 kg',
              pieces: 41,
              price: 209,
              contents: ['8 choux cu vanilie', '7 Doboș', '7 Albinița', '7 Albă-ca-zăpada', '12 nuci cu ciocolată'],
            },
          ],
        },
        {
          id: 'cutia-colindatorilor',
          name: 'Cutia colindătorilor',
          image: 'cutia-colindatorilor',
          description: 'Acest asortiment e potrivit pentru a-ți încânta musafirii cu o selecție delicioasă de prăjituri făcute artizanal cu ingrediente de calitate la noi în laborator.',
          weight: '1,22 kg',
          pieces: 41,
          price: 189,
          contents: ['6 crinkle cookies', '11 linzere cu magiun de prune', '8 bucăți de ciocolată de casă', '8 brownie', '8 madeleine cu portocale'],
        },
        {
          id: 'cutia-aia',
          name: 'Cutia „Aia”',
          image: 'cutia-aia',
          description: 'Știm cum e când ai musafiri de seamă și nu mai știi cu ce să îi impresionezi, așa că am pregătit Cutia „Aia” pentru musafirii „Ăia”…',
          weight: '420 g',
          pieces: 16,
          price: 99,
          contents: ['4 Doboș', '4 macarons cu ciocolată cu lapte și alune', '4 mousse de ciocolată cu vișine și tonka', '4 madeleine cu portocale, ciocolată albă și fistic'],
        },
        {
          id: 'turn-de-madeleine',
          name: 'Turn de madeleine',
          image: 'turn-de-madeleine',
          description: 'Orice masă festivă are nevoie de un centerpiece, așa că am pregătit un aranjament de madeleine care să fure toate privirile: madeleine cu aromă de portocale, acoperite cu ciocolată albă Callebaut.',
          weight: '450 g',
          price: 95,
        },
      ],
    },
    {
      id: 'babka',
      title: 'Cozonac babka și cozonaci',
      intro: 'Aluat cu unt și ouă, dospit lent și împletit cu cremă de nucă, mac, ciocolată sau fistic. Cozonacul babka este cozonacul nostru de sărbători, iar pentru cei care țin la tradiție avem și cozonac clasic cu mac sau nucă.',
      items: [
        { id: 'babka-cu-mac', name: 'Babka cu mac', image: 'babka-cu-mac', weight: '700 g', price: 80, product: 'babka-cu-mac' },
        { id: 'babka-cu-nuca', name: 'Babka cu nucă', image: 'babka-cu-nuca', weight: '700 g', price: 80, product: 'babka-cu-nuca' },
        { id: 'babka-cu-ciocolata', name: 'Babka cu ciocolată', image: 'babka-cu-ciocolata', weight: '700 g', price: 80, product: 'babka-cu-nuca-si-ciocolata' },
        { id: 'babka-cu-fistic', name: 'Babka cu fistic', image: 'babka-cu-fistic', weight: '700 g', price: 100, product: 'babka-cu-fistic' },
        { id: 'cozonac-cu-mac-sau-nuca', name: 'Cozonac cu mac sau nucă', image: 'cozonac-cu-mac-sau-nuca', weight: '1 kg', price: 120 },
        { id: 'mini-babka-cu-ciocolata', name: 'Mini babka cu ciocolată', image: 'mini-babka-cu-ciocolata', weight: '150 g', price: 20 },
      ],
    },
    {
      id: 'la-gramaj',
      title: 'Fursecuri și prăjituri la gramaj',
      intro: 'Ambalate individual, în pachete de 100 g, 500 g sau 1 kg din fiecare. Prețul afișat este pentru 100 g.',
      items: [
        { id: 'linzere-cu-magiun-de-prune', name: 'Linzere cu magiun de prune', image: 'linzere-cu-magiun-de-prune', price: 18, per: '100 g' },
        { id: 'nuci-cu-crema-de-ciocolata', name: 'Nuci cu cremă de ciocolată', image: 'nuci-cu-crema-de-ciocolata', price: 17, per: '100 g' },
        { id: 'brownie-cu-peanut-butter', name: 'Brownie cu peanut butter', image: 'brownie-cu-peanut-butter', price: 17, per: '100 g' },
        { id: 'cosulete-cu-magiun-de-prune', name: 'Coșulețe cu magiun de prune', image: 'cosulete-cu-magiun-de-prune', price: 16, per: '100 g' },
        { id: 'ciocolata-de-casa-cu-migdale', name: 'Ciocolată de casă cu fulgi de migdale', image: 'ciocolata-de-casa-cu-migdale', price: 16, per: '100 g' },
        { id: 'madeleine-asortate', name: 'Madeleine asortate', image: 'madeleine-asortate', price: 15, per: '100 g', product: 'pachet-madeleine-asortate' },
        { id: 'crinkle-cookies', name: 'Crinkle cookies', image: 'crinkle-cookies', price: 14, per: '100 g' },
        { id: 'saratele', name: 'Sărățele', image: 'saratele', price: 14, per: '100 g', product: 'saratele-cu-chimen' },
        { id: 'macarons-ciocolata-cu-lapte-si-alune', name: 'Macarons cu ganache de ciocolată cu lapte și alune', image: 'macarons-ciocolata-cu-lapte-si-alune', price: 8, per: 'buc' },
      ],
    },
    {
      id: 'camara',
      title: 'Pentru cămară și cadouri',
      intro: 'Mici bucurii de iarnă, bune de pus lângă o cutie de prăjituri.',
      items: [
        { id: 'condimente-pentru-vin-fiert', name: 'Condimente pentru vin fiert', image: 'condimente-pentru-vin-fiert', price: 20, per: '100 g' },
        { id: 'caramel-sarat', name: 'Caramel sărat la borcan', image: 'caramel-sarat', weight: '212 ml', price: 19 },
        { id: 'magiun-de-prune', name: 'Magiun de prune', image: 'magiun-de-prune', weight: '400 g', price: 22 },
      ],
    },
  ],
};

/** Every product and box variant on the page, flattened (for the structured data and tests) */
export const christmasItems = () => christmas.sections.flatMap((s) => s.items);
