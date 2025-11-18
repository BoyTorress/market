import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingBag, Package, AlertCircle } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { StatsCard } from "@/components/StatsCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Order, InventoryItem } from "@shared/schema";

export default function AdminDashboard() {
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: inventoryItems = [] } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: topItems = [] } = useQuery<{ itemName: string; quantity: number; revenue: number }[]>({
    queryKey: ["/api/reports/top-items"],
    queryFn: () => fetch("/api/reports/top-items?limit=5").then((res) => res.json()),
  });

  const { data: salesReport } = useQuery({
    queryKey: ["/api/reports/sales"],
    queryFn: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 6);
      return fetch(
        `/api/reports/sales?from=${from.toISOString()}&to=${to.toISOString()}`
      ).then((res) => res.json());
    },
  });

  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt!);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const activeOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "preparing"
  ).length;

  const completedToday = todayOrders.filter((order) => order.status === "completed");
  const todaySales = completedToday.reduce((sum, order) => sum + order.totalCents, 0) / 100;

  const lowStockCount = inventoryItems.filter(
    (item) => item.currentStock <= item.reorderPoint
  ).length;

  const salesData = salesReport?.dailySales?.map((day: any) => ({
    day: new Date(day.date).toLocaleDateString("es-MX", { weekday: "short" }),
    sales: day.sales,
  })) || [];

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
              <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Resumen de ventas y operaciones del día
              </p>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Ventas del Día"
                value={`$${todaySales.toFixed(2)}`}
                icon={DollarSign}
                testId="card-sales"
              />
              <StatsCard
                title="Pedidos Activos"
                value={activeOrders}
                icon={ShoppingBag}
                testId="card-active-orders"
              />
              <StatsCard
                title="Items con Bajo Stock"
                value={lowStockCount}
                icon={AlertCircle}
                testId="card-low-stock"
              />
              <StatsCard
                title="Total Pedidos Hoy"
                value={todayOrders.length}
                icon={Package}
                testId="card-total-orders"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas de la Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  {salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="day" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.375rem",
                          }}
                        />
                        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center">
                      <p className="text-muted-foreground">No hay datos disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platillos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  {topItems.length > 0 ? (
                    <div className="space-y-4">
                      {topItems.map((item, index) => {
                        const maxQuantity = topItems[0]?.quantity || 1;
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.itemName}</span>
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${(item.quantity / maxQuantity) * 100}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-sm text-muted-foreground">
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-[200px] items-center justify-center">
                      <p className="text-muted-foreground">No hay datos disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
