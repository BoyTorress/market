import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { CustomerHeader } from "@/components/CustomerHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Clock } from "lucide-react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [cartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    pickupType: "now",
    scheduledTime: "",
    customerName: "",
    customerPhone: "",
    specialInstructions: "",
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const items = cartItems.map((item: any) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        priceCents: Math.round(item.price * 100),
      }));

      const payload = {
        pickupType: formData.scheduledTime ? "scheduled" : "now",
        scheduledTime: formData.scheduledTime || null,
        customerName: formData.customerName || user?.firstName || user?.email || "Cliente",
        customerPhone: formData.customerPhone || "",
        specialInstructions: formData.specialInstructions || "",
        items,
      };

      return apiRequest("POST", "/api/orders", payload);
    },
    onSuccess: async (res) => {
      const order = await res.json();
      localStorage.removeItem("cart");
      toast({
        title: "Pedido creado exitosamente",
        description: `Tu pedido #${order.orderNumber} ha sido registrado`,
      });
      setLocation("/my-orders");
    },
    onError: () => {
      toast({
        title: "Error al crear pedido",
        description: "No se pudo procesar tu pedido. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Inicia sesión para continuar</h1>
          <p className="text-muted-foreground mb-6">
            Necesitas iniciar sesión para crear un pedido
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Carrito vacío</h1>
          <p className="text-muted-foreground mb-6">
            Agrega productos al carrito antes de continuar
          </p>
          <Button onClick={() => setLocation("/menu")}>Ver Menú</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />

      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Finalizar Pedido</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="customerName">Nombre</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder={user?.firstName || user?.email || "Tu nombre"}
                    data-testid="input-customer-name"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone">Teléfono (opcional)</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                    placeholder="Para notificaciones"
                    data-testid="input-customer-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="scheduledTime">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora de Entrega (opcional)
                    </div>
                  </Label>
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledTime: e.target.value })
                    }
                    data-testid="input-scheduled-time"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Déjalo vacío para "lo antes posible"
                  </p>
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Instrucciones Especiales (opcional)</Label>
                  <Textarea
                    id="specialInstructions"
                    placeholder="Alergias, preferencias de cocción, etc."
                    value={formData.specialInstructions}
                    onChange={(e) =>
                      setFormData({ ...formData, specialInstructions: e.target.value })
                    }
                    data-testid="textarea-instructions"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span data-testid="text-total">${subtotal.toFixed(2)}</span>
                </div>

                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium mb-1">Pago en persona</p>
                  <p className="text-xs text-muted-foreground">
                    El pago se realizará al momento de recoger tu pedido
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => createOrderMutation.mutate()}
                  disabled={createOrderMutation.isPending}
                  data-testid="button-confirm-order"
                >
                  {createOrderMutation.isPending
                    ? "Procesando..."
                    : "Confirmar Pedido"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
