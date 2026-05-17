require("reflect-metadata");
const { AppDataSource } = require("../config/data-source");
const { Product } = require("../entities/Product");

async function seed() {
  await AppDataSource.initialize();
  console.log("🌱 Seeding database...");
  
  const productRepo = AppDataSource.getRepository(Product);
  
  const products = [
    {
      name: "Wireless Headphones",
      price: 99.99,
      description: "High-quality wireless headphones with noise cancellation",
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      stock: 50
    },
    {
      name: "Smart Watch",
      price: 199.99,
      description: "Fitness tracker with heart rate monitor",
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
      stock: 30
    },
    {
      name: "Cotton T-Shirt",
      price: 24.99,
      description: "Comfortable 100% cotton t-shirt",
      category: "Clothing",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
      stock: 100
    },
    {
      name: "Coffee Mug",
      price: 12.99,
      description: "Ceramic coffee mug with unique design",
      category: "Home",
      imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300",
      stock: 75
    },
    {
      name: "Backpack",
      price: 49.99,
      description: "Water-resistant laptop backpack",
      category: "Accessories",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
      stock: 40
    },
    {
      name: "Running Shoes",
      price: 79.99,
      description: "Lightweight running shoes for daily workout",
      category: "Footwear",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      stock: 25
    }
  ];
  
  for (const product of products) {
    const existing = await productRepo.findOneBy({ name: product.name });
    if (!existing) {
      await productRepo.save(product);
      console.log(`✅ Added: ${product.name}`);
    } else {
      console.log(`⏭️ Skipped: ${product.name} (already exists)`);
    }
  }
  
  console.log("✅ Seeding complete!");
  await AppDataSource.destroy();
}

seed().catch(console.error);