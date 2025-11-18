import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as fs from "fs";
import * as path from "path";
import {
  users,
  sessions,
  menuCategories,
  menuItems,
  inventoryItems,
  inventoryAdjustments,
  orders,
  orderItems,
  orderStatusEvents,
} from "@shared/schema";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(path.join(dataDir, "database.sqlite"));
const db = drizzle(sqlite);

console.log("Creating database schema...");

// Create tables manually
const createTablesSQL = `
-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  sid TEXT PRIMARY KEY,
  sess TEXT NOT NULL,
  expire INTEGER NOT NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at INTEGER,
  updated_at INTEGER
);

-- Menu categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  is_available INTEGER NOT NULL DEFAULT 1,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 10,
  updated_at INTEGER NOT NULL
);

-- Inventory adjustments table
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id TEXT PRIMARY KEY,
  inventory_item_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  delta INTEGER NOT NULL,
  note TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  pickup_type TEXT NOT NULL DEFAULT 'now',
  scheduled_time INTEGER,
  total_cents INTEGER NOT NULL,
  tax_cents INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  special_instructions TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  menu_item_id TEXT,
  menu_item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Order status events table
CREATE TABLE IF NOT EXISTS order_status_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
`;

const statements = createTablesSQL.split(';').filter(s => s.trim());
for (const statement of statements) {
  if (statement.trim()) {
    try {
      sqlite.exec(statement);
    } catch (error) {
      console.error("Error executing statement:", statement);
      console.error(error);
    }
  }
}

console.log("Database schema created successfully!");
sqlite.close();
