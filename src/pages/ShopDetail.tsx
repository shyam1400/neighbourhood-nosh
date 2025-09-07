import { useState } from "react";
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart, Heart, Plus, Minus, Navigation, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductsByStore } from "@/data/products";
import { getStoreById } from "@/data/stores";
import CartModal from "@/components/CartModal";
import MapView from "@/components/MapView";
import heroImage from "@/assets/hero-grocery-store.jpg";
import logoImage from "@/assets/logo.png";

const ShopDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const { addToCart, removeFromCart, getItemQuantity, getItemCount } = useCart();

  // Get store data from the stores data
  const storeData = getStoreById(id || '1');
  const store = storeData ? {
    ...storeData,
    image: heroImage,
    description: "Your neighborhood grocery store with fresh products and great prices."
  } : {
    id: id,
    name: "Store Not Found",
    address: "Address not available",
    rating: 0,
    deliveryTime: "N/A",
    distance: "N/A",
    image: heroImage,
    isOpen: false,
    description: "Store information not available."
  };

  const products = getProductsByStore(id || '1');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <Link to="/customer">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-xs">
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  {t('shopDetail.backToStores')}
                </Button>
              </Link>
              <div className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="Kiro Logo" 
                  className="w-20 h-20 rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-gray-600 text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                Bangalore, India
              </Button>
              <CartModal />
            </div>
          </div>
        </div>
      </header>

      {/* Store Info */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="lg:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
                  <p className="text-gray-600 text-lg">{store.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="text-lg font-semibold">{store.rating}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 mr-1" />
                  <span className="text-gray-600">{store.deliveryTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-1" />
                  <span className="text-gray-600">{store.distance}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                {store.address}
              </p>

              <Badge className={`px-4 py-2 text-lg ${
                store.isOpen 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-red-100 text-red-800 border-red-200"
              }`}>
                {store.isOpen ? "Open Now" : "Closed"}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Store Information Tabs */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="info">Store Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const quantity = getItemQuantity(product.id);
                  return (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.category}</p>
                            <p className="text-xs text-gray-500">₹{product.price} per {product.unit}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                            <div className="text-2xl mt-2">{product.image}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {quantity > 0 ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(product.id)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="text-lg font-semibold">{quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToCart(product)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(product)}
                              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="mt-6">
              <div className="space-y-6">
                {/* Store Location Map */}
                <Card>
                  <CardContent className="p-0">
                    <MapView
                      stores={[{
                        id: store.id,
                        name: store.name,
                        address: store.address,
                        latitude: 12.9716,
                        longitude: 77.5946,
                        rating: store.rating,
                        deliveryTime: store.deliveryTime,
                        distance: store.distance,
                        isOpen: store.isOpen
                      }]}
                      userLocation={{ lat: 12.9716, lng: 77.5946 }}
                      onStoreSelect={() => {}}
                      selectedStoreId={store.id}
                      showFilters={false}
                      showSearch={false}
                      height="h-96"
                    />
                  </CardContent>
                </Card>
                
                {/* Store Contact Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        Store Location
                      </h3>
                      <p className="text-gray-600 mb-4">{store.address}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Delivery Time: {store.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Distance: {store.distance}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-purple-600" />
                        Contact Store
                      </h3>
                      <div className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Store
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Store Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Store Name:</span>
                        <p className="text-gray-600">{store.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Address:</span>
                        <p className="text-gray-600">{store.address}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-gray-600">{store.rating}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <Badge className={`ml-2 ${
                          store.isOpen 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}>
                          {store.isOpen ? "Open Now" : "Closed"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Store Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {store.description}
                    </p>
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Why Choose This Store?</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Fresh products daily</li>
                        <li>• Competitive prices</li>
                        <li>• Fast delivery service</li>
                        <li>• Excellent customer service</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>


      {/* Cart Summary */}
      {getItemCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold">{getItemCount()} items in cart</span>
            </div>
            <CartModal />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDetail;