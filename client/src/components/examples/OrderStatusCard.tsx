import { OrderStatusCard } from '../OrderStatusCard';

export default function OrderStatusCardExample() {
  return (
    <div className="max-w-2xl">
      <OrderStatusCard
        orderNumber="1234"
        status="preparing"
        estimatedTime="15-20 minutos"
        pickupTime="2:30 PM"
        items={[
          { name: 'Tonkotsu Ramen', quantity: 2, price: 13.99 },
          { name: 'Gyoza', quantity: 1, price: 7.99 },
        ]}
        total={35.97}
      />
    </div>
  );
}
