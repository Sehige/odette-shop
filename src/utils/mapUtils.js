/**
 * Utility functions for Google Maps integration
 */

/**
 * Generates a Google Maps URL for Odette Confiserie location
 * Links directly to the verified business location instead of searching
 * @param {string} address - The address (unused, kept for compatibility)
 * @returns {string} Google Maps URL to Odette Confiserie
 */
export const getGoogleMapsUrl = (address) => {
  // Direct link to Odette Confiserie using place ID for accuracy
  return 'https://www.google.com/maps/place/Odette+Confiserie/@46.7522883,23.5627343,17z/data=!3m1!4b1!4m6!3m5!1s0x47490fd8f596e72d:0x24d942d85c2bb064!8m2!3d46.7522847!4d23.5653092!16s%2Fg%2F11ym1fyc0q?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D';
};
