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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MenuItem, MenuCategory } from "@shared/schema";

export default function AdminMenu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const { data: categories = [] } = useQuery<MenuCategory[]>({
    queryKey: ["/api/categories"],
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceCents: 0,
    categoryId: "",
    imageUrl: "",
    isAvailable: true,
    stock: 0,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/menu", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({ title: "Platillo creado exitosamente" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Error al crear platillo", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PATCH", `/api/menu/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({ title: "Platillo actualizado exitosamente" });
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Error al actualizar platillo", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/menu/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({ title: "Platillo eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar platillo", variant: "destructive" });
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      apiRequest("PATCH", `/api/menu/${id}`, { isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
    },
    onError: () => {
      toast({ title: "Error al actualizar disponibilidad", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      priceCents: 0,
      categoryId: "",
      imageUrl: "",
      isAvailable: true,
      stock: 0,
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      priceCents: item.priceCents,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      stock: item.stock,
    });
    setIsDialogOpen(true);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.categoryId === categoryFilter;

    return matchesSearch && matchesCategory;
  });

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
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Gestión de Menú</h1>
                <p className="text-muted-foreground">
                  Administra los platillos y su disponibilidad
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} data-testid="button-add-item">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Platillo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? "Editar Platillo" : "Nuevo Platillo"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        data-testid="input-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        required
                        data-testid="input-description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Precio (MXN)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.priceCents / 100}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priceCents: Math.round(parseFloat(e.target.value) * 100),
                          })
                        }
                        required
                        data-testid="input-price"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Categoría</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, categoryId: value })
                        }
                      >
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">URL de Imagen</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        required
                        data-testid="input-image-url"
                      />
                    </div>

                    <div>
                      <Label htmlFor="stock">Inventario</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock: parseInt(e.target.value),
                          })
                        }
                        required
                        data-testid="input-stock"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="available">Disponible</Label>
                      <Switch
                        id="available"
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isAvailable: checked })
                        }
                        data-testid="switch-available"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                        data-testid="button-cancel"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                        data-testid="button-save"
                      >
                        {editingItem ? "Actualizar" : "Crear"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar platillos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                  <p className="text-muted-foreground">Cargando menú...</p>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron platillos</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} data-testid={`card-item-${item.id}`}>
                    <CardHeader className="p-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-48 w-full object-cover rounded-t-md"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge
                          variant={item.isAvailable ? "default" : "secondary"}
                          data-testid={`badge-available-${item.id}`}
                        >
                          {item.isAvailable ? "Disponible" : "No disponible"}
                        </Badge>
                      </div>

                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xl font-bold">
                          ${(item.priceCents / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Stock: {item.stock}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(item)}
                          data-testid={`button-edit-${item.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleAvailabilityMutation.mutate({
                              id: item.id,
                              isAvailable: !item.isAvailable,
                            })
                          }
                          data-testid={`button-toggle-${item.id}`}
                        >
                          {item.isAvailable ? "Desactivar" : "Activar"}
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Eliminar "${item.name}"?`
                              )
                            ) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
