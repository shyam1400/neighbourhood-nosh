import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GoogleMap from './GoogleMap';
import GoogleMapsLoader from './GoogleMapsLoader';

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  deliveryTime: string;
  distance: string;
  isOpen: boolean;
}

interface MapViewProps {
  stores: Store[];
  userLocation?: { lat: number; lng: number };
  onStoreSelect?: (store: Store) => void;
  selectedStoreId?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  stores, 
  userLocation, 
  onStoreSelect, 
  selectedStoreId 
}) => {
  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 12.9716, lng: 77.5946 });

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(location);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Prepare markers for the map
  const mapMarkers = stores.map(store => ({
    position: { lat: store.latitude, lng: store.longitude },
    title: store.name,
    icon: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="${store.isOpen ? '#10B981' : '#EF4444'}" stroke="white" stroke-width="2"/>
        <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${store.isOpen ? '✓' : '✗'}</text>
      </svg>
    `)}`,
    onClick: () => {
      if (onStoreSelect) {
        onStoreSelect(store);
      }
    }
  }));

  // Add user location marker if available
  if (userLocation) {
    mapMarkers.push({
      position: userLocation,
      title: 'Your Location',
      icon: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
          <circle cx="15" cy="15" r="6" fill="white"/>
        </svg>
      `)}`,
      onClick: () => {}
    });
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Store Locations</h3>
        <Button onClick={getCurrentLocation} size="sm" variant="outline">
          <Navigation className="w-4 h-4 mr-2" />
          My Location
        </Button>
      </div>

      {/* Map Container */}
      <Card>
        <CardContent className="p-0">
          <GoogleMapsLoader>
            <GoogleMap
              center={mapCenter}
              zoom={13}
              markers={mapMarkers}
              className="w-full h-96 rounded-lg"
            />
          </GoogleMapsLoader>
        </CardContent>
      </Card>

      {/* Store List */}
      <div className="space-y-2">
        {stores.map((store) => (
          <Card 
            key={store.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedStoreId === store.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onStoreSelect?.(store)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{store.name}</h4>
                    <p className="text-sm text-gray-600">{store.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{store.rating}</span>
                    <Badge variant={store.isOpen ? "default" : "secondary"} className="text-xs">
                      {store.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{store.deliveryTime}</span>
                  </div>
                  <p className="text-xs text-gray-500">{store.distance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MapView;
