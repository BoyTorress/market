import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { eq, and, desc, asc, gte, lte, sql, like, or } from "drizzle-orm";
import {
  users,
  menuCategories,
  menuItems,
  inventoryItems,
  inventoryAdjustments,
  orders,
  orderItems,
  orderStatusEvents,
  type User,
  type InsertUser,
  type MenuCategory,
  type InsertMenuCategory,
  type MenuItem,
  type InsertMenuItem,
  type InventoryItem,
  type InsertInventoryItem,
  type InsertInventoryAdjustment,
  type Order,
  type InsertOrder,
  type InsertOrderItem,
  type InsertOrderStatusEvent,
  type OrderItem,
} from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  // Users (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: any): Promise<User>;
  
  // Menu Categories
  getAllCategories(): Promise<MenuCategory[]>;
  createCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  searchMenuItems(query: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;
  updateMenuItemAvailability(id: string, isAvailable: boolean): Promise<MenuItem | undefined>;
  
  // Inventory
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  getLowStockItems(): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  adjustInventory(adjustment: InsertInventoryAdjustment): Promise<void>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderWithItems(id: string): Promise<{ order: Order; items: OrderItem[] } | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string, note?: string): Promise<Order | undefined>;
  
  // Reports
  getSalesReport(startDate: Date, endDate: Date): Promise<{
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    dailySales: { date: string; sales: number; orders: number }[];
  }>;
  getTopSellingItems(limit: number): Promise<{ itemName: string; quantity: number; revenue: number }[]>;
}

export class PgStorage implements IStorage {
  // Users (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async upsertUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Menu Categories
  async getAllCategories(): Promise<MenuCategory[]> {
    return await db.select().from(menuCategories).orderBy(asc(menuCategories.displayOrder));
  }

  async createCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const result = await db.insert(menuCategories).values(category).returning();
    return result[0];
  }

  // Menu Items
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).orderBy(asc(menuItems.name));
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId))
      .orderBy(asc(menuItems.name));
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return result[0];
  }

  async searchMenuItems(query: string): Promise<MenuItem[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(menuItems)
      .where(
        or(
          like(sql`LOWER(${menuItems.name})`, searchTerm),
          like(sql`LOWER(${menuItems.description})`, searchTerm)
        )
      )
      .orderBy(asc(menuItems.name));
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const result = await db.insert(menuItems).values(item).returning();
    return result[0];
  }

  async updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const result = await db
      .update(menuItems)
      .set(item)
      .where(eq(menuItems.id, id))
      .returning();
    return result[0];
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id)).returning();
    return result.length > 0;
  }

  async updateMenuItemAvailability(id: string, isAvailable: boolean): Promise<MenuItem | undefined> {
    const result = await db
      .update(menuItems)
      .set({ isAvailable })
      .where(eq(menuItems.id, id))
      .returning();
    return result[0];
  }

  // Inventory
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).orderBy(asc(inventoryItems.name));
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const result = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return result[0];
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return await db
      .select()
      .from(inventoryItems)
      .where(sql`${inventoryItems.currentStock} <= ${inventoryItems.reorderPoint}`)
      .orderBy(asc(inventoryItems.currentStock));
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const result = await db.insert(inventoryItems).values(item).returning();
    return result[0];
  }

  async updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const result = await db
      .update(inventoryItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    return result[0];
  }

  async adjustInventory(adjustment: InsertInventoryAdjustment): Promise<void> {
    await db.transaction(async (tx) => {
      // Record the adjustment
      await tx.insert(inventoryAdjustments).values(adjustment);
      
      // Update the current stock
      await tx
        .update(inventoryItems)
        .set({
          currentStock: sql`${inventoryItems.currentStock} + ${adjustment.delta}`,
          updatedAt: new Date(),
        })
        .where(eq(inventoryItems.id, adjustment.inventoryItemId));
    });
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.status, status as any))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(and(gte(orders.createdAt, startDate), lte(orders.createdAt, endDate)))
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrderWithItems(id: string): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    return { order, items };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const result = await db.transaction(async (tx) => {
      // Create the order
      const [newOrder] = await tx.insert(orders).values(order).returning();

      // Create order items
      const itemsWithOrderId = items.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }));
      await tx.insert(orderItems).values(itemsWithOrderId);

      // Create initial status event
      await tx.insert(orderStatusEvents).values({
        orderId: newOrder.id,
        status: order.status,
        note: "Pedido creado",
      });

      return newOrder;
    });

    return result;
  }

  async updateOrderStatus(id: string, status: string, note?: string): Promise<Order | undefined> {
    const result = await db.transaction(async (tx) => {
      // Update order status
      const [updatedOrder] = await tx
        .update(orders)
        .set({ status: status as any, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();

      if (!updatedOrder) return undefined;

      // Create status event
      await tx.insert(orderStatusEvents).values({
        orderId: id,
        status: status as any,
        note,
      });

      return updatedOrder;
    });

    return result;
  }

  // Reports
  async getSalesReport(startDate: Date, endDate: Date): Promise<{
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    dailySales: { date: string; sales: number; orders: number }[];
  }> {
    const ordersInRange = await this.getOrdersByDateRange(startDate, endDate);
    
    const completedOrders = ordersInRange.filter(
      (order) => order.status === "completed"
    );

    const totalSales = completedOrders.reduce((sum, order) => sum + order.totalCents, 0);
    const totalOrders = completedOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Group by date
    const dailyMap = new Map<string, { sales: number; orders: number }>();
    completedOrders.forEach((order) => {
      const date = order.createdAt!.toISOString().split("T")[0];
      const existing = dailyMap.get(date) || { sales: 0, orders: 0 };
      dailyMap.set(date, {
        sales: existing.sales + order.totalCents,
        orders: existing.orders + 1,
      });
    });

    const dailySales = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    return {
      totalSales: totalSales / 100, // Convert to dollars
      totalOrders,
      averageOrderValue: averageOrderValue / 100,
      dailySales: dailySales.map((d) => ({ ...d, sales: d.sales / 100 })),
    };
  }

  async getTopSellingItems(limit: number): Promise<{ itemName: string; quantity: number; revenue: number }[]> {
    const result = await db
      .select({
        itemName: orderItems.menuItemName,
        quantity: sql<number>`SUM(${orderItems.quantity})::int`,
        revenue: sql<number>`SUM(${orderItems.priceCents} * ${orderItems.quantity})::int`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orders.status, "completed"))
      .groupBy(orderItems.menuItemName)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(limit);

    return result.map((r) => ({
      ...r,
      revenue: r.revenue / 100, // Convert to dollars
    }));
  }
}

export const storage = new PgStorage();
