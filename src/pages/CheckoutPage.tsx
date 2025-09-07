import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, Clock, Package, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCart, StoreCart } from '@/contexts/CartContext';
import { useOrder } from '@/contexts/OrderContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { getStoreById } from '@/data/stores';
import DeliveryOptions, { DeliveryOption } from '@/components/DeliveryOptions';
import { getRandomDeliveryPerson } from '@/components/OrderSuccessModal';

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { state: cartState, clearCart, getStoreCarts } = useCart();
  const { createOrder } = useOrder();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'wallet'>('cash');
  const [notes, setNotes] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Get store carts for multi-store orders
  const storeCarts = getStoreCarts();
  const isMultiStore = storeCarts.length > 1;
  
  // Calculate totals
  const subtotal = cartState.total;
  const deliveryFee = isMultiStore ? storeCarts.length * 20 : 0;
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
          return createOrder({
            storeId: storeCart.storeId,
            items: storeCart.items,
            totalAmount: storeCart.total + storeCart.deliveryFee,
            deliveryAddress,
            paymentMethod,
            notes: `${notes} (Multi-store order)`,
            customerName: 'Current User',
            storeName: storeCart.storeName
          });
        });
        
        const orders = await Promise.all(orderPromises);
        const deliveryPerson = getRandomDeliveryPerson();
        
        // Prepare success page data
        const successData = {
          orderId: orders[0].id,
          storeCarts: storeCarts,
          totalAmount: total,
          deliveryAddress,
          paymentMethod,
          deliveryPerson,
          estimatedDeliveryTime: deliveryPerson.estimatedTime,
          isMultiStore: true
        };
        
        // Clear cart
        clearCart();
        
        // Navigate to success page with order data
        navigate('/order-success', { state: { orderData: successData } });
      } else if (storeCarts.length === 1) {
        // Single store order
        const storeCart = storeCarts[0];
        const order = await createOrder({
          storeId: storeCart.storeId,
          items: storeCart.items,
          totalAmount: storeCart.total,
          deliveryAddress,
          paymentMethod,
          notes,
          customerName: 'Current User',
          storeName: storeCart.storeName
        });
        
        const deliveryPerson = getRandomDeliveryPerson();
        
        // Prepare success page data
        const successData = {
          orderId: order.id,
          storeCarts: [storeCart],
          totalAmount: storeCart.total,
          deliveryAddress,
          paymentMethod,
          deliveryPerson,
          estimatedDeliveryTime: deliveryPerson.estimatedTime,
          isMultiStore: false
        };

        // Clear cart
        clearCart();

        // Navigate to success page with order data
        navigate('/order-success', { state: { orderData: successData } });
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

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('checkout.emptyCart')}</h2>
            <p className="text-gray-600 mb-6">{t('checkout.emptyCartDesc')}</p>
            <Button onClick={() => navigate('/customer')} className="w-full">
              {t('checkout.continueShopping')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/customer')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('checkout.backToShopping')}
          </Button>
          <h1 className="text-2xl font-bold">{t('checkout.title')}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Delivery Options */}
            <DeliveryOptions
              selectedOption={deliveryOption}
              onOptionSelect={setDeliveryOption}
              onDateTimeSelect={(date, time) => {
                setScheduledDate(date);
                setScheduledTime(time);
              }}
              scheduledDate={scheduledDate}
              scheduledTime={scheduledTime}
            />

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t('checkout.deliveryAddress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">{t('checkout.fullAddress')}</Label>
                    <Textarea
                      id="address"
                      placeholder={t('checkout.addressPlaceholder')}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">{t('checkout.deliveryNotes')}</Label>
                    <Textarea
                      id="notes"
                      placeholder={t('checkout.notesPlaceholder')}
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
                  {t('checkout.paymentMethod')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">{t('checkout.cashOnDelivery')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">{t('checkout.creditCard')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi">{t('checkout.upiPayment')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet">{t('checkout.digitalWallet')}</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4">
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
                  {t('checkout.orderSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isMultiStore ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{t('checkout.stores')}:</span>
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
                        <h4 className="font-medium mb-2">{t('checkout.ordersByStore')}</h4>
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
                                <span>{t('common.subtotal')}:</span>
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
                        <span className="text-sm text-gray-600">{t('checkout.store')}:</span>
                        <span className="font-medium">{storeCarts[0]?.storeName || 'Store'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Delivery Time:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          15-30 min
                        </span>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">{t('checkout.items')} ({cartState.itemCount})</h4>
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
                          <span className="text-green-600">{t('common.free')}</span>
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
              disabled={isProcessing}
              className="w-full h-12 text-lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('checkout.processingPayment')}...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t('checkout.placeOrder')} - ₹{total}
                </div>
              )}
            </Button>

            {/* Security Notice */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">{t('checkout.securePayment')}</h4>
                    <p className="text-sm text-green-700">
                      {t('checkout.securePaymentDesc')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;
