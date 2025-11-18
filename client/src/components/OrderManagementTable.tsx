import { useState } from "react";
import { Clock, ChefHat, Package, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderStatus = "pending" | "preparing" | "ready" | "completed";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: string[];
  total: number;
  status: OrderStatus;
  time: string;
}

interface OrderManagementTableProps {
  orders?: Order[];
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus) => void;
}

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, variant: "secondary" as const },
  preparing: { label: "Preparando", icon: ChefHat, variant: "default" as const },
  ready: { label: "Listo", icon: Package, variant: "default" as const },
  completed: { label: "Completado", icon: CheckCircle, variant: "secondary" as const },
};

export function OrderManagementTable({ 
  orders = [],
  onStatusUpdate 
}: OrderManagementTableProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: "preparing",
      preparing: "ready",
      ready: "completed",
      completed: null,
    };
    return statusFlow[currentStatus];
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all" data-testid="tab-all">Todos</TabsTrigger>
        <TabsTrigger value="pending" data-testid="tab-pending">Pendientes</TabsTrigger>
        <TabsTrigger value="preparing" data-testid="tab-preparing">Preparando</TabsTrigger>
        <TabsTrigger value="ready" data-testid="tab-ready">Listos</TabsTrigger>
        <TabsTrigger value="completed" data-testid="tab-completed">Completados</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Artículos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No hay pedidos en esta categoría
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const config = statusConfig[order.status];
                  const Icon = config.icon;
                  const nextStatus = getNextStatus(order.status);

                  return (
                    <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                      <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {order.items.join(", ")}
                      </TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>
                          <Icon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.time}</TableCell>
                      <TableCell className="text-right">
                        {nextStatus && (
                          <Button
                            size="sm"
                            onClick={() => {
                              console.log(`Update order ${order.orderNumber} to ${nextStatus}`);
                              onStatusUpdate?.(order.id, nextStatus);
                            }}
                            data-testid={`button-update-status-${order.id}`}
                          >
                            {nextStatus === "preparing" && "Iniciar"}
                            {nextStatus === "ready" && "Marcar Listo"}
                            {nextStatus === "completed" && "Completar"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
