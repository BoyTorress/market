import { sql } from "drizzle-orm";
import { 
  sqliteTable, 
  text, 
  integer
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Helper function for generating UUIDs
function generateId() {
  return crypto.randomUUID();
}

// Session storage table for express-session
export const sessions = sqliteTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: integer("expire", { mode: "timestamp" }).notNull(),
});

// Users table with password authentication
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role", { enum: ["customer", "admin"] }).notNull().default("customer"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

// Menu Categories
export const menuCategories = sqliteTable("menu_categories", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  name: text("name").notNull().unique(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
  createdAt: true,
});
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type MenuCategory = typeof menuCategories.$inferSelect;

// Menu Items
export const menuItems = sqliteTable("menu_items", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  categoryId: text("category_id")
    .references(() => menuCategories.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  isAvailable: integer("is_available", { mode: "boolean" }).notNull().default(true),
  stock: integer("stock").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

// Inventory Items
export const inventoryItems = sqliteTable("inventory_items", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  name: text("name").notNull().unique(),
  unit: text("unit").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  reorderPoint: integer("reorder_point").notNull().default(10),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  updatedAt: true,
});
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Inventory Adjustments (Audit Trail)
export const inventoryAdjustments = sqliteTable("inventory_adjustments", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  inventoryItemId: text("inventory_item_id")
    .references(() => inventoryItems.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  delta: integer("delta").notNull(),
  note: text("note"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const insertInventoryAdjustmentSchema = createInsertSchema(inventoryAdjustments).omit({
  id: true,
  createdAt: true,
});
export type InsertInventoryAdjustment = z.infer<typeof insertInventoryAdjustmentSchema>;
export type InventoryAdjustment = typeof inventoryAdjustments.$inferSelect;

// Orders
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status", { 
    enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"] 
  }).notNull().default("pending"),
  pickupType: text("pickup_type", { enum: ["now", "scheduled"] }).notNull().default("now"),
  scheduledTime: integer("scheduled_time", { mode: "timestamp" }),
  totalCents: integer("total_cents").notNull(),
  taxCents: integer("tax_cents").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  specialInstructions: text("special_instructions"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  orderId: text("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  menuItemId: text("menu_item_id")
    .references(() => menuItems.id),
  menuItemName: text("menu_item_name").notNull(),
  quantity: integer("quantity").notNull(),
  priceCents: integer("price_cents").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Order Status Events (Timeline)
export const orderStatusEvents = sqliteTable("order_status_events", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  orderId: text("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status", { 
    enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"] 
  }).notNull(),
  note: text("note"),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const insertOrderStatusEventSchema = createInsertSchema(orderStatusEvents).omit({
  id: true,
  timestamp: true,
});
export type InsertOrderStatusEvent = z.infer<typeof insertOrderStatusEventSchema>;
export type OrderStatusEvent = typeof orderStatusEvents.$inferSelect;
