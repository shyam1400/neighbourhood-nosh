import React, { useState } from 'react';
import { User, Settings, LogOut, Package, MapPin, Bell, HelpCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOrder } from '@/contexts/OrderContext';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  userType: 'customer' | 'vendor' | 'delivery';
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  userType, 
  userName = 'User', 
  userEmail = 'user@example.com',
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getOrdersByCustomer } = useOrder();
  const navigate = useNavigate();

  const getProfileOptions = () => {
    switch (userType) {
      case 'customer':
        return [
          { icon: Package, label: 'My Orders', href: '/orders' },
          { icon: MapPin, label: 'Delivery Addresses', href: '/addresses' },
          { icon: CreditCard, label: 'Payment Methods', href: '/payments' },
          { icon: Bell, label: 'Notifications', href: '/notifications' },
          { icon: Settings, label: 'Settings', href: '/settings' },
          { icon: HelpCircle, label: 'Help & Support', href: '/help' }
        ];
      case 'vendor':
        return [
          { icon: Package, label: 'Store Orders', href: '/vendor/orders' },
          { icon: Settings, label: 'Store Settings', href: '/vendor/settings' },
          { icon: Bell, label: 'Notifications', href: '/vendor/notifications' },
          { icon: HelpCircle, label: 'Help & Support', href: '/vendor/help' }
        ];
      case 'delivery':
        return [
          { icon: Package, label: 'Delivery Orders', href: '/delivery/orders' },
          { icon: MapPin, label: 'Delivery Areas', href: '/delivery/areas' },
          { icon: Settings, label: 'Profile Settings', href: '/delivery/settings' },
          { icon: Bell, label: 'Notifications', href: '/delivery/notifications' },
          { icon: HelpCircle, label: 'Help & Support', href: '/delivery/help' }
        ];
      default:
        return [];
    }
  };

  const getStats = () => {
    switch (userType) {
      case 'customer':
        const customerOrders = getOrdersByCustomer('current_user');
        return [
          { label: 'Total Orders', value: customerOrders.length },
          { label: 'This Month', value: customerOrders.filter(o => {
            const orderDate = new Date(o.createdAt);
            const now = new Date();
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
          }).length }
        ];
      case 'vendor':
        return [
          { label: 'Store Rating', value: '4.8★' },
          { label: 'Total Orders', value: '156' }
        ];
      case 'delivery':
        return [
          { label: 'Deliveries Today', value: '12' },
          { label: 'Rating', value: '4.9★' }
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    // Navigate to appropriate login page based on user type
    switch (userType) {
      case 'customer':
        navigate('/customer-login');
        break;
      case 'vendor':
        navigate('/vendor-login');
        break;
      case 'delivery':
        navigate('/delivery-login');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <User className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Info */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-600">{userEmail}</p>
            <Badge variant="outline" className="mt-2">
              {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {getStats().map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Menu Options */}
          <div className="space-y-2">
            {getProfileOptions().map((option, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => {
                  // Handle navigation
                  console.log(`Navigate to ${option.href}`);
                  setIsOpen(false);
                }}
              >
                <option.icon className="w-5 h-5 mr-3" />
                {option.label}
              </Button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
