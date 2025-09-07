// Google Maps Configuration
export const MAPS_CONFIG = {
  // You can set your Google Maps API key here or use environment variable
  API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBWyuoB7URUWdh-ONWGmJGIY3gfw6RXtws',
  
  // Default map settings
  DEFAULT_CENTER: {
    lat: 12.9716, // Bangalore coordinates
    lng: 77.5946
  },
  DEFAULT_ZOOM: 13,
  
  // Map styles
  MAP_STYLES: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Check if API key is properly configured
export const isMapsApiKeyConfigured = () => {
  const apiKey = MAPS_CONFIG.API_KEY;
  console.log('Maps API Key:', apiKey); // Debug log
  return apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;
};
