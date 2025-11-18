import { useState } from 'react';
import { CartSidebar } from '../CartSidebar';
import { Button } from '@/components/ui/button';
import misoRamenImage from '@assets/generated_images/Miso_ramen_menu_item_312c9d00.png';
import gyozaImage from '@assets/generated_images/Gyoza_appetizer_1f44f37d.png';

export default function CartSidebarExample() {
  const [open, setOpen] = useState(false);
  
  const items = [
    { id: '1', name: 'Miso Ramen', price: 12.99, quantity: 2, image: misoRamenImage },
    { id: '2', name: 'Gyoza (6 pcs)', price: 7.99, quantity: 1, image: gyozaImage },
  ];

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Cart</Button>
      <CartSidebar open={open} onClose={() => setOpen(false)} items={items} />
    </div>
  );
}
