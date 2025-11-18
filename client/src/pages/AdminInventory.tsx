import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InventoryItem } from "@shared/schema";

export default function AdminInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    quantity: 0,
    notes: "",
  });
  const { toast } = useToast();

  const { data: inventoryItems = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: lowStockItems = [] } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory/low-stock"],
  });

  const adjustInventoryMutation = useMutation({
    mutationFn: ({ id, quantity, notes }: { id: string; quantity: number; notes: string }) =>
      apiRequest("POST", `/api/inventory/${id}/adjust`, { quantity, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({ title: "Inventario ajustado exitosamente" });
      setAdjustmentDialogOpen(false);
      setSelectedItem(null);
      setAdjustmentData({ quantity: 0, notes: "" });
    },
    onError: () => {
      toast({ title: "Error al ajustar inventario", variant: "destructive" });
    },
  });

  const handleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    adjustInventoryMutation.mutate({
      id: selectedItem.id,
      quantity: adjustmentData.quantity,
      notes: adjustmentData.notes,
    });
  };

  const openAdjustmentDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustmentData({ quantity: 0, notes: "" });
    setAdjustmentDialogOpen(true);
  };

  const filteredItems = inventoryItems.filter((item) =>
    searchQuery === "" ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b p-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold">Gestión de Inventario</h1>
              <p className="text-muted-foreground">
                Monitorea y ajusta los niveles de stock de ingredientes
              </p>
            </div>

            {lowStockItems.length > 0 && (
              <div className="mb-6 rounded-md border border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-500">
                      {lowStockItems.length} {lowStockItems.length === 1 ? "artículo" : "artículos"} con stock bajo
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-600">
                      {lowStockItems.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar artículos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                  <p className="text-muted-foreground">Cargando inventario...</p>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron artículos</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => {
                  const isLowStock = item.currentStock <= item.reorderPoint;
                  const stockPercentage = (item.currentStock / item.reorderPoint) * 100;

                  return (
                    <Card key={item.id} data-testid={`card-inventory-${item.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          {isLowStock && (
                            <Badge variant="destructive" data-testid={`badge-low-stock-${item.id}`}>
                              Stock Bajo
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Stock Actual</span>
                            <span className="font-semibold" data-testid={`text-stock-${item.id}`}>
                              {item.currentStock} {item.unit}
                            </span>
                          </div>

                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full ${
                                isLowStock ? "bg-red-500" : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(Math.max(stockPercentage, 5), 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Punto de Reorden</span>
                            <span>{item.reorderPoint} {item.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Última Actualización</span>
                            <span>
                              {new Date(item.updatedAt).toLocaleDateString("es-MX")}
                            </span>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => openAdjustmentDialog(item)}
                          data-testid={`button-adjust-${item.id}`}
                        >
                          Ajustar Stock
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Ajustar Inventario: {selectedItem?.name}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAdjustment} className="space-y-4">
                  {selectedItem && (
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stock Actual</span>
                        <span className="font-semibold">
                          {selectedItem.currentStock} {selectedItem.unit}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="quantity">Cantidad (+ para agregar, - para reducir)</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setAdjustmentData({ ...adjustmentData, quantity: -10 })
                        }
                      >
                        <TrendingDown className="h-4 w-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        value={adjustmentData.quantity}
                        onChange={(e) =>
                          setAdjustmentData({
                            ...adjustmentData,
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        required
                        data-testid="input-quantity"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setAdjustmentData({ ...adjustmentData, quantity: 10 })
                        }
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedItem && adjustmentData.quantity !== 0 && (
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nuevo Stock</span>
                        <span className="font-semibold">
                          {selectedItem.currentStock + adjustmentData.quantity} {selectedItem.unit}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Notas (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Motivo del ajuste..."
                      value={adjustmentData.notes}
                      onChange={(e) =>
                        setAdjustmentData({ ...adjustmentData, notes: e.target.value })
                      }
                      data-testid="textarea-notes"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAdjustmentDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={adjustInventoryMutation.isPending || adjustmentData.quantity === 0}
                      data-testid="button-save"
                    >
                      Guardar Ajuste
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
