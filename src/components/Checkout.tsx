import React, { useState } from 'react';
import { CreditCard, MapPin, Clock, Package, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCart, StoreCart } from '@/contexts/CartContext';
import { useOrder } from '@/contexts/OrderContext';
import { useToast } from '@/hooks/use-toast';
import { getStoreById } from '@/data/stores';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: (orderId: string) => void;
  storeId?: string;
  storeName?: string;
  isMultiStore?: boolean;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onSuccess, storeId, storeName, isMultiStore = false }) => {
  const { state: cartState, clearCart, getStoreCarts } = useCart();
  const { createOrder } = useOrder();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'wallet'>('cash');
  const [notes, setNotes] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Get store carts for multi-store orders
  const storeCarts = isMultiStore ? getStoreCarts() : [];
  
  // Calculate totals
  const subtotal = isMultiStore 
    ? storeCarts.reduce((sum, cart) => sum + cart.subtotal, 0)
    : cartState.total;
  
  const deliveryFee = isMultiStore 
    ? storeCarts.reduce((sum, cart) => sum + cart.deliveryFee, 0)
    : 20; // Default delivery fee
  
  const total = subtotal + deliveryFee;

  const handlePayment = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order(s)
      if (isMultiStore && storeCarts.length > 0) {
        // Create separate orders for each store
        const orderPromises = storeCarts.map(async (storeCart) => {
          const store = getStoreById(storeCart.storeId);
          return createOrder({
            storeId: storeCart.storeId,
            items: storeCart.items,
            totalAmount: storeCart.total,
            deliveryAddress,
            paymentMethod,
            notes: `${notes} (Multi-store order)`,
            customerName: 'Current User',
            storeName: storeCart.storeName
          });
        });
        
        const orders = await Promise.all(orderPromises);
        
        // Clear cart
        clearCart();
        
        toast({
          title: "Multi-Store Order Placed Successfully!",
          description: `Your orders from ${storeCarts.length} stores have been placed and will be delivered soon.`,
        });
        
        onSuccess(orders[0].id); // Use first order ID for success callback
      } else {
        // Single store order
        const order = await createOrder({
          storeId: storeId || '1',
          items: cartState.items,
          totalAmount: cartState.total,
          deliveryAddress,
          paymentMethod,
          notes,
          customerName: 'Current User',
          storeName: storeName || 'Store'
        });

        // Clear cart
        clearCart();

        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${order.id} has been placed and will be delivered in ${order.deliveryTime}`,
        });

        onSuccess(order.id);
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Order Details */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete delivery address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions for delivery..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet">Digital Wallet</Label>
                </div>
              </RadioGroup>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.cardName}
                      onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isMultiStore ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stores:</span>
                      <span className="font-medium">{storeCarts.length} stores</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Delivery Time:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        20-45 min
                      </span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Orders by Store</h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {storeCarts.map((storeCart) => (
                          <div key={storeCart.storeId} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-sm">{storeCart.storeName}</span>
                              <span className="text-sm text-gray-600">{storeCart.items.length} items</span>
                            </div>
                            <div className="space-y-1">
                              {storeCart.items.map((item) => (
                                <div key={item.product.id} className="flex justify-between text-xs">
                                  <span className="flex-1">{item.product.name} x {item.quantity}</span>
                                  <span>₹{item.product.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t">
                              <span>Subtotal:</span>
                              <span>₹{storeCart.subtotal}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>₹{deliveryFee}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Store:</span>
                      <span className="font-medium">{storeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Delivery Time:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        15-30 min
                      </span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Items ({cartState.itemCount})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {cartState.items.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-sm">
                            <span className="flex-1">{item.product.name} x {item.quantity}</span>
                            <span>₹{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{cartState.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>₹{cartState.total}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || (isMultiStore ? storeCarts.length === 0 : cartState.items.length === 0)}
            className="w-full h-12 text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Place Order - ₹{total}
              </div>
            )}
          </Button>

          {/* Security Notice */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Secure Payment</h4>
                  <p className="text-sm text-green-700">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
