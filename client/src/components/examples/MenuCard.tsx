import { MenuCard } from '../MenuCard';
import misoRamenImage from '@assets/generated_images/Miso_ramen_menu_item_312c9d00.png';

export default function MenuCardExample() {
  return (
    <div className="max-w-sm">
      <MenuCard
        id="miso-ramen"
        name="Miso Ramen"
        description="Caldo rico de miso con fideos, maíz, brotes de soya y cerdo chashu"
        price={12.99}
        image={misoRamenImage}
        category="Ramen"
        inStock={true}
      />
    </div>
  );
}
