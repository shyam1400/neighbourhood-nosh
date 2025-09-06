import React, { createContext, useContext, useReducer, ReactNode } from 'react';
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
  getItemQuantity: (productId: string) => number;
  getTotalPrice: () => number;
  getItemCount: () => number;
  toggleMultiStore: () => void;
  getStoreCarts: () => StoreCart[];
  getStoreCart: (storeId: string) => StoreCart | undefined;
  canAddToCart: (product: Product) => boolean;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
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
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      } else {
        const newItems = [...state.items, { product: action.payload, quantity: 1 }];
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(
        item => item.product.id !== action.payload
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
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
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };

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
  items: [],
  total: 0,
  itemCount: 0,
  storeCarts: [],
  multiStoreEnabled: false
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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
    if (!state.multiStoreEnabled) {
      return true;
    }

    // If multi-store is enabled, check if adding this product would create too many stores
    const currentStores = new Set(state.items.map(item => item.product.storeId));
    const productStoreId = product.storeId;
    
    // If product is from a new store and we already have items from 2+ stores, don't allow
    if (!currentStores.has(productStoreId) && currentStores.size >= 2) {
      return false;
    }

    return true;
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
        getItemQuantity,
        getTotalPrice,
        getItemCount,
        toggleMultiStore,
        getStoreCarts,
        getStoreCart,
        canAddToCart
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
