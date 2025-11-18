import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { MenuManagementTable } from "@/components/MenuManagementTable";
import { ThemeToggle } from "@/components/ThemeToggle";

import misoRamenImage from "@assets/generated_images/Miso_ramen_menu_item_312c9d00.png";
import shoyuRamenImage from "@assets/generated_images/Shoyu_ramen_menu_item_fef13de3.png";
import gyozaImage from "@assets/generated_images/Gyoza_appetizer_1f44f37d.png";
import edamameImage from "@assets/generated_images/Edamame_appetizer_693b0fdf.png";

export default function AdminMenu() {
  const [items, setItems] = useState([
    { id: '1', name: 'Miso Ramen', description: 'Caldo rico de miso con fideos y toppings', price: 12.99, category: 'Ramen', image: misoRamenImage, available: true, stock: 25 },
    { id: '2', name: 'Shoyu Ramen', description: 'Caldo de soya clara con fideos delgados', price: 11.99, category: 'Ramen', image: shoyuRamenImage, available: true, stock: 18 },
    { id: '3', name: 'Gyoza (6 pzs)', description: 'Dumplings fritos de cerdo', price: 7.99, category: 'Entrada', image: gyozaImage, available: true, stock: 8 },
    { id: '4', name: 'Edamame', description: 'Vainas de soya saladas', price: 5.99, category: 'Entrada', image: edamameImage, available: false, stock: 0 },
  ]);

  const handleToggleAvailability = (id: string, available: boolean) => {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, available } : item)
    );
  };

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b p-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <MenuManagementTable 
              items={items}
              onToggleAvailability={handleToggleAvailability}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
