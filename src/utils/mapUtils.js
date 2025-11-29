/**
 * Utility functions for Google Maps integration
 */

/**
 * Generates a Google Maps search URL for a given address
 * @param {string} address - The address to search for
 * @returns {string} Google Maps search URL
 */
export const getGoogleMapsUrl = (address) => {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};
