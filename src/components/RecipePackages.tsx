import React, { useState } from 'react';
import { Clock, Users, ChefHat, Star, ShoppingCart, Percent, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { recipePackages, RecipePackage } from '@/data/recipePackages';
import { getProductById } from '@/data/products';

interface RecipePackagesProps {
  onAddToCart?: (packageId: string) => void;
}

const RecipePackages: React.FC<RecipePackagesProps> = ({ onAddToCart }) => {
  const { t } = useLanguage();
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const [packageQuantities, setPackageQuantities] = useState<Record<string, number>>({});

  const handleAddPackage = (recipePackage: RecipePackage) => {
    // Add all ingredients from the package to cart
    recipePackage.ingredients.forEach(ingredient => {
      const product = getProductById(ingredient.productId);
      if (product) {
        // Calculate quantity based on the recipe requirement
        const quantity = Math.ceil(parseFloat(ingredient.quantity) / 1000); // Convert grams to kg for calculation
        for (let i = 0; i < quantity; i++) {
          addToCart(product);
        }
      }
    });

    // Update package quantity
    setPackageQuantities(prev => ({
      ...prev,
      [recipePackage.id]: (prev[recipePackage.id] || 0) + 1
    }));

    if (onAddToCart) {
      onAddToCart(recipePackage.id);
    }
  };

  const handleUpdateQuantity = (packageId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove package from quantities
      setPackageQuantities(prev => {
        const updated = { ...prev };
        delete updated[packageId];
        return updated;
      });
    } else {
      setPackageQuantities(prev => ({
        ...prev,
        [packageId]: newQuantity
      }));
    }
  };

  const getPackageQuantity = (packageId: string) => {
    return packageQuantities[packageId] || 0;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-orange-500" />
          {t('recipe.packages')}
        </h3>
        <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
          <Percent className="w-3 h-3 mr-1" />
          {t('recipe.discount')}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipePackages.map((recipePackage) => (
          <Card key={recipePackage.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {recipePackage.image}
                </div>
                <Badge className={getDifficultyColor(recipePackage.difficulty)}>
                  {recipePackage.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {t(recipePackage.nameKey)}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Recipe Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{recipePackage.serves} {t('recipe.persons')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipePackage.cookingTime}</span>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                  {t('recipe.ingredients')}:
                </h4>
                <div className="space-y-1">
                  {recipePackage.ingredients.slice(0, 3).map((ingredient, index) => (
                    <div key={index} className="text-xs text-gray-600 flex justify-between">
                      <span>{t(ingredient.productNameKey)}</span>
                      <span>{ingredient.quantity} {ingredient.unit}</span>
                    </div>
                  ))}
                  {recipePackage.ingredients.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{recipePackage.ingredients.length - 3} more ingredients
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    ₹{recipePackage.discountedPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{recipePackage.originalPrice}
                  </span>
                </div>
                <div className="text-xs text-green-600 font-semibold">
                  {recipePackage.discount}% OFF
                </div>
              </div>

              {/* Add to Cart Button or Quantity Controls */}
              {getPackageQuantity(recipePackage.id) > 0 ? (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() => handleUpdateQuantity(recipePackage.id, getPackageQuantity(recipePackage.id) - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-bold text-lg min-w-[2rem] text-center">
                    {getPackageQuantity(recipePackage.id)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() => handleUpdateQuantity(recipePackage.id, getPackageQuantity(recipePackage.id) + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleAddPackage(recipePackage)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('recipe.addPackage')}
                </Button>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {recipePackage.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RecipePackages;
