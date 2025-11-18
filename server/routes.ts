import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import { 
  insertMenuItemSchema, 
  insertMenuCategorySchema,
  insertInventoryItemSchema,
  insertOrderSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // ============ MENU CATEGORY ROUTES ============
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertMenuCategorySchema.parse(req.body);
      const category = await storage.createCategory(validated);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: error.message || "Failed to create category" });
    }
  });

  // ============ MENU ITEM ROUTES ============
  app.get("/api/menu", async (_req, res) => {
    try {
      const items = await storage.getAllMenuItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const items = await storage.searchMenuItems(query);
      res.json(items);
    } catch (error) {
      console.error("Error searching menu items:", error);
      res.status(500).json({ message: "Failed to search menu items" });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validated);
      res.status(201).json(item);
    } catch (error: any) {
      console.error("Error creating menu item:", error);
      res.status(400).json({ message: error.message || "Failed to create menu item" });
    }
  });

  app.patch("/api/menu/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const item = await storage.updateMenuItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error: any) {
      console.error("Error updating menu item:", error);
      res.status(400).json({ message: error.message || "Failed to update menu item" });
    }
  });

  app.patch("/api/menu/:id/availability", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { isAvailable } = req.body;
      const item = await storage.updateMenuItemAvailability(req.params.id, isAvailable);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error: any) {
      console.error("Error updating availability:", error);
      res.status(400).json({ message: error.message || "Failed to update availability" });
    }
  });

  app.delete("/api/menu/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteMenuItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // ============ INVENTORY ROUTES ============
  app.get("/api/inventory", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const items = await storage.getAllInventoryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.get("/api/inventory/low-stock", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const items = await storage.getLowStockItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching low stock items:", error);
      res.status(500).json({ message: "Failed to fetch low stock items" });
    }
  });

  app.post("/api/inventory", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validated = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(validated);
      res.status(201).json(item);
    } catch (error: any) {
      console.error("Error creating inventory item:", error);
      res.status(400).json({ message: error.message || "Failed to create inventory item" });
    }
  });

  app.patch("/api/inventory/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const item = await storage.updateInventoryItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error: any) {
      console.error("Error updating inventory item:", error);
      res.status(400).json({ message: error.message || "Failed to update inventory item" });
    }
  });

  app.post("/api/inventory/:id/adjust", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { delta, note } = req.body;
      
      await storage.adjustInventory({
        inventoryItemId: req.params.id,
        userId,
        delta,
        note: note || null,
      });
      
      const updatedItem = await storage.getInventoryItem(req.params.id);
      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error adjusting inventory:", error);
      res.status(400).json({ message: error.message || "Failed to adjust inventory" });
    }
  });

  // ============ ORDER ROUTES ============
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;

      let orders;
      if (user.role === "admin") {
        const status = req.query.status as string | undefined;
        if (status) {
          orders = await storage.getOrdersByStatus(status);
        } else {
          orders = await storage.getAllOrders();
        }
      } else {
        orders = await storage.getOrdersByUser(user.id);
      }
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const orderData = await storage.getOrderWithItems(req.params.id);
      if (!orderData) {
        return res.status(404).json({ message: "Order not found" });
      }

      const user = req.user;

      // Check permissions
      if (user.role !== "admin" && orderData.order.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { items, customerName, customerPhone, pickupType, scheduledTime, specialInstructions } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Order must contain at least one item" });
      }

      // Calculate totals
      const subtotalCents = items.reduce((sum: number, item: any) => {
        return sum + (item.priceCents * item.quantity);
      }, 0);
      const taxCents = Math.round(subtotalCents * 0.16); // 16% tax
      const totalCents = subtotalCents + taxCents;

      // Generate order number
      const orderNumber = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

      const order = await storage.createOrder(
        {
          userId,
          orderNumber,
          status: "pending",
          pickupType: pickupType || "now",
          scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
          totalCents,
          taxCents,
          customerName,
          customerPhone: customerPhone || null,
          specialInstructions: specialInstructions || null,
        },
        items
      );

      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: error.message || "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status, note } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status, note);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      console.error("Error updating order status:", error);
      res.status(400).json({ message: error.message || "Failed to update order status" });
    }
  });

  // ============ REPORT ROUTES ============
  app.get("/api/reports/sales", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const from = req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const to = req.query.to ? new Date(req.query.to as string) : new Date();
      
      const report = await storage.getSalesReport(from, to);
      res.json(report);
    } catch (error) {
      console.error("Error generating sales report:", error);
      res.status(500).json({ message: "Failed to generate sales report" });
    }
  });

  app.get("/api/reports/top-items", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const items = await storage.getTopSellingItems(limit);
      res.json(items);
    } catch (error) {
      console.error("Error fetching top items:", error);
      res.status(500).json({ message: "Failed to fetch top items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
