import React from 'react';
import { CheckCircle, Clock, User, Phone, MapPin, Package, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CartItem, StoreCart } from '@/contexts/CartContext';

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleType: string;
  estimatedTime: string;
}

interface OrderSuccessData {
  orderId: string;
  storeCarts: StoreCart[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryPerson: DeliveryPerson;
  estimatedDeliveryTime: string;
  isMultiStore: boolean;
}

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderSuccessData | null;
  onContinueShopping: () => void;
  onGoHome: () => void;
}

// Sample delivery persons pool
const deliveryPersons: DeliveryPerson[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    vehicleType: 'Bike',
    estimatedTime: '15-25 min'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    rating: 4.9,
    vehicleType: 'Scooter',
    estimatedTime: '20-30 min'
  },
  {
    id: '3',
    name: 'Amit Singh',
    phone: '+91 76543 21098',
    rating: 4.7,
    vehicleType: 'Bike',
    estimatedTime: '18-28 min'
  },
  {
    id: '4',
    name: 'Sneha Patel',
    phone: '+91 65432 10987',
    rating: 4.9,
    vehicleType: 'Car',
    estimatedTime: '12-20 min'
  }
];

export const getRandomDeliveryPerson = (): DeliveryPerson => {
  return deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)];
};

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onContinueShopping,
  onGoHome
}) => {
  if (!orderData) return null;

  const {
    orderId,
    storeCarts,
    totalAmount,
    deliveryAddress,
    paymentMethod,
    deliveryPerson,
    estimatedDeliveryTime,
    isMultiStore
  } = orderData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-green-600">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
              <p className="text-sm text-gray-600 font-normal">Order ID: #{orderId}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Delivery Person Info */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <User className="w-5 h-5" />
                Your Delivery Partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {deliveryPerson.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">{deliveryPerson.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Phone className="w-3 h-3" />
                      <span>{deliveryPerson.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Package className="w-3 h-3" />
                      <span>{deliveryPerson.vehicleType} • ⭐ {deliveryPerson.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {estimatedDeliveryTime}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
                {isMultiStore && (
                  <Badge variant="outline" className="ml-2">
                    {storeCarts.length} stores
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {storeCarts.map((storeCart, index) => (
                <div key={storeCart.storeId} className="space-y-3">
                  {isMultiStore && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">{storeCart.storeName}</h4>
                        <p className="text-xs text-blue-700">{storeCart.items.length} items</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 ml-4">
                    {storeCart.items.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                            {item.product.image}
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">{item.product.name}</h5>
                            <p className="text-xs text-gray-600">
                              ₹{item.product.price} per {item.product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">x{item.quantity}</p>
                          <p className="text-sm text-gray-600">₹{item.product.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isMultiStore && (
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded ml-4">
                      <span className="text-sm font-medium">Store Total:</span>
                      <span className="text-sm font-bold">₹{storeCart.subtotal + storeCart.deliveryFee}</span>
                    </div>
                  )}

                  {isMultiStore && index < storeCarts.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-gray-700">Delivery Address</h4>
                <p className="text-sm">{deliveryAddress}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-700">Payment Method</h4>
                <p className="text-sm capitalize">{paymentMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-700">Estimated Delivery</h4>
                <p className="text-sm font-medium text-green-600">{estimatedDeliveryTime}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{storeCarts.reduce((sum, cart) => sum + cart.subtotal, 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee:</span>
                  <span>₹{storeCarts.reduce((sum, cart) => sum + cart.deliveryFee, 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-4 space-y-3 bg-white">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onContinueShopping}
              className="h-12 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
            <Button
              onClick={onGoHome}
              className="h-12 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </Button>
          </div>
          <p className="text-center text-xs text-gray-500">
            You can track your order status from the Orders section
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
