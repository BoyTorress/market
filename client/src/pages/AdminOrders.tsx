import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Search, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Order } from "@shared/schema";

const statusColors = {
  pending: "bg-yellow-500",
  preparing: "bg-blue-500",
  ready: "bg-green-500",
  completed: "bg-gray-500",
  cancelled: "bg-red-500",
};

const statusLabels = {
  pending: "Pendiente",
  preparing: "Preparando",
  ready: "Listo",
  completed: "Completado",
  cancelled: "Cancelado",
};

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: ordersWithItems = [] } = useQuery({
    queryKey: ["/api/orders/with-items"],
    queryFn: async () => {
      const results = await Promise.all(
        orders.map(async (order) => {
          const response = await fetch(`/api/orders/${order.id}`);
          const data = await response.json();
          return data;
        })
      );
      return results;
    },
    enabled: orders.length > 0,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Estado actualizado",
        description: "El estado del pedido ha sido actualizado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
        variant: "destructive",
      });
    },
  });

  const filteredOrders = ordersWithItems.filter((orderData: any) => {
    const order = orderData?.order;
    if (!order) return false;

    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderData.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                Administra y actualiza el estado de los pedidos
              </p>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número de pedido o cliente..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-orders"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="preparing">Preparando</SelectItem>
                  <SelectItem value="ready">Listos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                  <p className="text-muted-foreground">Cargando pedidos...</p>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron pedidos</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((orderData: any) => {
                  const order = orderData.order;
                  const items = orderData.items || [];
                  const user = orderData.user;

                  return (
                    <Card key={order.id} data-testid={`card-order-${order.id}`}>
                      <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <span data-testid={`text-order-number-${order.id}`}>
                                Pedido #{order.orderNumber}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`${statusColors[order.status as keyof typeof statusColors]} text-white`}
                                data-testid={`badge-status-${order.id}`}
                              >
                                {statusLabels[order.status as keyof typeof statusLabels]}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {user && <span>Cliente: {user.email}</span>}
                              {" • "}
                              <span>
                                {new Date(order.createdAt!).toLocaleString("es-MX")}
                              </span>
                            </CardDescription>
                          </div>

                          <Select
                            value={order.status}
                            onValueChange={(status) =>
                              updateStatusMutation.mutate({ orderId: order.id, status })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger
                              className="w-[160px]"
                              data-testid={`select-update-status-${order.id}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="preparing">Preparando</SelectItem>
                              <SelectItem value="ready">Listo</SelectItem>
                              <SelectItem value="completed">Completado</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <span className="font-medium">Tipo:</span>{" "}
                            {order.orderType === "pickup" ? "Para llevar" : "En mesa"}
                            {order.scheduledTime && (
                              <>
                                {" • "}
                                <span className="font-medium">Hora programada:</span>{" "}
                                {new Date(order.scheduledTime).toLocaleTimeString("es-MX", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </>
                            )}
                          </div>

                          <div className="rounded-md bg-muted p-3">
                            <div className="space-y-2">
                              {items.map((item: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                  data-testid={`order-item-${index}`}
                                >
                                  <span>
                                    {item.quantity}x {item.menuItemName}
                                  </span>
                                  <span className="font-medium">
                                    ${(item.priceCents / 100).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              <div className="border-t pt-2 flex justify-between font-bold">
                                <span>Total</span>
                                <span data-testid={`text-total-${order.id}`}>
                                  ${(order.totalCents / 100).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {order.notes && (
                            <div className="text-sm">
                              <span className="font-medium">Notas:</span> {order.notes}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
