import { storage } from "./storage";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Starting seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await storage.createUser({
    email: "admin@kmarket.com",
    password: adminPassword,
    firstName: "Admin",
    lastName: "K-Market",
    role: "admin",
  });

  // Create a demo customer user
  const customerPassword = await bcrypt.hash("customer123", 10);
  await storage.createUser({
    email: "cliente@ejemplo.com",
    password: customerPassword,
    firstName: "Cliente",
    lastName: "Demo",
    role: "customer",
  });

  console.log("Users created");
  console.log("Admin: admin@kmarket.com / admin123");
  console.log("Cliente: cliente@ejemplo.com / customer123");

  // Create menu categories
  const ramenCategory = await storage.createCategory({
    name: "Ramens",
    displayOrder: 1,
  });

  const bebestiblesCategory = await storage.createCategory({
    name: "Bebestibles",
    displayOrder: 2,
  });

  const snacksCategory = await storage.createCategory({
    name: "Snacks",
    displayOrder: 3,
  });

  const tteokbokkiCategory = await storage.createCategory({
    name: "Tteokbokki",
    displayOrder: 4,
  });

  console.log("Categories created");

  // Create menu items - Ramens
  await storage.createMenuItem({
    categoryId: ramenCategory.id,
    name: "Ramen Instantáneo Coreano",
    description: "Ramen coreano clásico con fideos y caldo picante",
    priceCents: 1500,
    imageUrl: "/generated_images/Korean_instant_ramen_bowl_df85e0fd.png",
    isAvailable: true,
    stock: 50,
  });

  await storage.createMenuItem({
    categoryId: ramenCategory.id,
    name: "Kimchi Ramen",
    description: "Ramen picante con kimchi, cebolla verde y semillas de sésamo",
    priceCents: 1800,
    imageUrl: "/generated_images/Korean_kimchi_ramen_93831ee3.png",
    isAvailable: true,
    stock: 35,
  });

  await storage.createMenuItem({
    categoryId: ramenCategory.id,
    name: "Ramen de Mariscos",
    description: "Ramen cremoso con camarones, pastel de pescado y vegetales frescos",
    priceCents: 2200,
    imageUrl: "/generated_images/Korean_seafood_ramen_6c433a43.png",
    isAvailable: true,
    stock: 28,
  });

  // Bebestibles (Beverages)
  await storage.createMenuItem({
    categoryId: bebestiblesCategory.id,
    name: "Leche Saborizada Coreana",
    description: "Leche de plátano y otras variedades coreanas en botella icónica",
    priceCents: 1200,
    imageUrl: "/generated_images/Korean_flavored_milk_drinks_6b84aca4.png",
    isAvailable: true,
    stock: 45,
  });

  await storage.createMenuItem({
    categoryId: bebestiblesCategory.id,
    name: "Bebidas Coreanas Variadas",
    description: "Soju, bebidas enlatadas coreanas y más opciones refrescantes",
    priceCents: 2500,
    imageUrl: "/generated_images/Korean_beverages_and_drinks_bbd73721.png",
    isAvailable: true,
    stock: 60,
  });

  // Snacks
  await storage.createMenuItem({
    categoryId: snacksCategory.id,
    name: "Snacks Coreanos Mix",
    description: "Surtido de chips, galletas de arroz y snacks de alga nori",
    priceCents: 1800,
    imageUrl: "/generated_images/Korean_snacks_assortment_6d010e6a.png",
    isAvailable: true,
    stock: 40,
  });

  await storage.createMenuItem({
    categoryId: snacksCategory.id,
    name: "Snacks Coreanos Populares",
    description: "Honey Butter Chips, Pepero, Choco Pie y algas secas",
    priceCents: 2000,
    imageUrl: "/generated_images/Popular_Korean_snacks_e9a807f8.png",
    isAvailable: true,
    stock: 55,
  });

  // Tteokbokki
  await storage.createMenuItem({
    categoryId: tteokbokkiCategory.id,
    name: "Tteokbokki Clásico",
    description: "Pasteles de arroz cilíndricos en salsa gochujang picante con cebolla verde",
    priceCents: 2500,
    imageUrl: "/generated_images/Tteokbokki_Korean_rice_cakes_99d2836b.png",
    isAvailable: true,
    stock: 30,
  });

  await storage.createMenuItem({
    categoryId: tteokbokkiCategory.id,
    name: "Tteokbokki con Queso",
    description: "Tteokbokki picante cubierto con queso mozzarella derretido",
    priceCents: 3200,
    imageUrl: "/generated_images/Cheese_tteokbokki_special_038a69d5.png",
    isAvailable: true,
    stock: 25,
  });

  console.log("Menu items created");

  // Create inventory items
  await storage.createInventoryItem({
    name: "Fideos Ramen Coreano",
    unit: "paquetes",
    currentStock: 100,
    reorderPoint: 40,
  });

  await storage.createInventoryItem({
    name: "Gochujang (Pasta de Chile)",
    unit: "kg",
    currentStock: 15,
    reorderPoint: 8,
  });

  await storage.createInventoryItem({
    name: "Tteok (Pasteles de Arroz)",
    unit: "kg",
    currentStock: 20,
    reorderPoint: 10,
  });

  await storage.createInventoryItem({
    name: "Kimchi",
    unit: "kg",
    currentStock: 25,
    reorderPoint: 12,
  });

  await storage.createInventoryItem({
    name: "Leche Coreana Saborizada",
    unit: "unidades",
    currentStock: 60,
    reorderPoint: 30,
  });

  await storage.createInventoryItem({
    name: "Snacks Coreanos Variados",
    unit: "paquetes",
    currentStock: 80,
    reorderPoint: 35,
  });

  await storage.createInventoryItem({
    name: "Queso Mozzarella",
    unit: "kg",
    currentStock: 10,
    reorderPoint: 6,
  });

  console.log("Inventory items created");
  console.log("Seed completed successfully!");
}

seed().catch(console.error);
