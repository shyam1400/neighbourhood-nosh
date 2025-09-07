import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const ContextualNotificationSystem: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();

  // Customer page notifications - offers and deals
  const customerNotifications = [
    {
      title: '🎉 Special Offer!',
      description: 'Get 20% off on fresh vegetables! Use code VEG20',
      type: 'success' as const
    },
    {
      title: '🚚 Free Delivery',
      description: 'Free delivery on orders above ₹200 - Limited time!',
      type: 'info' as const
    },
    {
      title: '🍳 Recipe Packages',
      description: 'New recipe packages available with 10% discount!',
      type: 'success' as const
    },
    {
      title: '⚡ Flash Sale',
      description: '30% off on dairy products for next 2 hours only!',
      type: 'warning' as const
    },
    {
      title: '🎁 Weekend Special',
      description: 'Buy 2 get 1 free on snacks - Today only!',
      type: 'success' as const
    },
    {
      title: '🥬 Fresh Arrivals',
      description: 'New organic vegetables just arrived in your area!',
      type: 'info' as const
    },
    {
      title: '💳 Payment Offer',
      description: 'Get ₹50 cashback on UPI payments above ₹300',
      type: 'success' as const
    }
  ];

  // Vendor page notifications - best selling items and business insights
  const vendorNotifications = [
    {
      title: '🏆 Top Seller Today',
      description: 'Basmati Rice is your best seller with 15 orders! Keep it stocked!',
      type: 'success' as const
    },
    {
      title: '📈 Trending Item',
      description: 'Milk is trending - 8 orders in the last hour! Consider bulk ordering.',
      type: 'success' as const
    },
    {
      title: '⚠️ Low Stock Alert',
      description: 'Wheat Flour is running low (only 5 bags left) - Restock soon!',
      type: 'warning' as const
    },
    {
      title: '🔥 Hot Item',
      description: 'Fresh Vegetables are selling fast - 12 orders today!',
      type: 'success' as const
    },
    {
      title: '💰 High Value Order',
      description: 'New order from Priya Sharma - ₹320 (Premium customer)',
      type: 'info' as const
    },
    {
      title: '📊 Sales Insight',
      description: 'Your morning sales are 25% higher than yesterday!',
      type: 'success' as const
    },
    {
      title: '🚨 Critical Stock',
      description: 'Onions stock is critically low - urgent restock needed!',
      type: 'error' as const
    },
    {
      title: '⭐ Customer Favorite',
      description: 'Toor Dal is a customer favorite - 10 repeat orders this week!',
      type: 'info' as const
    }
  ];

  // Delivery page notifications - hotspots and high-demand areas
  const deliveryNotifications = [
    {
      title: '🔥 Hotspot Alert',
      description: 'Koramangala has 8 pending orders - high demand area!',
      type: 'info' as const
    },
    {
      title: '⚡ Busy Zone',
      description: 'Indiranagar is busy - 5 orders waiting for pickup',
      type: 'warning' as const
    },
    {
      title: '💰 Surge Pricing',
      description: 'Shivajinagar area has surge pricing - earn 25% more!',
      type: 'success' as const
    },
    {
      title: '🚀 Quick Orders',
      description: 'Richmond Town: 3 quick delivery orders available',
      type: 'success' as const
    },
    {
      title: '📍 Ready for Pickup',
      description: 'Malleshwaram: 4 orders ready for immediate pickup',
      type: 'info' as const
    },
    {
      title: '🎯 High Value Zone',
      description: 'Whitefield: Premium orders with ₹50+ tips available',
      type: 'success' as const
    },
    {
      title: '⏰ Rush Hour',
      description: 'Brigade Road: Lunch rush - 6 orders in 2km radius',
      type: 'warning' as const
    },
    {
      title: '🌟 New Hotspot',
      description: 'Jayanagar: New area with 3 orders - low competition!',
      type: 'info' as const
    }
  ];

  // Get notifications based on current page - only show on authenticated pages
  const getNotifications = () => {
    // Don't show notifications on home page or login/signup pages
    if (location.pathname === '/' || 
        location.pathname.includes('/login') || 
        location.pathname.includes('/signup') ||
        location.pathname.includes('/customer-login') ||
        location.pathname.includes('/vendor-login') ||
        location.pathname.includes('/delivery-login')) {
      return []; // No notifications on these pages
    }
    
    if (location.pathname.includes('/customer') || location.pathname === '/start-shopping') {
      return customerNotifications;
    } else if (location.pathname.includes('/vendor') || location.pathname.includes('/store')) {
      return vendorNotifications;
    } else if (location.pathname.includes('/delivery')) {
      return deliveryNotifications;
    }
    return []; // No notifications by default
  };

  useEffect(() => {
    const notifications = getNotifications();
    
    // Don't show notifications if array is empty (home page, login pages)
    if (notifications.length === 0) {
      return;
    }
    
    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      
      toast({
        title: randomNotification.title,
        description: randomNotification.description,
        variant: randomNotification.type,
        duration: 5000,
      });
    };

    // Show notification immediately
    showNotification();

    // Set up interval for every 30 seconds
    const interval = setInterval(showNotification, 30000);

    return () => clearInterval(interval);
  }, [location.pathname, t, toast]);

  return null; // This component doesn't render anything
};

export default ContextualNotificationSystem;
