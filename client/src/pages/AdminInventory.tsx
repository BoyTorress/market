import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { InventoryCard } from "@/components/InventoryCard";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminInventory() {
  const inventoryItems = [
    { id: '1', name: 'Fideos Frescos', currentStock: 15, minStock: 20, unit: 'kg', lastUpdated: 'Hace 2 horas' },
    { id: '2', name: 'Caldo de Cerdo', currentStock: 45, minStock: 30, unit: 'L', lastUpdated: 'Hace 4 horas' },
    { id: '3', name: 'Chashu (Cerdo)', currentStock: 8, minStock: 10, unit: 'kg', lastUpdated: 'Hace 1 hora' },
    { id: '4', name: 'Huevos', currentStock: 0, minStock: 50, unit: 'pzs', lastUpdated: 'Hace 3 horas' },
    { id: '5', name: 'Nori (Algas)', currentStock: 25, minStock: 15, unit: 'paquetes', lastUpdated: 'Hace 5 horas' },
    { id: '6', name: 'Pasta Miso', currentStock: 6, minStock: 8, unit: 'kg', lastUpdated: 'Hace 6 horas' },
  ];

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
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">Gestión de Inventario</h1>
              <p className="text-muted-foreground">
                Monitorea y controla los niveles de stock de ingredientes
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inventoryItems.map((item) => (
                <InventoryCard key={item.id} {...item} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
