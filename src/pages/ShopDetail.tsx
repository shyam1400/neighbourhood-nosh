import { useState } from "react";
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { getProductsByStore } from "@/data/products";
import { getStoreById } from "@/data/stores";
import CartModal from "@/components/CartModal";
import heroImage from "@/assets/hero-grocery-store.jpg";

const ShopDetail = () => {
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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/customer">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Stores
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Kiro</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
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

      {/* Conditional Rendering */}
      <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
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
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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