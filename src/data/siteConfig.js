// Site Configuration
// This file contains static, non-translatable data that is reused across the application
// such as contact information, social media links, and other constants

export const siteConfig = {
  // Contact Information
  contact: {
    phone: '+40 769 690 111',
    email: 'comenzi@odette.ro',
    address: {
      ro: 'Strada Câmpului 133, Cluj-Napoca, România',
      en: '133 Câmpului Street, Cluj-Napoca, Romania'
    }
  },

  // Social Media Links
  social: {
    instagram: 'https://www.instagram.com/odette.confiserie/',
    facebook: 'https://www.facebook.com/profile.php?id=61581913980330'
  },

  // Business Hours (bilingual because format differs by language)
  hours: {
    ro: 'Luni - Vineri: 9:00 - 18:00\nSâmbătă: 10:00 - 16:00\nDuminică: Închis',
    en: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed'
  },

  // Delivery Settings
  delivery: {
    fee: 15,
    freeThreshold: 200,
    timeSlots: ['9:00 - 12:00', '12:00 - 17:00', '17:00 - 20:00']
  },

  // Google Maps Embed URL
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d672.8753447668936!2d23.565536321524463!3d46.75195891545976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490e709572c49f%3A0x6b715e9d951f019!2sStrada%20C%C3%A2mpului%20133%2C%20Cluj-Napoca%20400394%2C%20Romania!5e0!3m2!1sen!2sro!4v1732634400000!5m2!1sen!2sro'
};
