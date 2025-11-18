import { CustomerHeader } from "@/components/CustomerHeader";
import { OrderStatusCard } from "@/components/OrderStatusCard";

export default function MyOrders() {
  const orders = [
    {
      orderNumber: "1234",
      status: "preparing" as const,
      estimatedTime: "15-20 minutos",
      pickupTime: "2:30 PM",
      items: [
        { name: "Tonkotsu Ramen", quantity: 2, price: 13.99 },
        { name: "Gyoza (6 pzs)", quantity: 1, price: 7.99 },
      ],
      total: 35.97,
    },
    {
      orderNumber: "1198",
      status: "ready" as const,
      pickupTime: "Hoy 1:45 PM",
      items: [
        { name: "Miso Ramen", quantity: 1, price: 12.99 },
        { name: "Edamame", quantity: 1, price: 5.99 },
      ],
      total: 18.98,
    },
    {
      orderNumber: "1156",
      status: "completed" as const,
      pickupTime: "Ayer 7:15 PM",
      items: [
        { name: "Shoyu Ramen", quantity: 1, price: 11.99 },
        { name: "Matcha Cheesecake", quantity: 1, price: 6.99 },
      ],
      total: 18.98,
    },
  ];

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

        <div className="grid gap-6 lg:grid-cols-2">
          {orders.map((order) => (
            <OrderStatusCard key={order.orderNumber} {...order} />
          ))}
        </div>
      </div>
    </div>
  );
}
