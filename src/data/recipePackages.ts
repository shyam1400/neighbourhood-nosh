export interface RecipePackage {
  id: string;
  name: string;
  nameKey: string; // Translation key
  description: string;
  descriptionKey: string; // Translation key
  image: string;
  serves: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number; // Percentage
  ingredients: {
    productId: string;
    productName: string;
    productNameKey: string; // Translation key
    quantity: string;
    unit: string;
  }[];
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
}

export const recipePackages: RecipePackage[] = [
  {
    id: 'recipe_1',
    name: 'Chicken Biryani',
    nameKey: 'recipe.chickenBiryani',
    description: 'Aromatic basmati rice with tender chicken and fragrant spices',
    descriptionKey: 'recipe.chickenBiryaniDesc',
    image: '🍗',
    serves: 4,
    originalPrice: 850,
    discountedPrice: 765,
    discount: 10,
    ingredients: [
      { productId: '33', productName: 'Fresh Chicken 1kg', productNameKey: 'recipe.chicken1kg', quantity: '1', unit: 'kg' },
      { productId: '1', productName: 'Basmati Rice 1kg', productNameKey: 'recipe.basmatiRice', quantity: '500', unit: 'g' },
      { productId: '77', productName: 'Turmeric Powder 100g', productNameKey: 'recipe.turmeric', quantity: '50', unit: 'g' },
      { productId: '78', productName: 'Red Chili Powder 100g', productNameKey: 'recipe.redChili', quantity: '30', unit: 'g' },
      { productId: '72', productName: 'Onions 1kg', productNameKey: 'recipe.onions', quantity: '500', unit: 'g' },
      { productId: '73', productName: 'Tomatoes 1kg', productNameKey: 'recipe.tomatoes', quantity: '300', unit: 'g' }
    ],
    cookingTime: '45 min',
    difficulty: 'Medium',
    category: 'Non-Veg',
    tags: ['Spicy', 'Rice', 'Chicken']
  },
  {
    id: 'recipe_2',
    name: 'Dal Rice',
    nameKey: 'recipe.dalRice',
    description: 'Comforting dal with steamed rice - a perfect meal',
    descriptionKey: 'recipe.dalRiceDesc',
    image: '🍚',
    serves: 3,
    originalPrice: 180,
    discountedPrice: 162,
    discount: 10,
    ingredients: [
      { productId: '2', productName: 'Sona Masoori Rice 1kg', productNameKey: 'recipe.sonaRice', quantity: '300', unit: 'g' },
      { productId: '4', productName: 'Toor Dal 1kg', productNameKey: 'recipe.toorDal', quantity: '200', unit: 'g' },
      { productId: '77', productName: 'Turmeric Powder 100g', productNameKey: 'recipe.turmeric', quantity: '20', unit: 'g' },
      { productId: '72', productName: 'Onions 1kg', productNameKey: 'recipe.onions', quantity: '200', unit: 'g' },
      { productId: '73', productName: 'Tomatoes 1kg', productNameKey: 'recipe.tomatoes', quantity: '150', unit: 'g' }
    ],
    cookingTime: '25 min',
    difficulty: 'Easy',
    category: 'Veg',
    tags: ['Comfort Food', 'Rice', 'Dal']
  },
  {
    id: 'recipe_3',
    name: 'Vegetable Curry',
    nameKey: 'recipe.vegetableCurry',
    description: 'Mixed vegetables in a rich, flavorful curry',
    descriptionKey: 'recipe.vegetableCurryDesc',
    image: '🥘',
    serves: 4,
    originalPrice: 320,
    discountedPrice: 288,
    discount: 10,
    ingredients: [
      { productId: '72', productName: 'Onions 1kg', productNameKey: 'recipe.onions', quantity: '300', unit: 'g' },
      { productId: '73', productName: 'Tomatoes 1kg', productNameKey: 'recipe.tomatoes', quantity: '400', unit: 'g' },
      { productId: '74', productName: 'Potatoes 1kg', productNameKey: 'recipe.potatoes', quantity: '500', unit: 'g' },
      { productId: '77', productName: 'Turmeric Powder 100g', productNameKey: 'recipe.turmeric', quantity: '30', unit: 'g' },
      { productId: '78', productName: 'Red Chili Powder 100g', productNameKey: 'recipe.redChili', quantity: '25', unit: 'g' },
      { productId: '67', productName: 'Coconut Oil 1L', productNameKey: 'recipe.coconutOil', quantity: '50', unit: 'ml' }
    ],
    cookingTime: '30 min',
    difficulty: 'Easy',
    category: 'Veg',
    tags: ['Healthy', 'Vegetables', 'Curry']
  },
  {
    id: 'recipe_4',
    name: 'Egg Fried Rice',
    nameKey: 'recipe.eggFriedRice',
    description: 'Quick and delicious egg fried rice with vegetables',
    descriptionKey: 'recipe.eggFriedRiceDesc',
    image: '🍳',
    serves: 3,
    originalPrice: 280,
    discountedPrice: 252,
    discount: 10,
    ingredients: [
      { productId: '2', productName: 'Sona Masoori Rice 1kg', productNameKey: 'recipe.sonaRice', quantity: '400', unit: 'g' },
      { productId: '72', productName: 'Onions 1kg', productNameKey: 'recipe.onions', quantity: '200', unit: 'g' },
      { productId: '73', productName: 'Tomatoes 1kg', productNameKey: 'recipe.tomatoes', quantity: '150', unit: 'g' },
      { productId: '77', productName: 'Turmeric Powder 100g', productNameKey: 'recipe.turmeric', quantity: '15', unit: 'g' },
      { productId: '67', productName: 'Coconut Oil 1L', productNameKey: 'recipe.coconutOil', quantity: '30', unit: 'ml' }
    ],
    cookingTime: '20 min',
    difficulty: 'Easy',
    category: 'Non-Veg',
    tags: ['Quick', 'Rice', 'Egg']
  },
  {
    id: 'recipe_5',
    name: 'Paneer Butter Masala',
    nameKey: 'recipe.paneerButterMasala',
    description: 'Creamy paneer in rich tomato and butter gravy',
    descriptionKey: 'recipe.paneerButterMasalaDesc',
    image: '🧀',
    serves: 4,
    originalPrice: 450,
    discountedPrice: 405,
    discount: 10,
    ingredients: [
      { productId: '72', productName: 'Onions 1kg', productNameKey: 'recipe.onions', quantity: '300', unit: 'g' },
      { productId: '73', productName: 'Tomatoes 1kg', productNameKey: 'recipe.tomatoes', quantity: '500', unit: 'g' },
      { productId: '77', productName: 'Turmeric Powder 100g', productNameKey: 'recipe.turmeric', quantity: '20', unit: 'g' },
      { productId: '78', productName: 'Red Chili Powder 100g', productNameKey: 'recipe.redChili', quantity: '30', unit: 'g' },
      { productId: '67', productName: 'Coconut Oil 1L', productNameKey: 'recipe.coconutOil', quantity: '40', unit: 'ml' },
      { productId: '71', productName: 'Butter 100g', productNameKey: 'recipe.butter', quantity: '50', unit: 'g' }
    ],
    cookingTime: '35 min',
    difficulty: 'Medium',
    category: 'Veg',
    tags: ['Rich', 'Paneer', 'Creamy']
  }
];

export const getRecipePackages = () => recipePackages;

export const getRecipePackageById = (id: string) => {
  return recipePackages.find(pkg => pkg.id === id);
};

export const getRecipePackagesByCategory = (category: string) => {
  return recipePackages.filter(pkg => pkg.category === category);
};
