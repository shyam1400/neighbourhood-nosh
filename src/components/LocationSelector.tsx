import React, { useState } from 'react';
import { MapPin, Search, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationSelectorProps {
  currentLocation?: Location;
  onLocationSelect: (location: Location) => void;
  userType: 'customer' | 'vendor' | 'delivery';
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  currentLocation, 
  onLocationSelect, 
  userType 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const popularLocations: Location[] = [
    {
      id: '1',
      name: 'Koramangala',
      address: 'Koramangala, Bangalore',
      city: 'Bangalore',
      pincode: '560034',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    {
      id: '2',
      name: 'Indiranagar',
      address: 'Indiranagar, Bangalore',
      city: 'Bangalore',
      pincode: '560038',
      coordinates: { lat: 12.9716, lng: 77.6412 }
    },
    {
      id: '3',
      name: 'Brigade Road',
      address: 'Brigade Road, Bangalore',
      city: 'Bangalore',
      pincode: '560001',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: '4',
      name: 'Whitefield',
      address: 'Whitefield, Bangalore',
      city: 'Bangalore',
      pincode: '560066',
      coordinates: { lat: 12.9698, lng: 77.7500 }
    },
    {
      id: '5',
      name: 'Electronic City',
      address: 'Electronic City, Bangalore',
      city: 'Bangalore',
      pincode: '560100',
      coordinates: { lat: 12.8456, lng: 77.6603 }
    },
    {
      id: '6',
      name: 'Marathahalli',
      address: 'Marathahalli, Bangalore',
      city: 'Bangalore',
      pincode: '560037',
      coordinates: { lat: 12.9581, lng: 77.6974 }
    }
  ];

  const filteredLocations = popularLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.pincode.includes(searchQuery)
  );

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    setIsOpen(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            id: 'current',
            name: 'Current Location',
            address: 'Your current location',
            city: 'Bangalore',
            pincode: '000000',
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          };
          handleLocationSelect(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">
            {currentLocation ? currentLocation.name : 'Select Location'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Choose Your {userType === 'customer' ? 'Delivery' : userType === 'vendor' ? 'Store' : 'Service'} Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for area, pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Location Button */}
          <Button
            variant="outline"
            onClick={getCurrentLocation}
            className="w-full flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Use Current Location
          </Button>

          {/* Popular Locations */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Popular Locations</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    currentLocation?.id === location.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-gray-900">{location.name}</h5>
                          {currentLocation?.id === location.id && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{location.address}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {location.pincode}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Service Areas Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Service Areas:</strong> We currently deliver to Bangalore and surrounding areas. 
              More cities coming soon!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
