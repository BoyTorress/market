import { AlertCircle, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InventoryCardProps {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastUpdated?: string;
  onRestock?: (id: string, amount: number) => void;
}

export function InventoryCard({ 
  id,
  name, 
  currentStock, 
  minStock, 
  unit,
  lastUpdated,
  onRestock 
}: InventoryCardProps) {
  const stockLevel = currentStock <= 0 
    ? "critical" 
    : currentStock <= minStock 
    ? "low" 
    : "sufficient";

  const levelConfig = {
    critical: { color: "bg-destructive", label: "Agotado", variant: "destructive" as const },
    low: { color: "bg-yellow-500", label: "Bajo", variant: "secondary" as const },
    sufficient: { color: "bg-green-500", label: "Suficiente", variant: "secondary" as const },
  };

  const config = levelConfig[stockLevel];

  return (
    <Card data-testid={`card-inventory-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4 text-muted-foreground" />
          {name}
        </CardTitle>
        <Badge variant={config.variant} data-testid={`badge-status-${id}`}>
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className={`h-2 flex-1 rounded-full bg-muted`}>
            <div 
              className={`h-2 rounded-full transition-all ${config.color}`}
              style={{ width: `${Math.min((currentStock / (minStock * 2)) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold" data-testid={`text-stock-${id}`}>
            {currentStock}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>

        {stockLevel !== "sufficient" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            <span>Mínimo requerido: {minStock} {unit}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Input 
            type="number" 
            placeholder="Cantidad"
            className="h-8"
            data-testid={`input-restock-${id}`}
          />
          <Button 
            size="sm"
            onClick={() => {
              console.log(`Restock ${name}`);
              onRestock?.(id, 10);
            }}
            data-testid={`button-restock-${id}`}
          >
            Reabastecer
          </Button>
        </div>

        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Actualizado: {lastUpdated}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
