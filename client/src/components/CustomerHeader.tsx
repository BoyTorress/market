import { ShoppingCart, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";

interface CustomerHeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function CustomerHeader({ cartItemCount = 0, onCartClick }: CustomerHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <a className="flex items-center gap-2 font-serif text-xl font-bold" data-testid="link-home">
            <span className="text-primary">Market</span>
            <span>Express</span>
          </a>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/menu">
            <a className="text-sm font-medium transition-colors hover:text-primary" data-testid="link-menu">
              Menú
            </a>
          </Link>
          <Link href="/my-orders">
            <a className="text-sm font-medium transition-colors hover:text-primary" data-testid="link-my-orders">
              Mis Pedidos
            </a>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" data-testid="button-profile">
            <User className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative" 
            onClick={onCartClick}
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge 
                className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                data-testid="badge-cart-count"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
