import { useState } from "react";
import { Search, MapPin, User, ArrowLeft, Star, Clock, ShoppingCart, Heart, Filter, Bell, Zap, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { products, getProductsByCategory } from "@/data/products";
import { stores, getStoreById } from "@/data/stores";
import MapView from "@/components/MapView";
import NotificationSystem from "@/components/NotificationSystem";
import CartModal from "@/components/CartModal";
import UserProfile from "@/components/UserProfile";
import LocationSelector from "@/components/LocationSelector";
import LogoutDialog from "@/components/LogoutDialog";
import LanguageSelector from "@/components/LanguageSelector";
import TranslateButton from "@/components/TranslateButton";
import RecipePackages from "@/components/RecipePackages";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-grocery-store.jpg";
import logoImage from "@/assets/logo.png";

const CustomerApp = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("stores");
  const [currentLocation, setCurrentLocation] = useState({
    id: '1',
    name: 'Koramangala',
    address: 'Koramangala, Bangalore',
    city: 'Bangalore',
    pincode: '560034',
    coordinates: { lat: 12.9352, lng: 77.6245 }
  });
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { addToCart, getItemCount, getItemQuantity, updateQuantity } = useCart();

  const handleCheckout = () => {
    // Navigate to checkout or show checkout modal
    console.log('Navigate to checkout');
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    // Navigate to home page
    window.location.href = '/';
  };

  const handleContinueShopping = () => {
    setShowLogoutDialog(false);
    // Stay on current page
  };

  const handleBackClick = () => {
    setShowLogoutDialog(true);
  };

  const localStores = stores.map(store => ({
    ...store,
    image: heroImage,
    offers: ["Free delivery on ₹200+"],
    speciality: "Fresh products daily",
    color: "teal"
  }));

  const categories = [
    { name: "All", nameKey: "common.all", icon: "🛒", color: "blue" },
    { name: "Rice & Grains", nameKey: "category.riceGrains", icon: "🌾", color: "emerald" },
    { name: "Pulses", nameKey: "category.pulses", icon: "🫘", color: "orange" },
    { name: "Cooking Oil", nameKey: "category.cookingOil", icon: "🫒", color: "yellow" },
    { name: "Dairy", nameKey: "category.dairy", icon: "🥛", color: "cyan" },
    { name: "Vegetables", nameKey: "category.vegetables", icon: "🥕", color: "green" },
    { name: "Bakery", nameKey: "category.bakery", icon: "🍞", color: "amber" },
    { name: "Spices", nameKey: "category.spices", icon: "🌶️", color: "red" },
    { name: "Beverages", nameKey: "category.beverages", icon: "☕", color: "brown" },
    { name: "Snacks", nameKey: "category.snacks", icon: "🍪", color: "orange" },
    { name: "Chicken", nameKey: "category.chicken", icon: "🍗", color: "orange" },
    { name: "Mutton", nameKey: "category.mutton", icon: "🥩", color: "red" },
    { name: "Fish", nameKey: "category.fish", icon: "🐟", color: "blue" },
    { name: "Beef", nameKey: "category.beef", icon: "🥩", color: "red" },
    { name: "Pork", nameKey: "category.pork", icon: "🥓", color: "pink" },
    { name: "Personal Care", nameKey: "category.personalCare", icon: "🧴", color: "indigo" },
    { name: "Household", nameKey: "category.household", icon: "🧽", color: "slate" }
  ];

  const featuredProducts = getProductsByCategory(selectedCategory).slice(0, 4);

  const quickActions = [
    { icon: Zap, title: "Express Delivery", desc: "15 min delivery", color: "yellow" },
    { icon: Bell, title: "Special Offers", desc: "Exclusive deals", color: "pink" },
    { icon: Star, title: "Top Rated", desc: "Best stores", color: "purple" },
    { icon: Heart, title: "Favorites", desc: "Your picks", color: "red" }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "from-purple-500 to-violet-500",
      teal: "from-teal-500 to-cyan-500",
      cyan: "from-cyan-500 to-blue-500",
      indigo: "from-indigo-500 to-purple-500",
      violet: "from-violet-500 to-purple-500",
      emerald: "from-emerald-500 to-teal-500",
      slate: "from-slate-500 to-gray-500",
      orange: "from-orange-500 to-red-500",
      pink: "from-pink-500 to-rose-500",
      red: "from-red-500 to-pink-500"
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackClick}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="Kiro Logo" 
                  className="w-14 h-14 rounded-xl object-cover shadow-lg"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <TranslateButton />
              <LocationSelector
                currentLocation={currentLocation}
                onLocationSelect={setCurrentLocation}
                userType="customer"
              />
              
              <NotificationSystem userId="customer_1" userRole="customer" />
              
                <CartModal />
              
              <UserProfile
                userType="customer"
                userName="John Doe"
                userEmail="john@example.com"
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              Order from Local Stores
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Fresh groceries from your trusted neighborhood stores in 15 minutes
            </p>
            
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search for products or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white text-gray-900 text-lg rounded-xl border-0 shadow-lg focus:ring-4 focus:ring-white/30"
              />
              <Button className="absolute right-2 top-2 h-8 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Quick Actions */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardContent className="p-0 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(action.color)} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">{action.title}</h4>
                  <p className="text-gray-600 text-sm">{action.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stores and Map Tabs */}
        <section>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="stores" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Stores
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Map View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stores" className="space-y-8">
              {/* Categories */}
              <section>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Shop by Category</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedCategory === category.name 
                          ? `bg-gradient-to-br ${getColorClasses(category.color)} text-white border-transparent shadow-lg` 
                          : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-sm font-medium">{t(category.nameKey)}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Featured Products */}
              <section>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Popular Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {featuredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{product.image}</div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-900">{product.name}</h4>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <p className="text-purple-600 font-bold text-lg">₹{product.price}</p>
                          <p className="text-gray-500 text-xs">per {product.unit}</p>
                        </div>
                        {getItemQuantity(product.id) > 0 ? (
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 rounded-full"
                              onClick={() => updateQuantity(product.id, getItemQuantity(product.id) - 1)}
                            >
                              -
                            </Button>
                            <span className="font-bold text-lg min-w-[2rem] text-center">
                              {getItemQuantity(product.id)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 rounded-full"
                              onClick={() => updateQuantity(product.id, getItemQuantity(product.id) + 1)}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold"
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Recipe Packages */}
              <RecipePackages />

              {/* Local Stores */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Local Stores Near You</h3>
                  <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1">
                    {localStores.filter(store => store.isOpen).length} stores open
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {localStores.map((store) => (
                    <Card 
                      key={store.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                        !store.isOpen ? 'opacity-60' : ''
                      }`}
                      onClick={() => window.open(`/shop/${store.id}`, '_self')}
                    >
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Store Image */}
                          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-l-lg">
                            <img 
                              src={store.image} 
                              alt={store.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Store Details */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-lg text-gray-900">{store.name}</h4>
                                  {!store.isOpen && (
                                    <Badge variant="secondary" className="text-xs">Closed</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{store.speciality}</p>
                              </div>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-500">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{store.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{store.deliveryTime}</span>
                              </div>
                              <span>• {store.distance} away</span>
                            </div>
                            
                            {/* Categories */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {store.categories.slice(0, 3).map((category, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline" 
                                  className="text-xs border-purple-200 text-purple-700"
                                >
                                  {category}
                                </Badge>
                              ))}
                              {store.categories.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{store.categories.length - 3} more
                                </Badge>
                              )}
                            </div>
                            
                            {/* Offers */}
                            {store.offers.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-100 text-emerald-800 text-xs font-bold">
                                  {store.offers[0]}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </TabsContent>

        <TabsContent value="map">
          <MapView 
            stores={localStores}
            userLocation={{ lat: 12.9716, lng: 77.5946 }}
            onStoreSelect={(store) => window.open(`/shop/${store.id}`, '_self')}
            showFilters={true}
            showSearch={true}
            height="h-[500px]"
          />
        </TabsContent>
          </Tabs>
        </section>

        {/* Why Kiro */}
        <section className="bg-white p-8 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Why Choose Kiro?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold mb-2 text-gray-900">15-Min Delivery</h4>
              <p className="text-gray-600 text-sm">Lightning fast delivery from nearby local stores</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold mb-2 text-gray-900">Fresh Products</h4>
              <p className="text-gray-600 text-sm">Quality groceries from trusted local stores</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold mb-2 text-gray-900">Support Local</h4>
              <p className="text-gray-600 text-sm">Help your neighborhood local stores grow</p>
            </div>
          </div>
        </section>
      </div>

      {/* Logout Dialog */}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onLogout={handleLogout}
        onContinueShopping={handleContinueShopping}
        userType="customer"
      />
    </div>
  );
};

export default CustomerApp;