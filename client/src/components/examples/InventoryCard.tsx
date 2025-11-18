import { InventoryCard } from '../InventoryCard';

export default function InventoryCardExample() {
  return (
    <div className="max-w-sm">
      <InventoryCard
        id="noodles"
        name="Fideos Frescos"
        currentStock={15}
        minStock={20}
        unit="kg"
        lastUpdated="Hace 2 horas"
      />
    </div>
  );
}
