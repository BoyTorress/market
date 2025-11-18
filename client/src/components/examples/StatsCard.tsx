import { StatsCard } from '../StatsCard';
import { DollarSign } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="max-w-sm">
      <StatsCard
        title="Ventas del Día"
        value="$1,234.50"
        icon={DollarSign}
        trend={{ value: 12.5, label: 'vs ayer' }}
      />
    </div>
  );
}
