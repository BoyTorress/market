import { DollarSign, ShoppingBag, Package, AlertCircle } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { StatsCard } from "@/components/StatsCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { day: "Lun", sales: 420 },
  { day: "Mar", sales: 380 },
  { day: "Mié", sales: 510 },
  { day: "Jue", sales: 460 },
  { day: "Vie", sales: 680 },
  { day: "Sáb", sales: 890 },
  { day: "Dom", sales: 720 },
];

export default function AdminDashboard() {
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
                value="$1,234.50"
                icon={DollarSign}
                trend={{ value: 12.5, label: "vs ayer" }}
                testId="card-sales"
              />
              <StatsCard
                title="Pedidos Activos"
                value="8"
                icon={ShoppingBag}
                testId="card-active-orders"
              />
              <StatsCard
                title="Items con Bajo Stock"
                value="3"
                icon={AlertCircle}
                testId="card-low-stock"
              />
              <StatsCard
                title="Total Pedidos Hoy"
                value="42"
                icon={Package}
                trend={{ value: 8, label: "vs ayer" }}
                testId="card-total-orders"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas de la Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.375rem'
                        }}
                      />
                      <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platillos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Tonkotsu Ramen", sales: 156 },
                      { name: "Miso Ramen", sales: 134 },
                      { name: "Gyoza", sales: 98 },
                      { name: "Shoyu Ramen", sales: 87 },
                      { name: "Edamame", sales: 76 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${(item.sales / 156) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-sm text-muted-foreground">
                            {item.sales}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
