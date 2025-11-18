import { OrderManagementTable } from '../OrderManagementTable';

export default function OrderManagementTableExample() {
  const orders = [
    { id: '1', orderNumber: '1001', customerName: 'Juan Pérez', items: ['Tonkotsu Ramen', 'Gyoza'], total: 21.98, status: 'pending' as const, time: '2:15 PM' },
    { id: '2', orderNumber: '1002', customerName: 'María García', items: ['Miso Ramen', 'Edamame'], total: 15.98, status: 'preparing' as const, time: '2:20 PM' },
    { id: '3', orderNumber: '1003', customerName: 'Carlos López', items: ['Shoyu Ramen'], total: 11.99, status: 'ready' as const, time: '2:10 PM' },
  ];

  return <OrderManagementTable orders={orders} />;
}
