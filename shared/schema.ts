import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  timestamp, 
  boolean,
  pgEnum,
  index,
  jsonb
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled"
]);
export const pickupTypeEnum = pgEnum("pickup_type", ["now", "scheduled"]);

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (adapted for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Menu Categories
export const menuCategories = pgTable("menu_categories", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
  createdAt: true,
});
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type MenuCategory = typeof menuCategories.$inferSelect;

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id", { length: 255 })
    .references(() => menuCategories.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

// Inventory Items
export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  unit: text("unit").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  reorderPoint: integer("reorder_point").notNull().default(10),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  updatedAt: true,
});
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Inventory Adjustments (Audit Trail)
export const inventoryAdjustments = pgTable("inventory_adjustments", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  inventoryItemId: varchar("inventory_item_id", { length: 255 })
    .references(() => inventoryItems.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id)
    .notNull(),
  delta: integer("delta").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInventoryAdjustmentSchema = createInsertSchema(inventoryAdjustments).omit({
  id: true,
  createdAt: true,
});
export type InsertInventoryAdjustment = z.infer<typeof insertInventoryAdjustmentSchema>;
export type InventoryAdjustment = typeof inventoryAdjustments.$inferSelect;

// Orders
export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id)
    .notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: orderStatusEnum("status").notNull().default("pending"),
  pickupType: pickupTypeEnum("pickup_type").notNull().default("now"),
  scheduledTime: timestamp("scheduled_time"),
  totalCents: integer("total_cents").notNull(),
  taxCents: integer("tax_cents").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  specialInstructions: text("special_instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items
export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id", { length: 255 })
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  menuItemId: varchar("menu_item_id", { length: 255 })
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
export const orderStatusEvents = pgTable("order_status_events", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id", { length: 255 })
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  status: orderStatusEnum("status").notNull(),
  note: text("note"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertOrderStatusEventSchema = createInsertSchema(orderStatusEvents).omit({
  id: true,
  timestamp: true,
});
export type InsertOrderStatusEvent = z.infer<typeof insertOrderStatusEventSchema>;
export type OrderStatusEvent = typeof orderStatusEvents.$inferSelect;
