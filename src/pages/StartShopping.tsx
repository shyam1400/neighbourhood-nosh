import { useState } from "react";
import { ArrowLeft, Search, MapPin, Star, Clock, ShoppingCart, Heart, Filter, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import kiranaImage from "@/assets/hero-grocery-store.jpg";

const StartShopping = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const categories = [
    { id: "all", name: "All Items", icon: "🛍️" },
    { id: "groceries", name: "Groceries", icon: "🥬" },
    { id: "snacks", name: "Snacks", icon: "🍿" },
    { id: "beverages", name: "Beverages", icon: "🥤" },
    { id: "dairy", name: "Dairy", icon: "🥛" },
    { id: "fruits", name: "Fruits", icon: "🍎" }
  ];

  const stores = [
    {
      id: 1,
      name: "Raju's Kirana Store",
      address: "123, MG Road, Koramangala, Bangalore - 560034",
      rating: 4.8,
      deliveryTime: "15-20 min",
      distance: "0.5 km",
      image: kiranaImage,
      category: "groceries",
      isOpen: true,
      description: "Fresh groceries and daily essentials"
    },
    {
      id: 2,
      name: "Fresh Corner",
      address: "456, Brigade Road, Indiranagar, Bangalore - 560008",
      rating: 4.6,
      deliveryTime: "20-25 min",
      distance: "0.8 km",
      image: kiranaImage,
      category: "fruits",
      isOpen: true,
      description: "Fresh fruits and vegetables"
    },
    {
      id: 3,
      name: "Quick Mart",
      address: "789, Commercial Street, Shivajinagar, Bangalore - 560001",
      rating: 4.7,
      deliveryTime: "10-15 min",
      distance: "0.3 km",
      image: kiranaImage,
      category: "snacks",
      isOpen: false,
      description: "Snacks and beverages"
    },
    {
      id: 4,
      name: "Milk & More",
      address: "321, Residency Road, Richmond Town, Bangalore - 560025",
      rating: 4.5,
      deliveryTime: "12-18 min",
      distance: "0.6 km",
      image: kiranaImage,
      category: "dairy",
      isOpen: true,
      description: "Fresh dairy products"
    }
  ];

  const items = [
    // Groceries
    { id: 1, name: "Basmati Rice 1kg", price: 120, category: "groceries", storeId: 1, image: kiranaImage },
    { id: 2, name: "Toor Dal 500g", price: 80, category: "groceries", storeId: 1, image: kiranaImage },
    { id: 3, name: "Sunflower Oil 1L", price: 150, category: "groceries", storeId: 1, image: kiranaImage },
    { id: 4, name: "Wheat Flour 1kg", price: 45, category: "groceries", storeId: 1, image: kiranaImage },
    { id: 5, name: "Sugar 1kg", price: 42, category: "groceries", storeId: 1, image: kiranaImage },
    
    // Fruits
    { id: 6, name: "Fresh Apples 1kg", price: 180, category: "fruits", storeId: 2, image: kiranaImage },
    { id: 7, name: "Bananas 1 dozen", price: 60, category: "fruits", storeId: 2, image: kiranaImage },
    { id: 8, name: "Oranges 1kg", price: 120, category: "fruits", storeId: 2, image: kiranaImage },
    { id: 9, name: "Grapes 500g", price: 100, category: "fruits", storeId: 2, image: kiranaImage },
    
    // Snacks
    { id: 10, name: "Biscuits Pack", price: 25, category: "snacks", storeId: 3, image: kiranaImage },
    { id: 11, name: "Chips Pack", price: 30, category: "snacks", storeId: 3, image: kiranaImage },
    { id: 12, name: "Namkeen Mix", price: 50, category: "snacks", storeId: 3, image: kiranaImage },
    
    // Beverages
    { id: 13, name: "Coca Cola 500ml", price: 35, category: "beverages", storeId: 3, image: kiranaImage },
    { id: 14, name: "Orange Juice 1L", price: 80, category: "beverages", storeId: 3, image: kiranaImage },
    { id: 15, name: "Tea Leaves 250g", price: 120, category: "beverages", storeId: 3, image: kiranaImage },
    
    // Dairy
    { id: 16, name: "Fresh Milk 1L", price: 60, category: "dairy", storeId: 4, image: kiranaImage },
    { id: 17, name: "Butter 100g", price: 45, category: "dairy", storeId: 4, image: kiranaImage },
    { id: 18, name: "Cheese 200g", price: 80, category: "dairy", storeId: 4, image: kiranaImage },
    { id: 19, name: "Yogurt 500g", price: 40, category: "dairy", storeId: 4, image: kiranaImage }
  ];

  const filteredItems = items.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = items.find(i => i.id.toString() === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItems = () => {
    return Object.entries(cart).map(([itemId, quantity]) => {
      const item = items.find(i => i.id.toString() === itemId);
      return item ? { ...item, quantity } : null;
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
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
              <Button variant="ghost" size="sm" className="text-gray-600 relative">
                <ShoppingCart className="w-4 h-4" />
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Shop from Local Stores
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Browse items from nearby kirana stores and add them to your cart for quick delivery.
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg rounded-full border-0 focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-full ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "all" ? "All Items" : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {stores.find(s => s.id === item.storeId)?.name}
                        </p>
                        <p className="text-xl font-bold text-gray-900 mb-4">₹{item.price}</p>
                        <div className="flex items-center space-x-2">
                          {cart[item.id.toString()] ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(item.id.toString())}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="text-lg font-semibold">{cart[item.id.toString()]}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToCart(item.id.toString())}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(item.id.toString())}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Shopping Cart</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {getCartCount()} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getCartItems().length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {getCartItems().map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id.toString())}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(item.id.toString())}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-lg font-bold text-gray-900">₹{getCartTotal()}</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop from These Stores
            </h2>
            <p className="text-xl text-gray-600">
              Browse items from local kirana stores in your area
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stores.map((store) => (
              <Link key={store.id} to={`/shop/${store.id}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-white/90 hover:bg-white text-gray-600 rounded-full p-2"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className={`px-3 py-1 rounded-full ${
                          store.isOpen 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}>
                          {store.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {store.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{store.description}</p>
                      <p className="text-gray-500 text-xs mb-4 flex items-start">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        {store.address}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {store.rating}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {store.deliveryTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {store.distance}
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
                        View Store
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StartShopping; 