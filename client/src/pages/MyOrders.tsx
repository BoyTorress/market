import { useQuery } from "@tanstack/react-query";
import { CustomerHeader } from "@/components/CustomerHeader";
import { OrderStatusCard } from "@/components/OrderStatusCard";
import type { Order, OrderItem } from "@shared/schema";

export default function MyOrders() {
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 font-serif text-4xl font-bold">Mis Pedidos</h1>
          <p className="text-muted-foreground">
            Consulta el estado de tus pedidos actuales y anteriores
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Aún no has realizado ningún pedido
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {ordersWithItems.map((orderData: any) => {
              if (!orderData?.order) return null;
              const order = orderData.order;
              const items = orderData.items || [];

              return (
                <OrderStatusCard
                  key={order.id}
                  orderNumber={order.orderNumber}
                  status={order.status}
                  estimatedTime={
                    order.status === "pending" || order.status === "preparing"
                      ? "15-20 minutos"
                      : undefined
                  }
                  pickupTime={
                    order.scheduledTime
                      ? new Date(order.scheduledTime).toLocaleString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Lo antes posible"
                  }
                  items={items.map((item: any) => ({
                    name: item.menuItemName,
                    quantity: item.quantity,
                    price: item.priceCents / 100,
                  }))}
                  total={order.totalCents / 100}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
