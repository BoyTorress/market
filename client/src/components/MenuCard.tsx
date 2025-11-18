import { Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  inStock?: boolean;
  onAddToCart?: () => void;
}

export function MenuCard({ 
  id,
  name, 
  description, 
  price, 
  image, 
  category,
  inStock = true,
  onAddToCart 
}: MenuCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-menu-${id}`}>
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        {category && (
          <Badge className="absolute right-2 top-2" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="destructive">Agotado</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="mb-2 text-xl font-semibold" data-testid={`text-name-${id}`}>
          {name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground" data-testid={`text-description-${id}`}>
          {description}
        </p>
        <p className="text-lg font-bold text-primary" data-testid={`text-price-${id}`}>
          ${price.toFixed(2)}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          disabled={!inStock}
          onClick={() => {
            console.log(`Added ${name} to cart`);
            onAddToCart?.();
          }}
          data-testid={`button-add-to-cart-${id}`}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
