import { useState } from "react";
import { CustomerHeader } from "@/components/CustomerHeader";
import { Hero } from "@/components/Hero";
import { MenuCard } from "@/components/MenuCard";
import { CartSidebar } from "@/components/CartSidebar";

import misoRamenImage from "@assets/generated_images/Miso_ramen_menu_item_312c9d00.png";
import shoyuRamenImage from "@assets/generated_images/Shoyu_ramen_menu_item_fef13de3.png";
import spicyRamenImage from "@assets/generated_images/Spicy_tan_tan_ramen_bba0243c.png";
import gyozaImage from "@assets/generated_images/Gyoza_appetizer_1f44f37d.png";
import edamameImage from "@assets/generated_images/Edamame_appetizer_693b0fdf.png";
import takoyakiImage from "@assets/generated_images/Takoyaki_appetizer_42e4b02e.png";
import matchaImage from "@assets/generated_images/Matcha_cheesecake_dessert_ba818590.png";
import mochiImage from "@assets/generated_images/Mochi_ice_cream_dessert_2571432d.png";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const menuItems = [
    { id: "miso", name: "Miso Ramen", description: "Caldo rico de miso con fideos, maíz, brotes de soya y cerdo chashu", price: 12.99, image: misoRamenImage, category: "Ramen" },
    { id: "shoyu", name: "Shoyu Ramen", description: "Caldo de soya clara con fideos delgados, nori, menma y chashu", price: 11.99, image: shoyuRamenImage, category: "Ramen" },
    { id: "spicy", name: "Tan Tan Picante", description: "Ramen picante con carne molida, bok choy y aceite de chile", price: 13.99, image: spicyRamenImage, category: "Ramen" },
    { id: "gyoza", name: "Gyoza (6 pzs)", description: "Dumplings de cerdo dorados servidos con salsa de soya", price: 7.99, image: gyozaImage, category: "Entrada" },
    { id: "edamame", name: "Edamame", description: "Vainas de soya saladas al vapor", price: 5.99, image: edamameImage, category: "Entrada" },
    { id: "takoyaki", name: "Takoyaki (6 pzs)", description: "Bolas de pulpo con salsa y bonito", price: 8.99, image: takoyakiImage, category: "Entrada" },
    { id: "matcha", name: "Cheesecake Matcha", description: "Cheesecake cremoso de té verde matcha", price: 6.99, image: matchaImage, category: "Postre" },
    { id: "mochi", name: "Mochi Ice Cream", description: "Helado envuelto en mochi suave (3 pzs)", price: 5.99, image: mochiImage, category: "Postre" },
  ];

  const addToCart = (item: typeof menuItems[0]) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => 
        prev.map(item => item.id === id ? { ...item, quantity } : item)
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
      />
      
      <Hero />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="mb-2 font-serif text-3xl font-bold">Nuestro Menú</h2>
          <p className="text-muted-foreground">
            Platillos auténticos preparados con ingredientes frescos
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              {...item}
              onAddToCart={() => addToCart(item)}
            />
          ))}
        </div>
      </section>

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          console.log('Checkout with items:', cartItems);
          setCartOpen(false);
        }}
      />
    </div>
  );
}
