import { Edit, Trash2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  stock: number;
}

interface MenuManagementTableProps {
  items?: MenuItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleAvailability?: (id: string, available: boolean) => void;
  onAddNew?: () => void;
}

export function MenuManagementTable({ 
  items = [],
  onEdit,
  onDelete,
  onToggleAvailability,
  onAddNew
}: MenuManagementTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestión de Menú</h2>
        <Button 
          onClick={() => {
            console.log('Add new menu item');
            onAddNew?.();
          }}
          data-testid="button-add-menu-item"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Platillo
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Disponible</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No hay platillos registrados
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} data-testid={`row-menu-${item.id}`}>
                  <TableCell>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={item.stock < 10 ? "text-destructive" : ""}>
                      {item.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.available}
                      onCheckedChange={(checked) => {
                        console.log(`Toggle availability for ${item.name}: ${checked}`);
                        onToggleAvailability?.(item.id, checked);
                      }}
                      data-testid={`switch-available-${item.id}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          console.log(`Edit menu item ${item.name}`);
                          onEdit?.(item.id);
                        }}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          console.log(`Delete menu item ${item.name}`);
                          onDelete?.(item.id);
                        }}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
