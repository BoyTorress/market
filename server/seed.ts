import { storage } from "./storage";

async function seed() {
  console.log("Starting seed...");

  // Create menu categories
  const ramenCategory = await storage.createCategory({
    name: "Ramen",
    displayOrder: 1,
  });

  const appetizerCategory = await storage.createCategory({
    name: "Entrada",
    displayOrder: 2,
  });

  const dessertCategory = await storage.createCategory({
    name: "Postre",
    displayOrder: 3,
  });

  console.log("Categories created");

  // Create menu items
  await storage.createMenuItem({
    categoryId: ramenCategory.id,
    name: "Miso Ramen",
    description: "Caldo rico de miso con fideos, maíz, brotes de soya y cerdo chashu",
    priceCents: 1299,
    imageUrl: "/generated_images/Miso_ramen_menu_item_312c9d00.png",
    isAvailable: true,
    stock: 25,
  });

  await storage.createMenuItem({
    categoryId: ramenCategory.id,
    name: "Shoyu Ramen",
    description: "Caldo de soya clara con fideos delgados, nori, menma y chashu",
    priceCents: 1199,
    imageUrl: "/generated_images/Shoyu_ramen_menu_item_fef13de3.png",
    isAvailable: true,
    stock: 18,
  });

  await storage.createMenuItem({
    categoryId: ramenCategory.id,
    name: "Tan Tan Picante",
    description: "Ramen picante con carne molida, bok choy y aceite de chile",
    priceCents: 1399,
    imageUrl: "/generated_images/Spicy_tan_tan_ramen_bba0243c.png",
    isAvailable: true,
    stock: 20,
  });

  await storage.createMenuItem({
    categoryId: appetizerCategory.id,
    name: "Gyoza (6 pzs)",
    description: "Dumplings de cerdo dorados servidos con salsa de soya",
    priceCents: 799,
    imageUrl: "/generated_images/Gyoza_appetizer_1f44f37d.png",
    isAvailable: true,
    stock: 30,
  });

  await storage.createMenuItem({
    categoryId: appetizerCategory.id,
    name: "Edamame",
    description: "Vainas de soya saladas al vapor",
    priceCents: 599,
    imageUrl: "/generated_images/Edamame_appetizer_693b0fdf.png",
    isAvailable: true,
    stock: 0,
  });

  await storage.createMenuItem({
    categoryId: appetizerCategory.id,
    name: "Takoyaki (6 pzs)",
    description: "Bolas de pulpo con salsa y bonito",
    priceCents: 899,
    imageUrl: "/generated_images/Takoyaki_appetizer_42e4b02e.png",
    isAvailable: true,
    stock: 15,
  });

  await storage.createMenuItem({
    categoryId: dessertCategory.id,
    name: "Cheesecake Matcha",
    description: "Cheesecake cremoso de té verde matcha",
    priceCents: 699,
    imageUrl: "/generated_images/Matcha_cheesecake_dessert_ba818590.png",
    isAvailable: true,
    stock: 12,
  });

  await storage.createMenuItem({
    categoryId: dessertCategory.id,
    name: "Mochi Ice Cream (3 pzs)",
    description: "Helado envuelto en mochi suave",
    priceCents: 599,
    imageUrl: "/generated_images/Mochi_ice_cream_dessert_2571432d.png",
    isAvailable: true,
    stock: 20,
  });

  console.log("Menu items created");

  // Create inventory items
  await storage.createInventoryItem({
    name: "Fideos Frescos",
    unit: "kg",
    currentStock: 15,
    reorderPoint: 20,
  });

  await storage.createInventoryItem({
    name: "Caldo de Cerdo",
    unit: "L",
    currentStock: 45,
    reorderPoint: 30,
  });

  await storage.createInventoryItem({
    name: "Chashu (Cerdo)",
    unit: "kg",
    currentStock: 8,
    reorderPoint: 10,
  });

  await storage.createInventoryItem({
    name: "Huevos",
    unit: "pzs",
    currentStock: 0,
    reorderPoint: 50,
  });

  await storage.createInventoryItem({
    name: "Nori (Algas)",
    unit: "paquetes",
    currentStock: 25,
    reorderPoint: 15,
  });

  await storage.createInventoryItem({
    name: "Pasta Miso",
    unit: "kg",
    currentStock: 6,
    reorderPoint: 8,
  });

  console.log("Inventory items created");
  console.log("Seed completed successfully!");
}

seed().catch(console.error);
