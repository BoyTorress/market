import { Clock, CheckCircle, ChefHat, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type OrderStatus = "pending" | "preparing" | "ready" | "completed";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderStatusCardProps {
  orderNumber: string;
  status: OrderStatus;
  estimatedTime?: string;
  items: OrderItem[];
  total: number;
  pickupTime?: string;
}

const statusConfig = {
  pending: { 
    label: "Pendiente", 
    icon: Clock, 
    variant: "secondary" as const,
    step: 1 
  },
  preparing: { 
    label: "En Preparación", 
    icon: ChefHat, 
    variant: "default" as const,
    step: 2 
  },
  ready: { 
    label: "Listo para Recoger", 
    icon: Package, 
    variant: "default" as const,
    step: 3 
  },
  completed: { 
    label: "Completado", 
    icon: CheckCircle, 
    variant: "secondary" as const,
    step: 4 
  },
};

export function OrderStatusCard({ 
  orderNumber, 
  status, 
  estimatedTime,
  items,
  total,
  pickupTime
}: OrderStatusCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const currentStep = config.step;

  const steps = [
    { label: "Recibido", step: 1 },
    { label: "Preparando", step: 2 },
    { label: "Listo", step: 3 },
    { label: "Entregado", step: 4 },
  ];

  return (
    <Card data-testid={`card-order-${orderNumber}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <CardTitle className="text-base">
          Pedido #{orderNumber}
        </CardTitle>
        <Badge variant={config.variant} data-testid={`badge-status-${orderNumber}`}>
          <Icon className="mr-1 h-3 w-3" />
          {config.label}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="flex flex-1 flex-col items-center gap-2">
              <div 
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium ${
                  step.step <= currentStep 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'border-muted bg-background text-muted-foreground'
                }`}
              >
                {step.step <= currentStep ? '✓' : step.step}
              </div>
              <span className="text-xs text-center text-muted-foreground">
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-[calc(25%+1rem)] top-8 h-0.5 w-[calc(25%-2rem)] ${
                    step.step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                  style={{ marginLeft: `${index * 25}%` }}
                />
              )}
            </div>
          ))}
        </div>

        {estimatedTime && status !== "completed" && (
          <div className="rounded-md bg-muted p-3 text-center">
            <p className="text-sm font-medium">
              Tiempo estimado: <span className="text-primary">{estimatedTime}</span>
            </p>
          </div>
        )}

        {pickupTime && (
          <div className="text-sm">
            <span className="text-muted-foreground">Hora de retiro:</span>{" "}
            <span className="font-medium">{pickupTime}</span>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Detalles del Pedido</h4>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm" data-testid={`order-item-${index}`}>
              <span className="text-muted-foreground">
                {item.quantity}x {item.name}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary" data-testid={`text-order-total-${orderNumber}`}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
