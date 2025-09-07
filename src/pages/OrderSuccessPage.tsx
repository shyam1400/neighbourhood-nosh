import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, User, Phone, MapPin, Package, Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderSuccessData | null>(null);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // If no order data, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleContinueShopping = () => {
    navigate('/customer');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading order details...</h2>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600">Order ID: #{orderId}</p>
          <p className="text-gray-500 mt-2">Thank you for your order. We're preparing it for delivery!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Person Info */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <User className="w-6 h-6" />
                  Your Delivery Partner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {deliveryPerson.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">{deliveryPerson.name}</h3>
                      <div className="flex items-center gap-2 text-green-700 mb-1">
                        <Phone className="w-4 h-4" />
                        <span>{deliveryPerson.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <Package className="w-4 h-4" />
                        <span>{deliveryPerson.vehicleType} • ⭐ {deliveryPerson.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-3 py-2">
                      <Clock className="w-4 h-4 mr-2" />
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
                  <Package className="w-6 h-6" />
                  Order Details
                  {isMultiStore && (
                    <Badge variant="outline" className="ml-2">
                      {storeCarts.length} stores
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {storeCarts.map((storeCart, index) => (
                  <div key={storeCart.storeId} className="space-y-4">
                    {isMultiStore && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900">{storeCart.storeName}</h4>
                          <p className="text-sm text-blue-700">{storeCart.items.length} items</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3 ml-4">
                      {storeCart.items.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                              {item.product.image}
                            </div>
                            <div>
                              <h5 className="font-medium">{item.product.name}</h5>
                              <p className="text-sm text-gray-600">
                                ₹{item.product.price} per {item.product.unit}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">x{item.quantity}</p>
                            <p className="text-sm text-gray-600">₹{item.product.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {isMultiStore && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded ml-4">
                        <span className="font-medium">Store Total:</span>
                        <span className="font-bold">₹{storeCart.subtotal + storeCart.deliveryFee}</span>
                      </div>
                    )}

                    {isMultiStore && index < storeCarts.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Delivery Address</h4>
                  <p className="text-sm">{deliveryAddress}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Payment Method</h4>
                  <p className="text-sm capitalize">{paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Estimated Delivery</h4>
                  <p className="font-medium text-green-600">{estimatedDeliveryTime}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{storeCarts.reduce((sum, cart) => sum + cart.subtotal, 0)}</span>
                  </div>
                  <div className="flex justify-between">
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

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleContinueShopping}
                variant="outline"
                className="w-full h-12 flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Button>
              <Button
                onClick={handleGoHome}
                className="w-full h-12 flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </Button>
            </div>

            {/* Track Order Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-medium text-blue-900 mb-2">Track Your Order</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    You can track your order status from the Orders section in your account.
                  </p>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Order #{orderId}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
