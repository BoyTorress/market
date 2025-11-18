import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CustomerHeader } from "@/components/CustomerHeader";
import { Hero } from "@/components/Hero";
import { MenuCard } from "@/components/MenuCard";
import { CartSidebar } from "@/components/CartSidebar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MenuItem } from "@shared/schema";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch user info
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: searchQuery ? ["/api/menu/search", searchQuery] : ["/api/menu"],
    queryFn: () => {
      const url = searchQuery
        ? `/api/menu/search?q=${encodeURIComponent(searchQuery)}`
        : "/api/menu";
      return fetch(url).then((res) => res.json());
    },
  });

  // Local cart state (could be persisted to localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage when cart changes
  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const addToCart = (item: MenuItem) => {
    const newItems = [...cartItems];
    const existing = newItems.find((i) => i.id === item.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      newItems.push({
        id: item.id,
        name: item.name,
        price: item.priceCents / 100,
        quantity: 1,
        image: item.imageUrl,
      });
    }
    
    updateCart(newItems);
    toast({
      title: "Agregado al carrito",
      description: `${item.name} agregado exitosamente`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      updateCart(cartItems.filter((item) => item.id !== id));
    } else {
      updateCart(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de continuar",
        variant: "destructive",
      });
      return;
    }
    window.location.href = "/checkout";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomerHeader
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
      />

      <Hero isAuthenticated={true} />

      <section className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-8">
          {user && (
            <div className="mb-6 rounded-lg bg-primary/5 border border-primary/20 p-4">
              <h2 className="text-2xl font-bold">
                ¡Bienvenido{user.firstName ? `, ${user.firstName}` : ''}!
              </h2>
              <p className="text-muted-foreground mt-1">
                Explora nuestros productos coreanos y encuentra tus favoritos
              </p>
            </div>
          )}
          <h2 className="mb-2 font-serif text-3xl font-bold">Nuestros Productos</h2>
          <p className="mb-4 text-muted-foreground">
            Productos coreanos auténticos y de calidad
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No se encontraron productos que coincidan con tu búsqueda"
                : "No hay productos disponibles en este momento"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {menuItems.map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.priceCents / 100}
                image={item.imageUrl}
                inStock={item.isAvailable && item.stock > 0}
                onAddToCart={() => addToCart(item)}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
