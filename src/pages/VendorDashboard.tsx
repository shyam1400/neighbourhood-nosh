import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Package, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useOrder } from "@/contexts/OrderContext";
import NotificationSystem from "@/components/NotificationSystem";
import UserProfile from "@/components/UserProfile";
import LocationSelector from "@/components/LocationSelector";
import LogoutDialog from "@/components/LogoutDialog";

const VendorDashboard = () => {
  const { getOrdersByStore, updateOrderStatus } = useOrder();
  const [orders, setOrders] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState({
    id: '1',
    name: 'Koramangala',
    address: 'Koramangala, Bangalore',
    city: 'Bangalore',
    pincode: '560034',
    coordinates: { lat: 12.9352, lng: 77.6245 }
  });
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const storeId = "1"; // This would come from authentication in a real app

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

  // Load orders for this store
  useEffect(() => {
    const storeOrders = getOrdersByStore(storeId);
    setOrders(storeOrders);
  }, [getOrdersByStore, storeId]);

  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject') => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={handleBackClick}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Kiro - Store Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LocationSelector
                currentLocation={currentLocation}
                onLocationSelect={setCurrentLocation}
                userType="vendor"
              />
              <NotificationSystem userId="vendor_1" userRole="vendor" />
              <UserProfile
                userType="vendor"
                userName="Store Owner"
                userEmail="owner@store.com"
                onLogout={handleLogout}
              />
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹2,450</p>
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
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">
                        <strong>Customer:</strong> {order.customerName}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <strong>Items:</strong> {order.items.map(item => `${item.product?.name || 'Unknown Product'} (${item.quantity}x)`).join(", ")}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <strong>Address:</strong> {order.deliveryAddress}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <strong>Time:</strong> {order.createdAt.toLocaleTimeString()}
                      </p>
                      <p className="text-gray-600 mb-4">
                        <strong>Total:</strong> ₹{order.totalAmount} • <strong>Payment:</strong> {order.paymentMethod.toUpperCase()}
                      </p>
                    </div>
                    {order.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleOrderAction(order.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleOrderAction(order.id, 'reject')}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
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
        userType="vendor"
      />
    </div>
  );
};

export default VendorDashboard;