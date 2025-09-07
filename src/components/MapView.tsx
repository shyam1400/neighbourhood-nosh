import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Star, Search, Filter, List, Map as MapIcon, Maximize2, Minimize2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GoogleMap from './GoogleMap';
import GoogleMapsLoader from './GoogleMapsLoader';
import FallbackMap from './FallbackMap';
import { isMapsApiKeyConfigured } from '@/config/maps';

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
  showFilters?: boolean;
  showSearch?: boolean;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  stores, 
  userLocation, 
  onStoreSelect, 
  selectedStoreId,
  showFilters = true,
  showSearch = true,
  height = "h-96"
}) => {
  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 12.9716, lng: 77.5946 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'both'>('both');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filteredStores, setFilteredStores] = useState(stores);

  // Filter stores based on search and filters
  useEffect(() => {
    let filtered = stores;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(store => 
        filterStatus === 'open' ? store.isOpen : !store.isOpen
      );
    }

    // Rating filter
    if (filterRating !== 'all') {
      const minRating = parseFloat(filterRating);
      filtered = filtered.filter(store => store.rating >= minRating);
    }

    setFilteredStores(filtered);
  }, [stores, searchQuery, filterStatus, filterRating]);

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
  const mapMarkers = filteredStores.map(store => ({
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

  // If Google Maps API key is not configured, show fallback map
  if (!isMapsApiKeyConfigured()) {
    return <FallbackMap stores={filteredStores} userLocation={userLocation} onStoreSelect={onStoreSelect} selectedStoreId={selectedStoreId} />;
  }

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-white p-4" 
    : "space-y-4";

  return (
    <div className={containerClass}>
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Store Locations ({filteredStores.length})</h3>
          
          {/* Search and Filters */}
          {showSearch && (
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search stores or addresses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {showFilters && (
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      <SelectItem value="open">Open Now</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={getCurrentLocation} size="sm" variant="outline">
            <Navigation className="w-4 h-4 mr-2" />
            My Location
          </Button>
          
          <div className="flex border rounded-lg">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              onClick={() => setViewMode('map')}
              className="rounded-none"
            >
              <MapIcon className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'both' ? 'default' : 'ghost'}
              onClick={() => setViewMode('both')}
              className="rounded-l-none"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`grid gap-4 ${viewMode === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'both') && (
          <Card className={viewMode === 'map' ? 'col-span-1' : ''}>
            <CardContent className="p-0">
              <GoogleMapsLoader>
                <GoogleMap
                  center={mapCenter}
                  zoom={13}
                  markers={mapMarkers}
                  className={`w-full ${isFullscreen ? 'h-[calc(100vh-8rem)]' : height} rounded-lg`}
                />
              </GoogleMapsLoader>
            </CardContent>
          </Card>
        )}

        {/* Store List */}
        {(viewMode === 'list' || viewMode === 'both') && (
          <div className={`space-y-2 ${viewMode === 'list' ? 'col-span-1' : ''}`}>
            {filteredStores.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No stores found</h4>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredStores.map((store) => (
                <Card 
                  key={store.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedStoreId === store.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => onStoreSelect?.(store)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          store.isOpen ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <MapPin className={`w-5 h-5 ${
                            store.isOpen ? 'text-green-600' : 'text-red-600'
                          }`} />
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
                          <Badge 
                            variant={store.isOpen ? "default" : "secondary"} 
                            className={`text-xs ${
                              store.isOpen 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
