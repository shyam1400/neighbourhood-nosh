import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const ContextualNotificationSystem: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();

  // Customer page notifications
  const customerNotifications = [
    {
      title: t('notification.specialOffer'),
      description: 'Get 20% off on fresh vegetables! Use code VEG20',
      type: 'success' as const
    },
    {
      title: t('notification.discountAvailable'),
      description: 'Free delivery on orders above ₹200',
      type: 'info' as const
    },
    {
      title: t('notification.specialOffer'),
      description: 'New recipe packages available with 10% discount!',
      type: 'success' as const
    },
    {
      title: t('notification.specialOffer'),
      description: 'Flash sale: 30% off on dairy products for next 2 hours',
      type: 'warning' as const
    },
    {
      title: t('notification.specialOffer'),
      description: 'Weekend special: Buy 2 get 1 free on snacks',
      type: 'success' as const
    }
  ];

  // Vendor page notifications
  const vendorNotifications = [
    {
      title: t('notification.bestSeller'),
      description: 'Basmati Rice is your top selling product today!',
      type: 'info' as const
    },
    {
      title: t('notification.lowStock'),
      description: 'Onions running low - only 5kg left in stock',
      type: 'warning' as const
    },
    {
      title: t('notification.paymentReceived'),
      description: 'Payment of ₹450 received for Order #1234',
      type: 'success' as const
    },
    {
      title: t('notification.bestSeller'),
      description: 'Chicken is trending - consider restocking',
      type: 'info' as const
    },
    {
      title: t('notification.paymentReceived'),
      description: 'Daily earnings: ₹2,340 from 12 orders',
      type: 'success' as const
    }
  ];

  // Delivery page notifications
  const deliveryNotifications = [
    {
      title: t('notification.hotSpot'),
      description: 'Koramangala has 8 pending orders - high demand area!',
      type: 'info' as const
    },
    {
      title: t('notification.hotSpot'),
      description: 'Indiranagar is busy - 5 orders waiting for pickup',
      type: 'warning' as const
    },
    {
      title: t('notification.hotSpot'),
      description: 'Richmond Town: 3 quick delivery orders available',
      type: 'success' as const
    },
    {
      title: t('notification.hotSpot'),
      description: 'Shivajinagar area has surge pricing - earn 25% more!',
      type: 'info' as const
    },
    {
      title: t('notification.hotSpot'),
      description: 'Malleshwaram: 4 orders ready for immediate pickup',
      type: 'success' as const
    }
  ];

  // Get notifications based on current page
  const getNotifications = () => {
    if (location.pathname.includes('/customer') || location.pathname === '/start-shopping') {
      return customerNotifications;
    } else if (location.pathname.includes('/vendor') || location.pathname.includes('/store')) {
      return vendorNotifications;
    } else if (location.pathname.includes('/delivery')) {
      return deliveryNotifications;
    }
    return customerNotifications; // Default to customer notifications
  };

  useEffect(() => {
    const notifications = getNotifications();
    
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
