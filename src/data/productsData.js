import {
  CAKE_IMAGE,
  ECLAIR_IMAGE,
  MACARON_IMAGE,
  RED_VELVET_IMAGE,
  CROISSANT_IMAGE,
  BERRY_TART_IMAGE,
  HERO_IMAGE
} from './imageConstants';

export const productsData = [
  {
    id: 1,
    name: { ro: 'Tort Ciocolată Premium', en: 'Premium Chocolate Cake' },
    category: 'cakes',
    description: {
      ro: 'Tort cu ciocolată belgiană, cremă fină și glazură lucioasă',
      en: 'Cake with Belgian chocolate, fine cream and glossy glaze'
    },
    price: 180,
    image: CAKE_IMAGE,
    sizes: ['1kg', '1.5kg', '2kg'],
    flavors: { ro: ['Ciocolată', 'Ciocolată cu Vișine'], en: ['Chocolate', 'Chocolate Cherry'] },
    ingredients: {
      ro: 'Ciocolată belgiană, făină, ou, zahăr, unt, cremă de lapte',
      en: 'Belgian chocolate, flour, eggs, sugar, butter, cream'
    },
    allergens: { ro: 'Gluten, ouă, lactate', en: 'Gluten, eggs, dairy' },
    bestseller: true,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 2,
    name: { ro: 'Ecler Vanilie', en: 'Vanilla Eclair' },
    category: 'pastries',
    description: {
      ro: 'Ecler clasic cu cremă de vanilie Madagascar și glazură de ciocolată',
      en: 'Classic eclair with Madagascar vanilla cream and chocolate glaze'
    },
    price: 15,
    image: ECLAIR_IMAGE,
    flavors: { ro: ['Vanilie', 'Caramel', 'Cafea'], en: ['Vanilla', 'Caramel', 'Coffee'] },
    ingredients: {
      ro: 'Făină, ou, unt, lapte, vanilie Madagascar, ciocolată',
      en: 'Flour, eggs, butter, milk, Madagascar vanilla, chocolate'
    },
    allergens: { ro: 'Gluten, ouă, lactate', en: 'Gluten, eggs, dairy' },
    bestseller: true,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 3,
    name: { ro: 'Macarons Asortate', en: 'Assorted Macarons' },
    category: 'cookies',
    description: {
      ro: 'Set de 6 macarons în arome variate: zmeură, ciocolată, vanilie',
      en: 'Set of 6 macarons in various flavors: raspberry, chocolate, vanilla'
    },
    price: 35,
    image: MACARON_IMAGE,
    flavors: { ro: ['Mix Clasic', 'Mix Exotic'], en: ['Classic Mix', 'Exotic Mix'] },
    ingredients: {
      ro: 'Migdale, albuș, zahăr, coloranți naturali',
      en: 'Almonds, egg white, sugar, natural colorants'
    },
    allergens: { ro: 'Migdale, ouă', en: 'Almonds, eggs' },
    bestseller: true,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 4,
    name: { ro: 'Tort Red Velvet', en: 'Red Velvet Cake' },
    category: 'cakes',
    description: { 
      ro: 'Tort catifea roșie cu cremă de brânză Philadelphia',
      en: 'Red velvet cake with Philadelphia cream cheese frosting'
    },
    price: 190,
    image: RED_VELVET_IMAGE,
    sizes: ['1kg', '1.5kg', '2kg'],
    bestseller: false,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 5,
    name: { ro: 'Croissant Unt', en: 'Butter Croissant' },
    category: 'pastries',
    description: {
      ro: 'Croissant franțuzesc cu unt de Normandia, crocant și aromat',
      en: 'French croissant with Normandy butter, crispy and aromatic'
    },
    price: 12,
    image: CROISSANT_IMAGE,
    bestseller: false,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 6,
    name: { ro: 'Tarta Fructe de Pădure', en: 'Berry Tart' },
    category: 'cakes',
    description: { 
      ro: 'Tartă cu cremă de vanilie și fructe proaspete de sezon',
      en: 'Tart with vanilla cream and fresh seasonal berries'
    },
    price: 45,
    image: BERRY_TART_IMAGE,
    bestseller: true,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 7,
    name: { ro: 'Tort Nuntă Elegant', en: 'Elegant Wedding Cake' },
    category: 'cakes',
    description: { 
      ro: 'Tort personalizat pentru nunți, design elegant cu flori naturale',
      en: 'Custom wedding cake, elegant design with fresh flowers'
    },
    price: 450,
    image: HERO_IMAGE,
    sizes: ['2kg', '3kg', '4kg', '5kg'],
    bestseller: false,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 8,
    name: { ro: 'Profiterole', en: 'Profiteroles' },
    category: 'pastries',
    description: { 
      ro: 'Gogoși franțuzești umplute cu cremă și acoperite cu ciocolată',
      en: 'French cream puffs filled with pastry cream and chocolate'
    },
    price: 18,
    image: ECLAIR_IMAGE,
    bestseller: false,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 9,
    name: { ro: 'Pain au Chocolat', en: 'Pain au Chocolat' },
    category: 'pastries',
    description: { 
      ro: 'Patiserie din aluat foietaj cu ciocolată belgiană',
      en: 'Puff pastry with Belgian chocolate'
    },
    price: 14,
    image: CROISSANT_IMAGE,
    bestseller: false,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 10,
    name: { ro: 'Cookie Vegan Ciocolată', en: 'Vegan Chocolate Cookie' },
    category: 'cookies',
    description: { 
      ro: 'Cookie vegan cu bucăți de ciocolată neagră, fără ingrediente animale',
      en: 'Vegan cookie with dark chocolate chips, no animal ingredients'
    },
    price: 8,
    image: MACARON_IMAGE,
    bestseller: false,
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 11,
    name: { ro: 'Tort Aniversar Personalizat', en: 'Custom Birthday Cake' },
    category: 'cakes',
    description: { 
      ro: 'Tort personalizat pentru aniversări cu mesaj și design la alegere',
      en: 'Custom birthday cake with message and design of choice'
    },
    price: 220,
    image: CAKE_IMAGE,
    sizes: ['1.5kg', '2kg', '3kg'],
    bestseller: true,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 12,
    name: { ro: 'Set Prăjituri Asortate', en: 'Assorted Pastries Set' },
    category: 'pastries',
    description: { 
      ro: 'Set de 12 prăjituri asortate - eclere, profiterole, mini tarte',
      en: 'Set of 12 assorted pastries - eclairs, profiteroles, mini tarts'
    },
    price: 85,
    image: ECLAIR_IMAGE,
    bestseller: true,
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 13,
    name: { ro: 'Tort Vegan Fructe', en: 'Vegan Fruit Cake' },
    category: 'cakes',
    description: { 
      ro: 'Tort 100% vegan cu fructe proaspete și cremă vegetală',
      en: '100% vegan cake with fresh fruits and plant-based cream'
    },
    price: 165,
    image: BERRY_TART_IMAGE,
    sizes: ['1kg', '1.5kg', '2kg'],
    bestseller: false,
    isVegetarian: true,
    isVegan: true
  }
];