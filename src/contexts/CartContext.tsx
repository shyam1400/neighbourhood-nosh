import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '@/data/products';
import { Store, getStoreById } from '@/data/stores';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreCart {
  storeId: string;
  storeName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  storeCarts: StoreCart[];
  multiStoreEnabled: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_STORE_CART'; payload: string }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'TOGGLE_MULTI_STORE' }
  | { type: 'UPDATE_STORE_CARTS'; payload: StoreCart[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearStoreCart: (storeId: string) => void;
  getItemQuantity: (productId: string) => number;
  getTotalPrice: () => number;
  getItemCount: () => number;
  toggleMultiStore: () => void;
  getStoreCarts: () => StoreCart[];
  getStoreCart: (storeId: string) => StoreCart | undefined;
  canAddToCart: (product: Product) => boolean;
  checkoutMultipleStores: (storeIds: string[]) => Promise<void>;
} | null>(null);

// Helper function to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('neighbourhood-nosh-cart', JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('neighbourhood-nosh-cart');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
    return [];
  }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        item => item.product.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        newState = {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      } else {
        const newItems = [...state.items, { product: action.payload, quantity: 1 }];
        newState = {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
      saveCartToStorage(newState.items);
      return newState;
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(
        item => item.product.id !== action.payload
      );
      newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
      saveCartToStorage(newState.items);
      return newState;
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: action.payload.productId });
      }

      const updatedItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
      saveCartToStorage(newState.items);
      return newState;
    }

    case 'CLEAR_CART':
      saveCartToStorage([]);
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        storeCarts: []
      };

    case 'CLEAR_STORE_CART': {
      const updatedItems = state.items.filter(
        item => item.product.storeId !== action.payload
      );
      newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
      saveCartToStorage(newState.items);
      return newState;
    }

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'TOGGLE_MULTI_STORE':
      return {
        ...state,
        multiStoreEnabled: !state.multiStoreEnabled
      };

    case 'UPDATE_STORE_CARTS':
      return {
        ...state,
        storeCarts: action.payload
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  total: 0,
  itemCount: 0,
  storeCarts: [],
  multiStoreEnabled: true
};

// Calculate initial totals from loaded items
initialState.total = initialState.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
initialState.itemCount = initialState.items.reduce((sum, item) => sum + item.quantity, 0);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const clearStoreCart = (storeId: string) => {
    dispatch({ type: 'CLEAR_STORE_CART', payload: storeId });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = (): number => {
    return state.total;
  };

  const getItemCount = (): number => {
    return state.itemCount;
  };

  const toggleMultiStore = () => {
    dispatch({ type: 'TOGGLE_MULTI_STORE' });
  };

  const getStoreCarts = (): StoreCart[] => {
    // Always create store carts from current items to ensure they're up to date
    if (state.items.length > 0) {
      const itemsByStore = state.items.reduce((acc, item) => {
        const storeId = item.product.storeId;
        if (!acc[storeId]) {
          acc[storeId] = [];
        }
        acc[storeId].push(item);
        return acc;
      }, {} as Record<string, typeof state.items>);

      const storeCarts: StoreCart[] = Object.entries(itemsByStore).map(([storeId, items]) => {
        const store = getStoreById(storeId);
        const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const deliveryFee = 20; // Default delivery fee per store
        const total = subtotal + deliveryFee;

        return {
          storeId,
          storeName: store?.name || 'Store',
          items,
          subtotal,
          deliveryFee,
          total
        };
      });

      return storeCarts;
    }

    return [];
  };

  const getStoreCart = (storeId: string): StoreCart | undefined => {
    return state.storeCarts.find(cart => cart.storeId === storeId);
  };

  const canAddToCart = (product: Product): boolean => {
    // Always allow adding to cart - multi-store is enabled by default
    return true;
  };

  const checkoutMultipleStores = async (storeIds: string[]): Promise<void> => {
    // This function will handle checkout for multiple stores
    // For now, it's a placeholder that could integrate with your order system
    console.log('Checking out from stores:', storeIds);
    
    // You can implement the actual checkout logic here
    // For example, creating separate orders for each store
    const storeCarts = getStoreCarts().filter(cart => storeIds.includes(cart.storeId));
    
    try {
      // Simulate API calls for each store
      const orderPromises = storeCarts.map(async (cart) => {
        // Replace this with actual API call to create order
        return {
          storeId: cart.storeId,
          storeName: cart.storeName,
          items: cart.items,
          total: cart.total,
          orderId: `order_${Date.now()}_${cart.storeId}`
        };
      });
      
      const orders = await Promise.all(orderPromises);
      console.log('Orders created:', orders);
      
      // Clear only the items from checked out stores
      storeIds.forEach(storeId => {
        clearStoreCart(storeId);
      });
      
    } catch (error) {
      console.error('Error during multi-store checkout:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearStoreCart,
        getItemQuantity,
        getTotalPrice,
        getItemCount,
        toggleMultiStore,
        getStoreCarts,
        getStoreCart,
        canAddToCart,
        checkoutMultipleStores
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
