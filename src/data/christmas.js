// The Christmas and New Year offer (/craciun), from the owner's catalogue
// "Oferta de Crăciun 2026" (Canva). Update it every November; the page and its address stay.
// Prices in lei. `image` is the photo's name in src/assets/christmas (<image>-<width>.webp);
// `nav` is the section's short name on the buttons that jump to it.
// Each text has its English version in the same field name ending in "En" (nameEn, introEn, ...).

export const christmas = {
  year: 2026,
  // last change of this offer, for the sitemap
  updated: '2026-11-24',

  // last day to order
  orderBy: '21 decembrie',
  orderByEn: '21 December',
  // the homepage opens with the Christmas banner until this day (the last day to order)
  bannerUntil: '2026-12-21',

  // Orders are picked up from the lab or delivered only on these days, so everything is fresh
  pickup: [
    { days: '23–24 decembrie', daysEn: '23–24 December', until: 'pe 24 decembrie până la ora 12:00', untilEn: 'on the 24th until 12:00' },
    { days: '30–31 decembrie', daysEn: '30–31 December', until: 'pe 31 decembrie până la ora 12:00', untilEn: 'on the 31st until 12:00' },
  ],
  // the same, in short
  pickupHours: 'pe 24 și pe 31 până la ora 12:00',
  pickupHoursEn: 'on the 24th and the 31st until 12:00',

  sections: [
    {
      id: 'cutii',
      title: 'Cutii cadou de Crăciun',
      titleEn: 'Christmas gift boxes',
      nav: 'Cutii cadou',
      navEn: 'Gift boxes',
      intro: 'Asortimente gata făcute pentru masa de sărbători sau pentru un cadou: prăjituri ca pe vremuri, fursecuri, macarons și madeleine, așezate frumos în cutie.',
      introEn: 'Ready-made assortments for the holiday table or as a gift: old-fashioned cakes, cookies, macarons and madeleines, neatly arranged in a box.',
      layout: 'large',
      items: [
        {
          id: 'nostalgie-la-cutie',
          name: 'Nostalgie la cutie',
          nameEn: 'Nostalgia in a box',
          image: 'nostalgie-la-cutie',
          description: 'Cutia preferată a tuturor clienților cărora le e poftă de prăjituri „ca pe vremuri”. Am folosit rețetele familiei mele din Maramureș și le-am adaptat cu tehnici profesionale și ingrediente premium pentru a obține un pachet perfect echilibrat.',
          descriptionEn: 'The favourite box of every customer who craves “old-fashioned” cakes. We used my family’s recipes from Maramureș and adapted them with professional techniques and premium ingredients for a perfectly balanced box.',
          variants: [
            {
              name: 'Cutia 1',
              nameEn: 'Box 1',
              weight: '1,08 kg',
              pieces: 32,
              price: 169,
              contents: ['8 choux cu vanilie', '6 Doboș', '6 Albinița', '6 Albă-ca-zăpada', '6 nuci cu ciocolată'],
              contentsEn: ['8 vanilla choux', '6 Dobos cakes', '6 Albinița honey cakes', '6 Albă-ca-zăpada (Snow White) cakes', '6 walnut cookies with chocolate'],
            },
            {
              name: 'Cutia 2',
              nameEn: 'Box 2',
              weight: '1,34 kg',
              pieces: 41,
              price: 209,
              contents: ['8 choux cu vanilie', '7 Doboș', '7 Albinița', '7 Albă-ca-zăpada', '12 nuci cu ciocolată'],
              contentsEn: ['8 vanilla choux', '7 Dobos cakes', '7 Albinița honey cakes', '7 Albă-ca-zăpada (Snow White) cakes', '12 walnut cookies with chocolate'],
            },
          ],
        },
        {
          id: 'cutia-colindatorilor',
          name: 'Cutia colindătorilor',
          nameEn: 'The carolers’ box',
          image: 'cutia-colindatorilor',
          description: 'Acest asortiment e potrivit pentru a-ți încânta musafirii cu o selecție delicioasă de prăjituri făcute artizanal cu ingrediente de calitate la noi în laborator.',
          descriptionEn: 'An assortment to delight your guests: a delicious selection of cakes, handmade from quality ingredients in our lab.',
          weight: '1,22 kg',
          pieces: 41,
          price: 189,
          contents: ['6 crinkle cookies', '11 linzere cu magiun de prune', '8 bucăți de ciocolată de casă', '8 brownie', '8 madeleine cu portocale'],
          contentsEn: ['6 crinkle cookies', '11 linzer cookies with plum jam', '8 pieces of homemade chocolate', '8 brownies', '8 orange madeleines'],
        },
        {
          id: 'cutia-aia',
          name: 'Cutia „Aia”',
          nameEn: 'The “Aia” box',
          image: 'cutia-aia',
          description: 'Știm cum e când ai musafiri de seamă și nu mai știi cu ce să îi impresionezi, așa că am pregătit Cutia „Aia” pentru musafirii „Ăia”…',
          descriptionEn: 'We know how it is when important guests are coming and you have run out of ways to impress them, so we made “that” box (Cutia „Aia”) for “those” guests…',
          weight: '420 g',
          pieces: 16,
          price: 99,
          contents: ['4 Doboș', '4 macarons cu ciocolată cu lapte și alune', '4 mousse de ciocolată cu vișine și tonka', '4 madeleine cu portocale, ciocolată albă și fistic'],
          contentsEn: ['4 Dobos cakes', '4 milk chocolate and hazelnut macarons', '4 chocolate mousse cakes with sour cherries and tonka', '4 madeleines with orange, white chocolate and pistachio'],
        },
        {
          id: 'turn-de-madeleine',
          name: 'Turn de madeleine',
          nameEn: 'Madeleine tower',
          image: 'turn-de-madeleine',
          description: 'Orice masă festivă are nevoie de un centerpiece, așa că am pregătit un aranjament de madeleine care să fure toate privirile: madeleine cu aromă de portocale, acoperite cu ciocolată albă Callebaut.',
          descriptionEn: 'Every festive table needs a centrepiece, so we made a madeleine arrangement that steals the show: orange madeleines covered in Callebaut white chocolate.',
          weight: '450 g',
          price: 95,
        },
      ],
    },
    {
      id: 'babka',
      title: 'Cozonac babka și cozonaci',
      titleEn: 'Babka and cozonac',
      nav: 'Babka și cozonaci',
      navEn: 'Babka and cozonac',
      intro: 'Aluat cu unt și ouă, dospit lent și împletit cu cremă de nucă, mac, ciocolată sau fistic. Cozonacul babka este cozonacul nostru de sărbători, iar pentru cei care țin la tradiție avem și cozonac clasic cu mac sau nucă.',
      introEn: 'Butter and egg dough, slowly proofed and braided with walnut, poppy seed, chocolate or pistachio cream. Babka is our holiday sweet bread, and for those who keep to tradition we also have the classic Romanian cozonac with poppy seeds or walnuts.',
      items: [
        { id: 'babka-cu-mac', name: 'Babka cu mac', nameEn: 'Poppy seed babka', image: 'babka-cu-mac', weight: '700 g', price: 80 },
        { id: 'babka-cu-nuca', name: 'Babka cu nucă', nameEn: 'Walnut babka', image: 'babka-cu-nuca', weight: '700 g', price: 80 },
        { id: 'babka-cu-ciocolata', name: 'Babka cu ciocolată', nameEn: 'Chocolate babka', image: 'babka-cu-ciocolata', weight: '700 g', price: 80 },
        { id: 'babka-cu-fistic', name: 'Babka cu fistic', nameEn: 'Pistachio babka', image: 'babka-cu-fistic', weight: '700 g', price: 100 },
        { id: 'cozonac-cu-mac-sau-nuca', name: 'Cozonac cu mac sau nucă', nameEn: 'Cozonac with poppy seeds or walnuts', image: 'cozonac-cu-mac-sau-nuca', weight: '1 kg', price: 120 },
        { id: 'mini-babka-cu-ciocolata', name: 'Mini babka cu ciocolată', nameEn: 'Mini chocolate babka', image: 'mini-babka-cu-ciocolata', weight: '150 g', price: 20 },
      ],
    },
    {
      id: 'la-gramaj',
      title: 'Fursecuri și prăjituri la gramaj',
      titleEn: 'Cookies and cakes by weight',
      nav: 'La gramaj',
      navEn: 'By weight',
      intro: 'Ambalate individual, în pachete de 100 g, 500 g sau 1 kg din fiecare. Prețul afișat este pentru 100 g.',
      introEn: 'Individually packed, in packs of 100 g, 500 g or 1 kg of each. The price shown is per 100 g.',
      items: [
        { id: 'linzere-cu-magiun-de-prune', name: 'Linzere cu magiun de prune', nameEn: 'Linzer cookies with plum jam', image: 'linzere-cu-magiun-de-prune', price: 18, per: '100 g' },
        { id: 'nuci-cu-crema-de-ciocolata', name: 'Nuci cu cremă de ciocolată', nameEn: 'Walnut cookies with chocolate cream', image: 'nuci-cu-crema-de-ciocolata', price: 17, per: '100 g' },
        { id: 'brownie-cu-peanut-butter', name: 'Brownie cu peanut butter', nameEn: 'Peanut butter brownie', image: 'brownie-cu-peanut-butter', price: 17, per: '100 g' },
        { id: 'cosulete-cu-magiun-de-prune', name: 'Coșulețe cu magiun de prune', nameEn: 'Plum jam tartlets', image: 'cosulete-cu-magiun-de-prune', price: 16, per: '100 g' },
        { id: 'ciocolata-de-casa-cu-migdale', name: 'Ciocolată de casă cu fulgi de migdale', nameEn: 'Homemade chocolate with almond flakes', image: 'ciocolata-de-casa-cu-migdale', price: 16, per: '100 g' },
        { id: 'madeleine-asortate', name: 'Madeleine asortate', nameEn: 'Assorted madeleines', image: 'madeleine-asortate', price: 15, per: '100 g' },
        { id: 'crinkle-cookies', name: 'Crinkle cookies', image: 'crinkle-cookies', price: 14, per: '100 g' },
        { id: 'saratele', name: 'Sărățele', nameEn: 'Savoury cheese crackers', image: 'saratele', price: 14, per: '100 g' },
        { id: 'macarons-ciocolata-cu-lapte-si-alune', name: 'Macarons cu ganache de ciocolată cu lapte și alune', nameEn: 'Macarons with milk chocolate and hazelnut ganache', image: 'macarons-ciocolata-cu-lapte-si-alune', price: 8, per: 'buc', perEn: 'pc' },
      ],
    },
    {
      id: 'camara',
      title: 'Pentru cămară și cadouri',
      titleEn: 'For the pantry and as gifts',
      nav: 'Cămară și cadouri',
      navEn: 'Pantry and gifts',
      intro: 'Mici bucurii de iarnă, bune de pus lângă o cutie de prăjituri.',
      introEn: 'Little winter treats, just right next to a box of cakes.',
      items: [
        { id: 'condimente-pentru-vin-fiert', name: 'Condimente pentru vin fiert', nameEn: 'Mulled wine spices', image: 'condimente-pentru-vin-fiert', price: 20, per: '100 g' },
        { id: 'caramel-sarat', name: 'Caramel sărat la borcan', nameEn: 'Salted caramel in a jar', image: 'caramel-sarat', weight: '212 ml', price: 19 },
        { id: 'magiun-de-prune', name: 'Magiun de prune', nameEn: 'Plum jam (magiun)', image: 'magiun-de-prune', weight: '400 g', price: 22 },
      ],
    },
  ],
};

/** Every product and box variant on the page, flattened (for the structured data and tests) */
export const christmasItems = () => christmas.sections.flatMap((s) => s.items);

/** A text in the chosen language: the English field (`nameEn`) when there is one, else the Romanian (`name`) */
export const tr = (obj, key, language) => (language === 'en' && obj[`${key}En`]) || obj[key];
