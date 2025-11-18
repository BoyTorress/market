import { MenuManagementTable } from '../MenuManagementTable';
import misoRamenImage from '@assets/generated_images/Miso_ramen_menu_item_312c9d00.png';
import gyozaImage from '@assets/generated_images/Gyoza_appetizer_1f44f37d.png';

export default function MenuManagementTableExample() {
  const items = [
    { id: '1', name: 'Miso Ramen', description: 'Caldo de miso con fideos y toppings', price: 12.99, category: 'Ramen', image: misoRamenImage, available: true, stock: 25 },
    { id: '2', name: 'Gyoza', description: 'Dumplings fritos de cerdo', price: 7.99, category: 'Entrada', image: gyozaImage, available: true, stock: 8 },
  ];

  return <MenuManagementTable items={items} />;
}
