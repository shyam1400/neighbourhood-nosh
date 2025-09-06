import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface CartProps {
  onCheckout: () => void;
  storeId: string;
  storeName: string;
}

const Cart: React.FC<CartProps> = ({ onCheckout, storeId, storeName }) => {
  const { state, addToCart, removeFromCart, updateQuantity, getItemQuantity } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500">Add some items from the store to get started!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {item.product.image}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">{item.product.category}</p>
                    <p className="text-sm text-gray-500">₹{item.product.price} per {item.product.unit}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{item.product.price * item.quantity}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({state.itemCount} items):</span>
                  <span>₹{state.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹0</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{state.total}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={onCheckout}
                className="w-full h-12 text-lg"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Delivery time: 15-30 minutes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Store Info */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Ordering from:</h4>
              <p className="text-sm text-gray-600">{storeName}</p>
              <p className="text-xs text-gray-500 mt-1">Store ID: {storeId}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
