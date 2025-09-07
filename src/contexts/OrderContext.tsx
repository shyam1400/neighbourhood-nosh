import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

export interface Order {
  id: string;
  customerId: string;
  storeId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  status: 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  deliveryTime: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  customerName?: string;
  storeName?: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } };

const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersByStore: (storeId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  setCurrentOrder: (order: Order | null) => void;
} | null>(null);

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.id ? action.payload : state.currentOrder
      };
    
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date() }
            : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.orderId
          ? { ...state.currentOrder, status: action.payload.status, updatedAt: new Date() }
          : state.currentOrder
      };
    
    default:
      return state;
  }
};

const initialState: OrderState = {
  orders: [
    {
      id: 'order_1',
      customerId: 'customer_1',
      storeId: '1',
      items: [
        {
          product: {
            id: '1',
            name: 'Basmati Rice',
            price: 120,
            unit: 'kg',
            image: '🍚',
            storeId: '1'
          },
          quantity: 2
        },
        {
          product: {
            id: '2',
            name: 'Toor Dal',
            price: 80,
            unit: 'kg',
            image: '🫘',
            storeId: '1'
          },
          quantity: 1
        }
      ],
      totalAmount: 320,
      deliveryAddress: '123, 5th Block, Koramangala, Bangalore - 560034',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cash',
      deliveryTime: '20-25 min',
      notes: 'Please deliver after 6 PM',
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      updatedAt: new Date(Date.now() - 10 * 60 * 1000),
      customerName: 'Rajesh Kumar',
      storeName: 'Koramangala Fresh Mart'
    },
    {
      id: 'order_2',
      customerId: 'customer_2',
      storeId: '1',
      items: [
        {
          product: {
            id: '3',
            name: 'Sunflower Oil',
            price: 150,
            unit: 'liter',
            image: '🫒',
            storeId: '1'
          },
          quantity: 1
        },
        {
          product: {
            id: '4',
            name: 'Milk',
            price: 25,
            unit: 'liter',
            image: '🥛',
            storeId: '1'
          },
          quantity: 2
        }
      ],
      totalAmount: 200,
      deliveryAddress: '456, 6th Block, Koramangala, Bangalore - 560034',
      status: 'accepted',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      deliveryTime: '15-20 min',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      updatedAt: new Date(Date.now() - 25 * 60 * 1000),
      customerName: 'Priya Sharma',
      storeName: 'Koramangala Fresh Mart'
    },
    {
      id: 'order_3',
      customerId: 'customer_3',
      storeId: '1',
      items: [
        {
          product: {
            id: '5',
            name: 'Onions',
            price: 30,
            unit: 'kg',
            image: '🧅',
            storeId: '1'
          },
          quantity: 1
        },
        {
          product: {
            id: '6',
            name: 'Tomatoes',
            price: 40,
            unit: 'kg',
            image: '🍅',
            storeId: '1'
          },
          quantity: 1
        }
      ],
      totalAmount: 70,
      deliveryAddress: '789, 7th Block, Koramangala, Bangalore - 560034',
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'cash',
      deliveryTime: 'Delivered',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      customerName: 'Amit Singh',
      storeName: 'Koramangala Fresh Mart'
    },
    {
      id: 'order_4',
      customerId: 'customer_4',
      storeId: '1',
      items: [
        {
          product: {
            id: '7',
            name: 'Wheat Flour',
            price: 45,
            unit: 'kg',
            image: '🌾',
            storeId: '1'
          },
          quantity: 2
        },
        {
          product: {
            id: '8',
            name: 'Sugar',
            price: 35,
            unit: 'kg',
            image: '🍯',
            storeId: '1'
          },
          quantity: 1
        },
        {
          product: {
            id: '9',
            name: 'Tea Leaves',
            price: 120,
            unit: 'packet',
            image: '🍵',
            storeId: '1'
          },
          quantity: 1
        }
      ],
      totalAmount: 245,
      deliveryAddress: '456, Indiranagar 100ft Road, Bangalore - 560038',
      status: 'preparing',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      deliveryTime: '25-30 min',
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      updatedAt: new Date(Date.now() - 2 * 60 * 1000),
      customerName: 'Sneha Reddy',
      storeName: 'Koramangala Fresh Mart'
    },
    {
      id: 'order_5',
      customerId: 'customer_5',
      storeId: '1',
      items: [
        {
          product: {
            id: '10',
            name: 'Chicken',
            price: 200,
            unit: 'kg',
            image: '🍗',
            storeId: '1'
          },
          quantity: 1
        },
        {
          product: {
            id: '11',
            name: 'Ginger',
            price: 80,
            unit: 'kg',
            image: '🫚',
            storeId: '1'
          },
          quantity: 0.5
        },
        {
          product: {
            id: '12',
            name: 'Garlic',
            price: 60,
            unit: 'kg',
            image: '🧄',
            storeId: '1'
          },
          quantity: 0.25
        }
      ],
      totalAmount: 320,
      deliveryAddress: '123, Brigade Road, Bangalore - 560001',
      status: 'ready',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      deliveryTime: 'Ready for pickup',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      updatedAt: new Date(Date.now() - 5 * 60 * 1000),
      customerName: 'Vikram Joshi',
      storeName: 'Koramangala Fresh Mart'
    },
    {
      id: 'order_6',
      customerId: 'customer_6',
      storeId: '1',
      items: [
        {
          product: {
            id: '13',
            name: 'Paneer',
            price: 180,
            unit: 'kg',
            image: '🧀',
            storeId: '1'
          },
          quantity: 0.5
        },
        {
          product: {
            id: '14',
            name: 'Capsicum',
            price: 50,
            unit: 'kg',
            image: '🫑',
            storeId: '1'
          },
          quantity: 1
        },
        {
          product: {
            id: '15',
            name: 'Coriander',
            price: 20,
            unit: 'bunch',
            image: '🌿',
            storeId: '1'
          },
          quantity: 2
        }
      ],
      totalAmount: 200,
      deliveryAddress: '789, Whitefield Main Road, Bangalore - 560066',
      status: 'out_for_delivery',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      deliveryTime: 'Out for delivery',
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      updatedAt: new Date(Date.now() - 10 * 60 * 1000),
      customerName: 'Anita Gupta',
      storeName: 'Koramangala Fresh Mart'
    },
    {
      id: 'order_7',
      customerId: 'customer_7',
      storeId: '1',
      items: [
        {
          product: {
            id: '16',
            name: 'Bananas',
            price: 40,
            unit: 'dozen',
            image: '🍌',
            storeId: '1'
          },
          quantity: 1
        },
        {
          product: {
            id: '17',
            name: 'Apples',
            price: 120,
            unit: 'kg',
            image: '🍎',
            storeId: '1'
          },
          quantity: 1
        },
        {
          product: {
            id: '18',
            name: 'Oranges',
            price: 60,
            unit: 'kg',
            image: '🍊',
            storeId: '1'
          },
          quantity: 1
        }
      ],
      totalAmount: 220,
      deliveryAddress: '456, Jayanagar 4th Block, Bangalore - 560011',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'cash',
      deliveryTime: '30-35 min',
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      updatedAt: new Date(Date.now() - 2 * 60 * 1000),
      customerName: 'Ravi Kumar',
      storeName: 'Koramangala Fresh Mart'
    },
    {
      id: 'order_8',
      customerId: 'customer_8',
      storeId: '1',
      items: [
        {
          product: {
            id: '19',
            name: 'Bread',
            price: 25,
            unit: 'packet',
            image: '🍞',
            storeId: '1'
          },
          quantity: 2
        },
        {
          product: {
            id: '20',
            name: 'Butter',
            price: 55,
            unit: 'packet',
            image: '🧈',
            storeId: '1'
          },
          quantity: 1
        },
        {
          product: {
            id: '21',
            name: 'Jam',
            price: 80,
            unit: 'bottle',
            image: '🍓',
            storeId: '1'
          },
          quantity: 1
        }
      ],
      totalAmount: 185,
      deliveryAddress: '123, Malleswaram 8th Cross, Bangalore - 560003',
      status: 'accepted',
      paymentStatus: 'paid',
      paymentMethod: 'wallet',
      deliveryTime: '20-25 min',
      createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      updatedAt: new Date(Date.now() - 5 * 60 * 1000),
      customerName: 'Meera Iyer',
      storeName: 'Koramangala Fresh Mart'
    }
  ],
  currentOrder: null,
  isLoading: false,
  error: null
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate order status updates
      state.orders.forEach(order => {
        if (order.status === 'accepted' && Math.random() > 0.8) {
          dispatch({
            type: 'UPDATE_ORDER_STATUS',
            payload: { orderId: order.id, status: 'preparing' }
          });
        } else if (order.status === 'preparing' && Math.random() > 0.7) {
          dispatch({
            type: 'UPDATE_ORDER_STATUS',
            payload: { orderId: order.id, status: 'ready' }
          });
        } else if (order.status === 'ready' && Math.random() > 0.6) {
          dispatch({
            type: 'UPDATE_ORDER_STATUS',
            payload: { orderId: order.id, status: 'out_for_delivery' }
          });
        } else if (order.status === 'out_for_delivery' && Math.random() > 0.5) {
          dispatch({
            type: 'UPDATE_ORDER_STATUS',
            payload: { orderId: order.id, status: 'delivered' }
          });
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [state.orders]);

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId: orderData.customerId || 'current_user',
        storeId: orderData.storeId || '',
        items: orderData.items || [],
        totalAmount: orderData.totalAmount || 0,
        deliveryAddress: orderData.deliveryAddress || '',
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: orderData.paymentMethod || 'cash',
        deliveryTime: orderData.deliveryTime || '15-30 min',
        notes: orderData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
        customerName: orderData.customerName || 'Current User',
        storeName: orderData.storeName || 'Local Store'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      dispatch({ type: 'SET_LOADING', payload: false });

      return newOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create order' });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: { orderId, status }
      });

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update order status' });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const getOrdersByCustomer = (customerId: string): Order[] => {
    return state.orders.filter(order => order.customerId === customerId);
  };

  const getOrdersByStore = (storeId: string): Order[] => {
    return state.orders.filter(order => order.storeId === storeId);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return state.orders.find(order => order.id === orderId);
  };

  const setCurrentOrder = (order: Order | null) => {
    dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
  };

  return (
    <OrderContext.Provider
      value={{
        state,
        dispatch,
        createOrder,
        updateOrderStatus,
        getOrdersByCustomer,
        getOrdersByStore,
        getOrderById,
        setCurrentOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
