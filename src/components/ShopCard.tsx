import { Star, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ShopCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  categories: string[];
  isTrusted?: boolean;
  onClick?: () => void;
}

export function ShopCard({
  id,
  name,
  image,
  rating,
  deliveryTime,
  distance,
  categories,
  isTrusted = false,
  onClick
}: ShopCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/shop/${id}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-medium hover:-translate-y-1"
      onClick={handleClick}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {isTrusted && (
          <Badge className="absolute top-2 right-2 bg-gradient-trusted text-trusted-foreground border-0">
            Trusted
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate mr-2">{name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span>{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 3).map((category, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-primary-soft text-primary"
            >
              {category}
            </Badge>
          ))}
          {categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{categories.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}