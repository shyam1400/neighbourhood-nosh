import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Truck, CheckCircle, Navigation, Phone, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import MapView from './MapView';
import { isMapsApiKeyConfigured } from '@/config/maps';

interface DeliveryStatus {
  id: string;
  status: 'preparing' | 'picked_up' | 'on_route' | 'delivered';
  estimatedTime: string;
  currentLocation?: { lat: number; lng: number };
  deliveryPartner: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  orderDetails: {
    orderId: string;
    items: string[];
    total: number;
  };
}

interface DeliveryTrackingProps {
  orderId: string;
  onClose?: () => void;
}

const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ orderId, onClose }) => {
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Mock delivery status - in real app, this would come from API
  useEffect(() => {
    const mockDeliveryStatus: DeliveryStatus = {
      id: orderId,
      status: 'on_route',
      estimatedTime: '15-20 minutes',
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      deliveryPartner: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        vehicle: 'Bike - KA-01-AB-1234',
        rating: 4.8
      },
      orderDetails: {
        orderId: orderId,
        items: ['Fresh Vegetables', 'Milk', 'Bread'],
        total: 450
      }
    };
    setDeliveryStatus(mockDeliveryStatus);
  }, [orderId]);

  const deliverySteps = [
    { key: 'preparing', label: 'Preparing Order', icon: Clock },
    { key: 'picked_up', label: 'Picked Up', icon: Truck },
    { key: 'on_route', label: 'On Route', icon: Navigation },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const getStepIndex = (status: string) => {
    return deliverySteps.findIndex(step => step.key === status);
  };

  const getProgressPercentage = () => {
    if (!deliveryStatus) return 0;
    const currentIndex = getStepIndex(deliveryStatus.status);
    return ((currentIndex + 1) / deliverySteps.length) * 100;
  };

  if (!deliveryStatus) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Track Your Order</h2>
          <p className="text-gray-600">Order #{deliveryStatus.orderDetails.orderId}</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Delivery Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Delivery Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {deliverySteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= getStepIndex(deliveryStatus.status);
              const isCurrent = index === getStepIndex(deliveryStatus.status);

              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                    isActive
                      ? isCurrent
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-2 ${
                      isActive
                        ? isCurrent
                          ? 'text-purple-600'
                          : 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium text-center ${
                      isActive
                        ? isCurrent
                          ? 'text-purple-800'
                          : 'text-green-800'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800">Estimated Delivery Time</span>
            </div>
            <p className="text-purple-700">{deliveryStatus.estimatedTime}</p>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Partner Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Your Delivery Partner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold">{deliveryStatus.deliveryPartner.name}</h4>
                <p className="text-sm text-gray-600">{deliveryStatus.deliveryPartner.vehicle}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-medium">{deliveryStatus.deliveryPartner.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Tracking Map */}
      {isMapsApiKeyConfigured() && deliveryStatus.currentLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MapView
              stores={[{
                id: 'delivery-partner',
                name: 'Your Order',
                address: 'On the way to you',
                latitude: deliveryStatus.currentLocation.lat,
                longitude: deliveryStatus.currentLocation.lng,
                rating: deliveryStatus.deliveryPartner.rating,
                deliveryTime: deliveryStatus.estimatedTime,
                distance: '0.5 km away',
                isOpen: true
              }]}
              userLocation={{ lat: 12.9716, lng: 77.5946 }} // Customer location
              onStoreSelect={() => {}}
              showFilters={false}
              showSearch={false}
              height="h-64"
            />
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {deliveryStatus.orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{deliveryStatus.orderDetails.total}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryTracking;
