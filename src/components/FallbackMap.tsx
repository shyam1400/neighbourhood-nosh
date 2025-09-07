import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  rating: number;
  deliveryTime: string;
  distance: string;
}

interface FallbackMapProps {
  stores: Store[];
  userLocation?: { lat: number; lng: number };
  onStoreSelect?: (store: Store) => void;
  selectedStoreId?: string;
}

const FallbackMap: React.FC<FallbackMapProps> = ({ 
  stores, 
  userLocation, 
  onStoreSelect, 
  selectedStoreId 
}) => {
  return (
    <div className="space-y-4">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Store Locations</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Interactive map unavailable</span>
        </div>
      </div>

      {/* Fallback Map Display */}
      <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-lg border-2 border-dashed border-purple-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Store Locations</h4>
          <p className="text-sm text-gray-600">Showing {stores.length} stores in your area</p>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedStoreId === store.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
              }`}
              onClick={() => onStoreSelect?.(store)}
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-semibold text-gray-900">{store.name}</h5>
                <div className={`w-3 h-3 rounded-full ${
                  store.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{store.address}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>⭐ {store.rating}</span>
                <span>⏱️ {store.deliveryTime}</span>
                <span>📍 {store.distance}</span>
              </div>
            </div>
          ))}
        </div>

        {/* User Location Info */}
        {userLocation && (
          <div className="mt-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="flex items-center gap-2 text-sm text-cyan-700">
              <div className="w-3 h-3 bg-cyan-500 rounded-full" />
              <span>Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FallbackMap;
