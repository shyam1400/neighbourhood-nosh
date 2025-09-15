import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Target, ShoppingCart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PricePrediction } from '@/data/products';

const sampleProducts = [
  {
    name: "Basmati Rice 1kg",
    category: "groceries",
    brand: "Tata",
    description: "Premium quality basmati rice for daily cooking",
    mrp: 150,
    salePrice: 120,
    price: 118
  },
  {
    name: "Fresh Milk 1L",
    category: "dairy",
    brand: "Amul",
    description: "Fresh cow milk, rich in calcium and proteins",
    mrp: 52,
    salePrice: 50,
    price: 50
  },
  {
    name: "Sunflower Oil 1L",
    category: "cooking-oil",
    brand: "Fortune",
    description: "Pure sunflower oil for healthy cooking",
    mrp: 180,
    salePrice: 150,
    price: 148
  },
  {
    name: "Organic Honey 500g",
    category: "sweeteners",
    brand: "Dabur",
    description: "Pure organic honey with natural sweetness",
    mrp: 220,
    salePrice: 180,
    price: 178
  }
];

const PricePredictionDemo: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [predictions, setPredictions] = useState<Record<string, PricePrediction>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const predictPrice = async (product: any, index: number) => {
    setLoading(prev => ({ ...prev, [index]: true }));
    
    try {
      // Simulate API call - in real implementation, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock prediction response based on product type
      const mockPrediction: PricePrediction = {
        predictedSalePrice: product.name.includes('Rice') ? 120 : 
                           product.name.includes('Milk') ? 60 :
                           product.name.includes('Oil') ? 150 : 180,
        predictedMRP: product.name.includes('Rice') ? 150 : 
                     product.name.includes('Milk') ? 75 :
                     product.name.includes('Oil') ? 180 : 220,
        confidence: 0.85,
        method: 'similarity_based',
        similarProductsCount: 8,
        finalPrice: 0,
        pricingLogicApplied: {
          original: 0,
          final: 0,
          reduction: 0,
          difference: 0
        }
      };

      // Apply pricing logic
      const priceDifference = mockPrediction.predictedMRP - mockPrediction.predictedSalePrice;
      if (priceDifference >= 5) {
        mockPrediction.finalPrice = mockPrediction.predictedSalePrice - 2;
        mockPrediction.pricingLogicApplied.reduction = 2;
      } else {
        mockPrediction.finalPrice = mockPrediction.predictedSalePrice;
        mockPrediction.pricingLogicApplied.reduction = 0;
      }
      
      mockPrediction.pricingLogicApplied.original = mockPrediction.predictedSalePrice;
      mockPrediction.pricingLogicApplied.final = mockPrediction.finalPrice;
      mockPrediction.pricingLogicApplied.difference = priceDifference;

      setPredictions(prev => ({ ...prev, [index]: mockPrediction }));
    } catch (error) {
      console.error('Price prediction failed:', error);
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Price Prediction Demo</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience our intelligent price prediction system that uses 38,000+ product data points 
          to suggest optimal pricing with smart discount logic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleProducts.map((product, index) => {
          const prediction = predictions[index];
          const isLoading = loading[index];

          return (
            <Card key={index} className="border-2 hover:border-green-200 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {product.name}
                </CardTitle>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  {product.brand && (
                    <Badge variant="secondary" className="text-xs ml-2">
                      {product.brand}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-left">
                      <div className="text-sm text-gray-500">Current Pricing</div>
                    </div>
                    <div className="text-right">
                      <div className="flex flex-col items-end space-y-1">
                        <div className="text-sm text-gray-500">MRP</div>
                        <div className="text-lg font-bold text-gray-700 line-through">₹{product.mrp}</div>
                        <div className="text-sm text-green-600 font-medium">Sale Price</div>
                        <div className="text-xl font-bold text-green-600">₹{product.salePrice}</div>
                        {product.price !== product.salePrice && (
                          <>
                            <div className="text-sm text-purple-600 font-medium">Final Price</div>
                            <div className="text-2xl font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">₹{product.price}</div>
                            <div className="text-xs text-purple-500">₹2 reduction applied</div>
                          </>
                        )}
                        {product.price === product.salePrice && (
                          <div className="text-xs text-gray-500 mt-1">No reduction (diff &lt; ₹5)</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => predictPrice(product, index)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Predict Price
                      </>
                    )}
                  </Button>

                  {prediction && !isLoading && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Prediction Results</span>
                        <Badge className={`${getConfidenceColor(prediction.confidence)} text-white text-xs`}>
                          {getConfidenceText(prediction.confidence)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Predicted MRP</div>
                          <div className="font-bold text-lg text-gray-700 line-through">₹{prediction.predictedMRP}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">Sale Price</div>
                          <div className="font-bold text-lg text-green-600">₹{prediction.predictedSalePrice}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm border-2 border-purple-200">
                          <div className="text-xs text-purple-600 mb-1 font-medium">Final Price</div>
                          <div className="font-bold text-xl text-purple-600">₹{prediction.finalPrice}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {prediction.pricingLogicApplied.reduction > 0 ? (
                          <div className="text-sm text-green-700 bg-green-100 p-2 rounded flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            ₹2 reduction applied (MRP - Sale Price = ₹{prediction.pricingLogicApplied.difference} ≥ ₹5)
                          </div>
                        ) : (
                          <div className="text-sm text-orange-700 bg-orange-100 p-2 rounded flex items-center">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            No reduction (MRP - Sale Price = ₹{prediction.pricingLogicApplied.difference} &lt; ₹5)
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          Based on {prediction.similarProductsCount} similar products from BigBasket dataset
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6" />
          How Our Pricing Logic Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-green-600 mb-2">Scenario A: Large Difference</h4>
            <div className="text-sm space-y-1">
              <div>MRP: ₹150, Sale: ₹120</div>
              <div>Difference: ₹30 (≥ ₹5)</div>
              <div className="font-bold text-purple-600">Final: ₹118 (₹2 discount applied)</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-blue-600 mb-2">Scenario B: Small Difference</h4>
            <div className="text-sm space-y-1">
              <div>MRP: ₹52, Sale: ₹50</div>
              <div>Difference: ₹2 (&lt; ₹5)</div>
              <div className="font-bold text-purple-600">Final: ₹50 (no discount)</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-orange-600 mb-2">Scenario C: Same Price</h4>
            <div className="text-sm space-y-1">
              <div>MRP: ₹75, Sale: ₹75</div>
              <div>Difference: ₹0 (&lt; ₹5)</div>
              <div className="font-bold text-purple-600">Final: ₹75 (no discount)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePredictionDemo;
