// Olala Sweets SRL's food waste reduction plan (Legea nr. 217/2016, HG nr. 51/2019), as
// signed on 24 March 2026, for the website's /risipa-alimentara page. Section 9.2 of the
// plan commits to publishing it, and the annual reports, on the company's website.
// Each year: replace the period, the dates and any changed measures with the new plan.

export const foodWastePlan = {
  title: 'Plan de diminuare a risipei alimentare',
  legalBasis: 'conform Legii nr. 217/2016 și HG nr. 51/2019',
  period: 'Perioada de raportare: 1 ianuarie – 31 decembrie 2026',
  drawnUp: 'Întocmit în martie 2026',

  // Section 8: what happens to products close to their expiry date, in order of priority
  hierarchy: [
    { measure: 'Prevenire (planificare)', how: 'Producție la comandă, planificare săptămânală, FIFO' },
    { measure: 'Vânzare cu preț redus', how: 'Comercializarea produselor aproape de expirare la preț redus, prin canale proprii și aplicația Bonapp' },
    { measure: 'Transfer gratuit pentru consum uman', how: 'Donarea către operatori receptori înscriși în lista MADR sau angajați' },
    { measure: 'Utilizare în hrana animalelor', how: 'Direcționarea produselor neperisabile care nu pot fi consumate de oameni' },
    { measure: 'Compostare', how: 'Direcționarea deșeurilor organice către compostare' },
  ],

  identification: [
    ['Denumire operator economic', 'OLALA SWEETS S.R.L.'],
    ['Cod unic de înregistrare (CUI)', '52083122'],
    ['Nr. înregistrare Registrul Comerțului', 'J2025048164006'],
    ['Sediu social', 'Petuniei nr. 5, Cluj-Napoca, România'],
    ['Punct de lucru (laborator)', 'Câmpului 133, Cluj-Napoca, România'],
    ['Cod CAEN principal', '1071 – Fabricarea pâinii; fabricarea produselor proaspete de patiserie'],
    ['Cod CAEN secundar', '1072 – Fabricarea biscuiților și pișcoturilor; fabricarea prăjiturilor și a produselor de patiserie conservate'],
    ['Reprezentant legal', 'Cormos Codruta'],
    ['Persoană responsabilă risipă alimentară', 'Cormos Codruta'],
    ['Număr mediu de angajați', '1'],
    ['Categorie întreprindere', 'Microîntreprindere / Întreprindere mică'],
  ],

  activity: [
    'OLALA SWEETS este un laborator de cofetărie care produce și comercializează produse de patiserie și cofetărie artizanală: torturi personalizate, monoporții, prăjituri, choux, madeline, tartlete, babă și alte specialități de cofetărie fină.',
    'Produsele sunt realizate exclusiv la comandă sau în serii mici, cu ingrediente premium, și sunt livrate direct către consumatorii finali. Nu se utilizează platforme terțe de livrare.',
    'Activitatea se desfășoară într-un laborator autorizat sanitar-veterinar, cu respectarea normelor HACCP și a legislației în vigoare privind siguranța alimentară.',
  ],

  legalFramework: [
    'Legea nr. 217/2016 privind diminuarea risipei alimentare, cu modificările și completările ulterioare',
    'HG nr. 51/2019 pentru aprobarea Normelor metodologice de aplicare a Legii nr. 217/2016',
    'Regulamentul (CE) nr. 178/2002 privind principiile și cerințele generale ale legislației alimentare',
    'Regulamentul (CE) nr. 852/2004 privind igiena produselor alimentare',
  ],

  measures: [
    {
      code: 'H_A',
      title: 'Planificarea și utilizarea eficientă a resurselor',
      objective: 'Implementarea unui sistem de planificare a producției care să minimizeze pierderile de materii prime și produse finite, prin corelarea strictă a cantităților produse cu cererea reală.',
      listTitle: 'Măsuri concrete implementate',
      items: [
        ['Producție exclusiv la comandă', 'Torturile personalizate, monoporțiile și comenzile speciale sunt realizate strict pe baza comenzilor confirmate, eliminând riscul de supraproducție.'],
        ['Planificarea săptămânală a producției', 'Se întocmește un plan de producție săptămânal bazat pe comenzile primite, sezonalitate și istoricul vânzărilor, asigurând aprovizionarea optimă cu materii prime.'],
        ['Gestionarea rețetelor standardizate', 'Utilizarea de rețete precise cu gramaje fixe pentru fiecare produs, minimizând risipa prin porționare exactă.'],
        ['Sistem de monitorizare a consumului de materii prime', 'Se utilizează un sistem de evidență (registru Excel) pentru înregistrarea consumului zilnic de materii prime, corelația cu producția realizată și identificarea eventualelor pierderi.'],
        ['Aprovizionare calibrată', 'Achiziționarea de materii prime se face în cantități corelate cu planul de producție, evitând stocurile excesive care ar putea duce la expirarea produselor.'],
      ],
      extraTitle: 'Indicatori de monitorizare',
      extra: [
        'Cantitatea de materii prime achiziționate vs. cantitatea utilizată (lunar)',
        'Numărul de produse finite neutilizate/eliminate (lunar)',
        'Procentul de pierderi raportat la volumul total de producție',
      ],
    },
    {
      code: 'H_B',
      title: 'Comunicarea internă cu angajații',
      objective: 'Realizarea a minimum o comunicare anuală internă cu angajații privind obiectivul de reducere a risipei alimentare, în conformitate cu art. 2 alin. (4) lit. b) din Legea nr. 217/2016.',
      listTitle: 'Acțiuni planificate',
      items: [
        ['Ședință anuală de instruire', 'Se organizează anual (trimestrul I) o ședință de instruire internă cu toți angajații, având ca tematică: importanța reducerii risipei alimentare; obligațiile legale ale operatorului economic; bune practici de manipulare și depozitare a materiilor prime; procedura FIFO și verificarea termenelor de valabilitate; măsuri specifice aplicate în laboratorul de cofetărie.'],
        ['Proces-verbal de instruire', 'Fiecare ședință de instruire este documentată printr-un proces-verbal semnat de toți participanții, care se arhivează pe o perioadă de minimum 3 ani.'],
        ['Afișarea instrucțiunilor', 'Se afișează în zona de producție instrucțiuni vizuale privind regulile FIFO, depozitarea corectă și etichetarea produselor.'],
      ],
      extraTitle: 'Dovezi de conformitate',
      extra: [
        'Proces-verbal de instruire semnat de angajați',
        'Listă de prezență la ședința de instruire',
        'Fotografii ale instrucțiunilor afișate în zona de producție',
      ],
    },
    {
      code: 'H_C',
      title: 'Sistemul FIFO de monitorizare a stocurilor',
      objective: 'Implementarea și menținerea unui sistem de gestionare a stocurilor de materii prime și produse finite bazat pe principiul FIFO („Primul intrat – Primul ieșit”), pentru a preveni expirarea și degradarea alimentelor.',
      listTitle: 'Procedura FIFO implementată',
      items: [
        ['Recepția materiilor prime', 'La recepție, fiecare lot de materie primă este înregistrat în sistemul de evidență cu: denumirea produsului, cantitatea recepționată, data recepției, data-limită de consum / data durabilității minimale, furnizorul.'],
        ['Etichetarea și organizarea depozitării', 'Materiile prime sunt depozitate conform principiului FIFO: produsele cu termenul de valabilitate cel mai apropiat sunt plasate în față, cele noi în spate. Se utilizează etichete cu data recepției și data expirării.'],
        ['Verificarea periodică a stocurilor', 'Se efectuează verificarea săptămânală a stocurilor pentru identificarea produselor aproape de expirare. Produsele identificate sunt prioritizate pentru utilizare sau, după caz, se aplică măsurile ierarhice prevăzute de lege.'],
        ['Sistem de alertă pentru termenele de valabilitate', 'Sistemul de evidență electronică (Excel) conține alerte automate pentru materiile prime care se apropie de data expirării (cu 7 zile înainte), permițând luarea măsurilor preventive.'],
      ],
      tableTitle: 'Categorii de materii prime monitorizate',
      tableHead: ['Categorie materie primă', 'Condiții de depozitare', 'Frecvență verificare FIFO'],
      table: [
        ['Lactate (unt, smântână, brânză)', 'Frigider 2-6°C', 'Zilnic'],
        ['Ouă proaspete', 'Frigider 2-6°C', 'Zilnic'],
        ['Ciocolată, couverture', 'Loc uscat, 15-18°C', 'Săptămânal'],
        ['Făină, zahăr, amidon', 'Loc uscat, temperatura ambiantă', 'Săptămânal'],
        ['Fructe proaspete', 'Frigider 2-6°C', 'Zilnic'],
        ['Fructe congelate, piureuri', 'Congelator -18°C', 'Săptămânal'],
        ['Nuci, alune, migdale', 'Loc uscat, recipient închis', 'Săptămânal'],
        ['Arome, extracte, gelatină', 'Loc uscat, temperatura ambiantă', 'Lunar'],
      ],
    },
    {
      code: 'H_E',
      title: 'Facilitarea preluării alimentelor neconsumate',
      objective: 'Facilitarea posibilității consumatorilor finali de a prelua, fără costuri suplimentare și în condiții corespunzătoare de ambalare, alimentele pe care nu le-au consumat, în conformitate cu art. 2 alin. (4) lit. e) din Legea nr. 217/2016.',
      intro: 'Având în vedere că OLALA SWEETS operează ca laborator de cofetărie cu vânzare la comandă și livrare directă, iar nu ca unitate cu servire la masă, această măsură se aplică în contextul specific al activității:',
      listTitle: 'Aplicabilitate și context',
      items: [
        ['Ambalare corespunzătoare la livrare', 'Toate produsele sunt livrate în ambalaje adecvate (cutii alimentare, doze sigilate, pungi alimentare) care asigură păstrarea în condiții optime și permit consumatorului transportul și depozitarea corectă a produselor neconsumate.'],
        ['Informarea consumatorului', 'Pe fiecare produs livrat sau pe documentul însoțitor se menționează condițiile optime de păstrare (temperatură, termen de consum recomandat după deschidere), permițând consumatorului să ia decizii informate despre consumul produselor.'],
        ['Ambalaje suplimentare gratuite', 'În cazul evenimentelor (nunți, botezuri, aniversări) unde se livrează cantități mari, se pun la dispoziția consumatorilor, fără costuri suplimentare, cutii sau pungi alimentare pentru porțiile neconsumate.'],
      ],
      extraTitle: 'Informarea privind consumul responsabil',
      extraIntro: 'OLALA SWEETS informează consumatorii despre practicile de consum responsabil prin:',
      extra: [
        'Indicații de păstrare pe eticheta fiecărui produs (temperatură, termen de consum)',
        'Recomandări privind porționarea optimă la momentul comenzii, pentru a evita comenzile supradimensionate',
        'Comunicarea pe canalele proprii (Instagram, Facebook) a bunelor practici de păstrare a produselor de cofetărie',
      ],
    },
  ],

  reporting: {
    annual: {
      intro: 'OLALA SWEETS se angajează să întocmească și să depună anual, până la data de 31 martie, următoarele documente:',
      items: [
        'Planul anual de diminuare a risipei alimentare (prezentul document)',
        'Raportul anual privind cantitatea alimentelor care au făcut obiectul transferului cu titlu gratuit (Anexa 1 / Anexa 2 din Norme, după caz)',
      ],
    },
    publication: 'Planul de diminuare și rapoartele anuale se publică pe pagina de internet proprie a companiei, în conformitate cu obligația legală aplicabilă tuturor operatorilor economici, inclusiv microîntreprinderilor.',
    archiving: 'Toate documentele aferente transferului cu titlu gratuit (tipul produsului, cantitatea, data redistribuirii, numărul de consumatori finali) se păstrează pe o perioadă de minimum 3 ani, conform legislației în vigoare.',
  },

  signedBy: { name: 'Cormos Codruta', role: 'Administrator', date: '24.03.2026' },
};
