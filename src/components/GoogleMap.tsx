import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    icon?: string;
    onClick?: () => void;
  }>;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  className?: string;
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom = 13, 
  markers = [], 
  onMapClick,
  className = "w-full h-96" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps API not loaded');
      return;
    }

    if (!mapRef.current) return;

    // Initialize map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(mapInstance);

    // Add click listener if provided
    if (onMapClick) {
      mapInstance.addListener('click', onMapClick);
    }

    return () => {
      // Cleanup
      if (mapInstance) {
        window.google.maps.event.clearInstanceListeners(mapInstance);
      }
    };
  }, [center, zoom, onMapClick]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add new markers
    markers.forEach(markerData => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        icon: markerData.icon
      });

      if (markerData.onClick) {
        marker.addListener('click', markerData.onClick);
      }

      newMarkers.push(marker);
    });

    setMapMarkers(newMarkers);
  }, [map, markers]);

  return (
    <div 
      ref={mapRef} 
      className={className}
      style={{ minHeight: '300px' }}
    />
  );
};

export default GoogleMap;
