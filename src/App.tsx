import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TranslateProvider } from "@/contexts/TranslateContext";
import Index from "./pages/Index";
import CustomerLogin from "./pages/CustomerLogin";
import VendorLogin from "./pages/VendorLogin";
import DeliveryLogin from "./pages/DeliveryLogin";
import DeliverySignup from "./pages/DeliverySignup";
import CustomerApp from "./pages/CustomerApp";
import ShopDetail from "./pages/ShopDetail";
import VendorDashboard from "./pages/VendorDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import PricePredictionPage from "./pages/PricePredictionPage";
import NotFound from "./pages/NotFound";
import ContextualNotificationSystem from "./components/ContextualNotificationSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <TranslateProvider>
          <CartProvider>
            <OrderProvider>
              <BrowserRouter future={{ v7_startTransition: true }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/start-shopping" element={<CustomerLogin />} />
                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/vendor-login" element={<VendorLogin />} />
                <Route path="/delivery-login" element={<DeliveryLogin />} />
                <Route path="/delivery-signup" element={<DeliverySignup />} />
                <Route path="/customer" element={<CustomerApp />} />
                <Route path="/shop/:id" element={<ShopDetail />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/vendor" element={<VendorDashboard />} />
                <Route path="/delivery" element={<DeliveryDashboard />} />
                <Route path="/price-prediction" element={<PricePredictionPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
              <ContextualNotificationSystem />
              </BrowserRouter>
            </OrderProvider>
          </CartProvider>
        </TranslateProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
