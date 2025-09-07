import React, { useEffect, useState } from 'react';
import { Bell, Package, Star, Zap, Gift, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'info' | 'success' | 'warning' | 'error';
}

const NotificationSimulator: React.FC = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(true);

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Order Alert!',
      description: 'You have a new order from Rajesh Kumar - ₹320',
      icon: <Package className="w-4 h-4" />,
      type: 'info'
    },
    {
      id: '2',
      title: 'Special Offer!',
      description: 'Get 20% off on all vegetables today only!',
      icon: <Gift className="w-4 h-4" />,
      type: 'success'
    },
    {
      id: '3',
      title: 'Store Rating Update',
      description: 'Your store rating improved to 4.8 stars!',
      icon: <Star className="w-4 h-4" />,
      type: 'success'
    },
    {
      id: '4',
      title: 'Delivery Partner Available',
      description: '3 delivery partners are online in your area',
      icon: <Zap className="w-4 h-4" />,
      type: 'info'
    },
    {
      id: '5',
      title: 'Sales Update',
      description: 'Today\'s sales: ₹2,450 - up 15% from yesterday!',
      icon: <TrendingUp className="w-4 h-4" />,
      type: 'success'
    },
    {
      id: '6',
      title: 'Low Stock Alert',
      description: 'Milk stock is running low (only 5 units left)',
      icon: <Bell className="w-4 h-4" />,
      type: 'warning'
    },
    {
      id: '7',
      title: 'Customer Review',
      description: 'New 5-star review from Priya Sharma!',
      icon: <Star className="w-4 h-4" />,
      type: 'success'
    },
    {
      id: '8',
      title: 'Order Delivered',
      description: 'Order #1234 has been successfully delivered',
      icon: <Package className="w-4 h-4" />,
      type: 'success'
    },
    {
      id: '9',
      title: 'Flash Sale!',
      description: '50% off on all spices - limited time offer!',
      icon: <Gift className="w-4 h-4" />,
      type: 'success'
    },
    {
      id: '10',
      title: 'New Customer',
      description: 'Welcome new customer Amit Singh to your store!',
      icon: <Bell className="w-4 h-4" />,
      type: 'info'
    }
  ];

  useEffect(() => {
    if (!isActive) return;

    const showRandomNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      
      toast({
        title: randomNotification.title,
        description: randomNotification.description,
        variant: randomNotification.type === 'error' ? 'destructive' : 'default',
        duration: 5000,
      });
    };

    // Show first notification after 1 minute
    const initialTimeout = setTimeout(showRandomNotification, 60000);

    // Then show notifications every 60 seconds
    const interval = setInterval(showRandomNotification, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isActive, toast]);

  // This component doesn't render anything visible
  return null;
};

export default NotificationSimulator;
