import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { OrderManagementTable } from "@/components/OrderManagementTable";
import { ThemeToggle } from "@/components/ThemeToggle";

type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    { id: '1', orderNumber: '1001', customerName: 'Juan Pérez', items: ['Tonkotsu Ramen', 'Gyoza'], total: 21.98, status: 'pending' as OrderStatus, time: '2:15 PM' },
    { id: '2', orderNumber: '1002', customerName: 'María García', items: ['Miso Ramen', 'Edamame'], total: 15.98, status: 'preparing' as OrderStatus, time: '2:20 PM' },
    { id: '3', orderNumber: '1003', customerName: 'Carlos López', items: ['Shoyu Ramen'], total: 11.99, status: 'ready' as OrderStatus, time: '2:10 PM' },
    { id: '4', orderNumber: '1004', customerName: 'Ana Martínez', items: ['Tan Tan Picante', 'Takoyaki'], total: 22.98, status: 'pending' as OrderStatus, time: '2:25 PM' },
    { id: '5', orderNumber: '1005', customerName: 'Luis Rodríguez', items: ['Miso Ramen', 'Gyoza', 'Mochi'], total: 26.97, status: 'completed' as OrderStatus, time: '1:50 PM' },
  ]);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
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
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">Gestión de Pedidos</h1>
              <p className="text-muted-foreground">
                Monitorea y actualiza el estado de los pedidos en tiempo real
              </p>
            </div>

            <OrderManagementTable 
              orders={orders}
              onStatusUpdate={handleStatusUpdate}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
