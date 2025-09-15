import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from './ui/use-toast';
import { Product, products as initialProducts, PricePrediction } from '../data/products';
import { Store, stores } from '../data/stores';
import { Plus, Edit, Trash2, Package, AlertTriangle, Search, Filter, TrendingUp, Star, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

interface InventoryManagerProps {
  storeId: string;
}

const categories = [
  'Rice & Grains', 'Pulses', 'Cooking Oil', 'Dairy', 'Vegetables', 
  'Bakery', 'Spices', 'Beverages', 'Snacks', 'Personal Care', 
  'Household', 'Chicken', 'Mutton', 'Fish', 'Beef', 'Pork'
];

const units = ['kg', 'g', 'L', 'ml', 'piece', 'pack', 'loaf', '250g', '500g', '1kg', '1.5kg', '2kg', 'liter'];

export const InventoryManager: React.FC<InventoryManagerProps> = ({ storeId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Price prediction states
  const [predictions, setPredictions] = useState<Record<string, PricePrediction>>({});
  const [predictionLoading, setPredictionLoading] = useState<Record<string, boolean>>({});
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [selectedProductForPrediction, setSelectedProductForPrediction] = useState<Product | null>(null);
  
  // Feedback system states
  const [feedbacks, setFeedbacks] = useState<Record<string, { helpful: boolean; comment: string }>>({});
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackProductId, setFeedbackProductId] = useState<string>('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    mrp: '',
    salePrice: '',
    category: '',
    subCategory: '',
    brand: '',
    type: '',
    image: '📦',
    description: '',
    unit: '',
    stock: '',
    rating: '4.0'
  });

  const store = stores.find(s => s.id === storeId);

  useEffect(() => {
    // Load products for this store
    const storeProducts = initialProducts.filter(product => product.storeId === storeId);
    setProducts(storeProducts);
    setFilteredProducts(storeProducts);
  }, [storeId]);

  useEffect(() => {
    // Filter products based on search term, category, and stock status
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (stockFilter === 'Low Stock') {
      filtered = filtered.filter(product => product.stock <= 10);
    } else if (stockFilter === 'Out of Stock') {
      filtered = filtered.filter(product => product.stock === 0 || !product.isAvailable);
    } else if (stockFilter === 'In Stock') {
      filtered = filtered.filter(product => product.stock > 0 && product.isAvailable);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, stockFilter]);

  const generateNewId = () => {
    const maxId = Math.max(...initialProducts.map(p => parseInt(p.id)));
    return (maxId + 1).toString();
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.unit || !newProduct.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: generateNewId(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image,
      description: newProduct.description,
      unit: newProduct.unit,
      stock: parseInt(newProduct.stock),
      rating: parseFloat(newProduct.rating),
      storeId: storeId,
      isAvailable: true
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: '',
      price: '',
      mrp: '',
      salePrice: '',
      category: '',
      subCategory: '',
      brand: '',
      type: '',
      image: '📦',
      description: '',
      unit: '',
      stock: '',
      rating: '4.0'
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id ? editingProduct : product
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
    setIsEditDialogOpen(false);

    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    toast({
      title: "Success",
      description: "Product deleted successfully",
    });
  };

  const handleToggleAvailability = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, isAvailable: !product.isAvailable }
        : product
    ));

    const product = products.find(p => p.id === productId);
    toast({
      title: "Success",
      description: `Product ${product?.isAvailable ? 'marked as out of stock' : 'marked as available'}`,
    });
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, stock: newStock }
        : product
    ));

    toast({
      title: "Success",
      description: "Stock updated successfully",
    });
  };

  const getStockStatus = (product: Product) => {
    if (!product.isAvailable || product.stock === 0) {
      return { status: 'Out of Stock', color: 'bg-red-500' };
    } else if (product.stock <= 10) {
      return { status: 'Low Stock', color: 'bg-yellow-500' };
    } else {
      return { status: 'In Stock', color: 'bg-green-500' };
    }
  };

  const lowStockCount = products.filter(p => p.stock <= 10 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0 || !p.isAvailable).length;

  const predictPrice = (product: Product) => {
    setPredictionLoading(prev => ({ ...prev, [product.id]: true }));
    // Simulate prediction API call
    setTimeout(() => {
      const prediction: PricePrediction = {
        predictedMRP: product.price * 1.2,
        predictedSalePrice: product.price * 0.8,
        finalPrice: product.price * 0.9,
        confidence: 0.85,
        pricingLogicApplied: {
          reduction: 0.1
        }
      };
      setPredictions(prev => ({ ...prev, [product.id]: prediction }));
      setPredictionLoading(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const applyPredictedPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedProduct = { ...product, price: predictions[productId].finalPrice };
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      setPredictions(prev => ({ ...prev, [productId]: null }));
    }
  };

  const openFeedbackDialog = (productId: string) => {
    setFeedbackProductId(productId);
    setShowFeedbackDialog(true);
  };

  const handleFeedback = (helpful: boolean, comment: string) => {
    setFeedbacks(prev => ({ ...prev, [feedbackProductId]: { helpful, comment } }));
    setShowFeedbackDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">{store?.name}</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-xl font-bold">{products.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-xl font-bold">{lowStockCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-xl font-bold">{outOfStockCount}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Items</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subCategory">Sub Category</Label>
                      <Input
                        id="subCategory"
                        value={newProduct.subCategory}
                        onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                        placeholder="Enter sub category"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mrp">MRP (₹)</Label>
                      <Input
                        id="mrp"
                        type="number"
                        value={newProduct.mrp}
                        onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                        placeholder="Enter MRP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salePrice">Sale Price (₹)</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        value={newProduct.salePrice}
                        onChange={(e) => setNewProduct({ ...newProduct, salePrice: parseFloat(e.target.value) || 0 })}
                        placeholder="Enter sale price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Product Type</Label>
                      <Input
                        id="type"
                        value={newProduct.type}
                        onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                        placeholder="Enter product type"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="Enter stock quantity"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>
                    <div className="col-span-2">
                      <Button 
                        onClick={() => {}} 
                        variant="outline" 
                        className="w-full mb-4"
                        disabled={!newProduct.name || !newProduct.category}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Predict Optimal Pricing
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddProduct} className="flex-1">Add Product</Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          return (
            <Card key={product.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{product.image}</span>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <Badge className={`${stockStatus.color} text-white`}>
                    {stockStatus.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">₹{product.price}</span>
                    <span className="text-sm text-gray-600">per {product.unit}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Stock:</Label>
                    <Input
                      type="number"
                      value={product.stock}
                      onChange={(e) => handleUpdateStock(product.id, parseInt(e.target.value) || 0)}
                      className="w-20 h-8"
                      min="0"
                    />
                    <span className="text-sm text-gray-600">{product.unit}</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={product.isAvailable ? "destructive" : "default"}
                      onClick={() => handleToggleAvailability(product.id)}
                      className="flex-1"
                    >
                      {product.isAvailable ? "Mark Unavailable" : "Mark Available"}
                    </Button>
                    
                    <Dialog open={isEditDialogOpen && editingProduct?.id === product.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setEditingProduct(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct({ ...product })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        {editingProduct && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name">Product Name</Label>
                              <Input
                                id="edit-name"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit-price">Price (₹)</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={editingProduct.price}
                                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-stock">Stock</Label>
                                <Input
                                  id="edit-stock"
                                  type="number"
                                  value={editingProduct.stock}
                                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleEditProduct} className="flex-1">Save Changes</Button>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => predictPrice(product)}
                        disabled={predictionLoading[product.id]}
                      >
                        {predictionLoading[product.id] ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        )}
                        Predict Price
                      </Button>

                      {predictions[product.id] && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => applyPredictedPrice(product.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Apply ₹{predictions[product.id].finalPrice}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openFeedbackDialog(product.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Feedback
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Price Prediction Results */}
                    {predictions[product.id] && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">Prediction Results</span>
                          <Badge className="bg-green-500 text-white text-xs">
                            {predictions[product.id].confidence >= 0.8 ? 'High' : 
                             predictions[product.id].confidence >= 0.6 ? 'Medium' : 'Low'} Confidence
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-center text-sm">
                          <div className="bg-white p-2 rounded">
                            <div className="text-xs text-gray-500">Sale Price</div>
                            <div className="font-bold text-gray-700 line-through">₹{predictions[product.id].predictedSalePrice}</div>
                          </div>
                          <div className="bg-white p-2 rounded border-2 border-purple-200">
                            <div className="text-xs text-purple-600 font-medium">Final Price</div>
                            <div className="font-bold text-purple-600">₹{predictions[product.id].finalPrice}</div>
                          </div>
                        </div>

                        <div className="mt-2 text-xs">
                          {predictions[product.id].pricingLogicApplied.reduction > 0 ? (
                            <div className="text-green-700 bg-green-100 p-1 rounded text-center">
                              ₹2 reduction applied (diff ≥ ₹5)
                            </div>
                          ) : (
                            <div className="text-orange-700 bg-orange-100 p-1 rounded text-center">
                              No reduction (diff &lt; ₹5)
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Feedback Display */}
                    {feedbacks[product.id] && (
                      <div className="mt-3 p-2 bg-gray-50 rounded border">
                        <div className="flex items-center gap-2 text-sm">
                          {feedbacks[product.id].helpful ? (
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-gray-600">
                            {feedbacks[product.id].helpful ? 'Helpful' : 'Not Helpful'}
                          </span>
                        </div>
                        {feedbacks[product.id].comment && (
                          <p className="text-xs text-gray-600 mt-1">"{feedbacks[product.id].comment}"</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'All' || stockFilter !== 'All'
                ? "Try adjusting your filters or search terms"
                : "Start by adding your first product to the inventory"
              }
            </p>
            {!searchTerm && selectedCategory === 'All' && stockFilter === 'All' && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
