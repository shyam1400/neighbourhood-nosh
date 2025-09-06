import { useState, useEffect } from "react";
import { ArrowLeft, Bike, Package, MapPin, Clock, CheckCircle, XCircle, Navigation, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useOrder } from "@/contexts/OrderContext";
import NotificationSystem from "@/components/NotificationSystem";
import LocationSelector from "@/components/LocationSelector";
import LogoutDialog from "@/components/LogoutDialog";

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  storeName: string;
  storeAddress: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered';
  estimatedTime: string;
  distance: string;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
}

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([
    {
      id: "del_1",
      customerName: "Rahul Sharma",
      customerPhone: "+91 98765 43210",
      storeName: "Sharma Kirana Store",
      storeAddress: "123, MG Road, Koramangala",
      deliveryAddress: "456, Brigade Road, Bangalore",
      items: [
        { name: "Basmati Rice 1kg", quantity: 2, price: 120 },
        { name: "Fresh Milk 1L", quantity: 1, price: 60 }
      ],
      totalAmount: 300,
      status: 'assigned',
      estimatedTime: "15 min",
      distance: "2.5 km",
      paymentMethod: "Cash on Delivery",
      notes: "Call before delivery",
      createdAt: new Date()
    },
    {
      id: "del_2",
      customerName: "Priya Patel",
      customerPhone: "+91 98765 43211",
      storeName: "Gupta General Store",
      storeAddress: "456, Brigade Road, Bangalore",
      deliveryAddress: "789, Indiranagar, Bangalore",
      items: [
        { name: "Bread Loaf", quantity: 1, price: 25 },
        { name: "Butter 100g", quantity: 1, price: 55 }
      ],
      totalAmount: 80,
      status: 'picked_up',
      estimatedTime: "8 min",
      distance: "1.2 km",
      paymentMethod: "UPI",
      createdAt: new Date()
    }
  ]);

  const [currentLocation, setCurrentLocation] = useState({
    id: '1',
    name: 'Koramangala',
    address: 'Koramangala, Bangalore',
    city: 'Bangalore',
    pincode: '560034',
    coordinates: { lat: 12.9352, lng: 77.6245 }
  });

  const [isOnline, setIsOnline] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleOrderStatusUpdate = (orderId: string, newStatus: DeliveryOrder['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    // Navigate to home page
    window.location.href = '/';
  };

  const handleContinueShopping = () => {
    setShowLogoutDialog(false);
    // Stay on current page
  };

  const handleBackClick = () => {
    setShowLogoutDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Package className="w-4 h-4" />;
      case 'picked_up': return <CheckCircle className="w-4 h-4" />;
      case 'out_for_delivery': return <Navigation className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getNextStatus = (currentStatus: DeliveryOrder['status']): DeliveryOrder['status'] | null => {
    switch (currentStatus) {
      case 'assigned': return 'picked_up';
      case 'picked_up': return 'out_for_delivery';
      case 'out_for_delivery': return 'delivered';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus: DeliveryOrder['status']): string => {
    switch (currentStatus) {
      case 'assigned': return 'Mark as Picked Up';
      case 'picked_up': return 'Start Delivery';
      case 'out_for_delivery': return 'Mark as Delivered';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={handleBackClick}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bike className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Kiro - Delivery Partner</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LocationSelector
                currentLocation={currentLocation}
                onLocationSelect={setCurrentLocation}
                userType="delivery"
              />
              <NotificationSystem userId="delivery_1" userRole="delivery" />
              <Button
                variant={isOnline ? "default" : "outline"}
                size="sm"
                onClick={() => setIsOnline(!isOnline)}
                className={isOnline ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isOnline ? "Online" : "Offline"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹450</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status !== 'delivered').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.9★</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Delivery Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-500">{order.estimatedTime}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Store Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Pickup from Store
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">{order.storeName}</p>
                      <p className="text-sm text-gray-500">{order.storeAddress}</p>
                      <div className="mt-2">
                        <h5 className="text-sm font-medium text-gray-700">Items to Pick:</h5>
                        <ul className="text-sm text-gray-600 mt-1">
                          {order.items.map((item, idx) => (
                            <li key={idx}>{item.name} x {item.quantity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Deliver to Customer
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">{order.customerName}</p>
                      <p className="text-sm text-gray-500 mb-1">{order.deliveryAddress}</p>
                      <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <strong>Payment:</strong> {order.paymentMethod}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Distance:</strong> {order.distance}
                        </p>
                        {order.notes && (
                          <p className="text-sm text-gray-600">
                            <strong>Notes:</strong> {order.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4">
                    {getNextStatus(order.status) && (
                      <Button
                        onClick={() => handleOrderStatusUpdate(order.id, getNextStatus(order.status)!)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {getNextStatusLabel(order.status)}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Dialog */}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onLogout={handleLogout}
        onContinueShopping={handleContinueShopping}
        userType="delivery"
      />
    </div>
  );
};

export default DeliveryDashboard;
