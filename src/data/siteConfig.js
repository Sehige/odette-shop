// Site Configuration
// This file contains static, non-translatable data that is reused across the application
// such as contact information, social media links, and other constants

export const siteConfig = {
  // Contact Information
  contact: {
    phone: '+40 756 157 067',
    email: 'odette.confiserie@gmail.com',
    address: {
      ro: 'Strada Câmpului 133, Cluj-Napoca, România',
      en: '133 Câmpului Street, Cluj-Napoca, Romania'
    }
  },

  // Social Media Links
  social: {
    instagram: 'https://www.instagram.com/odette.confiserie/',
    facebook: 'https://www.facebook.com/profile.php?id=61581913980330',
    tiktok: 'https://www.tiktok.com/'
  },

  // Business Hours (bilingual because format differs by language)
  hours: {
    ro: 'Luni - Vineri: 9:00 - 19:00\nSâmbătă: 8:00 - 12:00\nDuminică: Închis',
    en: 'Monday - Friday: 9:00 - 19:00\nSaturday: 8:00 - 12:00\nSunday: Closed'
  },

  // Delivery Settings
  delivery: {
    fee: 15,
    freeThreshold: 200,
    timeSlots: ['9:00 - 12:00', '12:00 - 17:00', '17:00 - 20:00']
  },

  // Google Maps Embed URL - Odette Confiserie, Cluj-Napoca
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d170.4536976935056!2d23.565146099999998!3d46.752516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490fd8f596e72d%3A0x24d942d85c2bb064!2sOdette%20Confiserie!5e0!3m2!1sen!2sro!4v1732992000000!5m2!1sen!2sro',

  // Company Legal Information
  company: {
    legalName: 'Olala Sweets SRL',
    cui: '52083122',
    // Registered office same as contact address
    registeredOffice: {
      ro: 'Strada Câmpului 133, Cluj-Napoca, România',
      en: '133 Câmpului Street, Cluj-Napoca, Romania'
    }
  }
};
