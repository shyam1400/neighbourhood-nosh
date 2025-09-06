import { ShoppingCart, Apple, Package, Milk, Zap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryGridProps {
  onCategorySelect?: (category: string) => void;
}

const categories = [
  { id: "groceries", name: "Groceries", icon: ShoppingCart, color: "bg-gradient-primary" },
  { id: "fruits", name: "Fresh Fruits", icon: Apple, color: "bg-gradient-secondary" },
  { id: "dairy", name: "Dairy & Eggs", icon: Milk, color: "bg-gradient-trusted" },
  { id: "packaged", name: "Packaged Foods", icon: Package, color: "bg-gradient-primary" },
  { id: "essentials", name: "Daily Essentials", icon: Zap, color: "bg-gradient-secondary" },
  { id: "personal", name: "Personal Care", icon: Heart, color: "bg-gradient-trusted" },
];

export function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card 
            key={category.id}
            className="cursor-pointer transition-all hover:shadow-medium hover:-translate-y-1"
            onClick={() => onCategorySelect?.(category.id)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-sm leading-tight">{category.name}</h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}