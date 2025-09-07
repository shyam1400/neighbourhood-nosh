import React, { useEffect, useState } from 'react';
import { MAPS_CONFIG, isMapsApiKeyConfigured } from '@/config/maps';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    console.log('GoogleMapsLoader: Starting to load maps...');
    
    // Check if API key is configured
    if (!isMapsApiKeyConfigured()) {
      console.log('GoogleMapsLoader: API key not configured');
      setLoadError('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.');
      return;
    }
    
    console.log('GoogleMapsLoader: API key is configured, proceeding...');

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('GoogleMapsLoader: Google Maps already loaded');
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      console.log('GoogleMapsLoader: Script already exists, checking if loaded...');
      if (window.google && window.google.maps) {
        console.log('GoogleMapsLoader: Google Maps already loaded');
        setIsLoaded(true);
        return;
      }
      // Wait for existing script to load
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          console.log('GoogleMapsLoader: Existing script loaded');
          setIsLoaded(true);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Create callback function
    const callbackName = `initGoogleMaps_${Date.now()}`;
    (window as any)[callbackName] = () => {
      console.log('GoogleMapsLoader: Callback executed, maps loaded');
      setIsLoaded(true);
      delete (window as any)[callbackName];
    };

    // Create and load the script with callback
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_CONFIG.API_KEY}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    
    script.onerror = (error) => {
      console.error('GoogleMapsLoader: Script failed to load', error);
      setLoadError('Failed to load Google Maps API. Please check your API key and internet connection.');
      delete (window as any)[callbackName];
    };

    console.log('GoogleMapsLoader: Adding script to document head');
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if ((window as any)[callbackName]) {
        delete (window as any)[callbackName];
      }
    };
  }, []);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-lg border-2 border-dashed border-purple-200">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Maps Not Available</h3>
          <p className="text-sm text-gray-600 mb-4">{loadError}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>To enable maps functionality:</p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Get a Google Maps API key from Google Cloud Console</li>
              <li>Enable Maps JavaScript API and Places API</li>
              <li>Add VITE_GOOGLE_MAPS_API_KEY to your .env file</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;
