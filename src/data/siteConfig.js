// Site Configuration
// The single source for the business's details (contact, address, opening hours, delivery,
// company data). The footer, contact page, homepage and the structured data for search
// engines (src/config/seoConfig.js, src/seo/schema.js) all read from here.

export const siteConfig = {
  name: 'Odette Confiserie',

  // Contact Information
  contact: {
    phone: '+40 756 157 067',
    // WhatsApp click-to-chat (wa.me wants the international number, digits only)
    whatsapp: '40756157067',
    email: 'odette.confiserie@gmail.com',
    address: {
      ro: 'Strada Câmpului 133, Cluj-Napoca, România',
      en: '133 Câmpului Street, Cluj-Napoca, Romania'
    },
    // The same address in parts, for structured data and map links
    postalAddress: {
      street: 'Strada Câmpului 133',
      city: 'Cluj-Napoca',
      postalCode: '400686',
      region: 'Cluj',
      country: 'RO'
    },
    geo: { latitude: 46.752273185339014, longitude: 23.56535278292503 }
  },

  // Social Media Links (add a TikTok profile here once it exists)
  social: {
    instagram: 'https://www.instagram.com/odette.confiserie/',
    facebook: 'https://www.facebook.com/profile.php?id=61581913980330'
  },

  // Weekly opening hours, local time (Europe/Bucharest), 24h "HH:MM".
  // 0 = Sunday ... 6 = Saturday; null = closed. Holidays and special hours are rows in
  // the Supabase table special_days (see supabase/sql/2026-10-05_special_days_and_fixes.sql).
  openingHours: {
    0: null,
    1: { open: '09:00', close: '19:00' },
    2: { open: '09:00', close: '19:00' },
    3: { open: '09:00', close: '19:00' },
    4: { open: '09:00', close: '19:00' },
    5: { open: '09:00', close: '19:00' },
    6: { open: '08:00', close: '12:00' }
  },

  // Delivery rules (lei): the single source for the product modal, the FAQ and the Terms page
  delivery: {
    feeCluj: 15,
    feeOutside: 25,
    freeThreshold: 250
  },

  maps: {
    // The business's Google listing (reviews, photos)
    placeUrl: 'https://www.google.com/maps/place/Odette+Confiserie/@46.7522883,23.5627343,17z/data=!3m1!4b1!4m6!3m5!1s0x47490fd8f596e72d:0x24d942d85c2bb064!8m2!3d46.7522847!4d23.5653092!16s%2Fg%2F11ym1fyc0q',
    // Optional Google Place ID (ChIJ...); with it, "Rute" opens the listing itself
    placeId: null,
    // Map shown on request on the contact page and the homepage (Google's own embed code)
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d170.4536976935056!2d23.565146099999998!3d46.752516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490fd8f596e72d%3A0x24d942d85c2bb064!2sOdette%20Confiserie!5e0!3m2!1sen!2sro!4v1732992000000!5m2!1sen!2sro'
  },

  // Company Legal Information (shown in the footer, as Legea 365/2002 requires)
  company: {
    legalName: 'Olala Sweets SRL',
    cui: '52083122',
    tradeRegister: 'J2025048164006',
    // Registered office same as contact address
    registeredOffice: {
      ro: 'Strada Câmpului 133, Cluj-Napoca, România',
      en: '133 Câmpului Street, Cluj-Napoca, Romania'
    }
  }
};
