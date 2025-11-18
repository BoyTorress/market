import { 
  LayoutDashboard, 
  ShoppingBag, 
  Menu, 
  Package, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, testId: "dashboard" },
  { title: "Pedidos", url: "/admin/orders", icon: ShoppingBag, testId: "orders" },
  { title: "Menú", url: "/admin/menu", icon: Menu, testId: "menu" },
  { title: "Inventario", url: "/admin/inventory", icon: Package, testId: "inventory" },
  { title: "Reportes", url: "/admin/reports", icon: BarChart3, testId: "reports" },
  { title: "Configuración", url: "/admin/settings", icon: Settings, testId: "settings" },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif text-lg">
            <span className="text-primary">Market</span>Express Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`link-admin-${item.testId}`}
                    >
                      <Link href={item.url}>
                        <a className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
