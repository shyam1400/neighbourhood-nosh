import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, Store, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { getStoreById } from '@/data/stores';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  onCheckout?: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onCheckout }) => {
  const { state, addToCart, removeFromCart, updateQuantity, getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Group items by store
  const itemsByStore = state.items.reduce((acc, item) => {
    const storeId = item.product.storeId;
    if (!acc[storeId]) {
      acc[storeId] = [];
    }
    acc[storeId].push(item);
    return acc;
  }, {} as Record<string, typeof state.items>);

  const storeIds = Object.keys(itemsByStore);
  const isMultiStore = storeIds.length > 1;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      setIsOpen(false);
      navigate('/checkout');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 relative">
          <ShoppingCart className="w-5 h-5" />
          {getItemCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {getItemCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({getItemCount()} items)
            {isMultiStore && (
              <Badge variant="secondary" className="ml-2">
                {storeIds.length} stores
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Add some items from the store to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items Grouped by Store */}
              <div className="max-h-60 overflow-y-auto space-y-4">
                {storeIds.map((storeId) => {
                  const store = getStoreById(storeId);
                  const storeItems = itemsByStore[storeId];
                  const storeTotal = storeItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                  
                  return (
                    <div key={storeId} className="space-y-2">
                      {/* Store Header */}
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Store className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-900">{store?.name || 'Store'}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{store?.address || 'Address not available'}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {storeItems.length} items
                        </Badge>
                      </div>

                      {/* Store Items */}
                      <div className="space-y-2 ml-4">
                        {storeItems.map((item) => (
                          <Card key={item.product.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                {/* Product Image */}
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                                  {item.product.image}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm text-gray-900 truncate">
                                    {item.product.name}
                                  </h4>
                                  <p className="text-xs text-gray-600">{item.product.category}</p>
                                  <p className="text-xs font-semibold text-blue-600">
                                    ₹{item.product.price} per {item.product.unit}
                                  </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                    className="h-5 w-5 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                    className="h-5 w-5 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <p className="font-semibold text-xs">₹{item.product.price * item.quantity}</p>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Store Subtotal */}
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg ml-4">
                        <span className="text-sm font-medium text-blue-900">Store Subtotal:</span>
                        <span className="text-sm font-bold text-blue-900">₹{storeTotal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getItemCount()} items):</span>
                  <span>₹{state.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee:</span>
                  <span className={isMultiStore ? "text-gray-600" : "text-green-600"}>
                    {isMultiStore ? `₹${storeIds.length * 20}` : "FREE"}
                  </span>
                </div>
                {isMultiStore && (
                  <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                    <strong>Multi-store order:</strong> Delivery fee applies per store for coordinated delivery
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{state.total + (isMultiStore ? storeIds.length * 20 : 0)}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isMultiStore ? (
                    <>
                      Checkout from {storeIds.length} stores - ₹{state.total + (storeIds.length * 20)}
                    </>
                  ) : (
                    <>
                      Proceed to Checkout - ₹{state.total}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
