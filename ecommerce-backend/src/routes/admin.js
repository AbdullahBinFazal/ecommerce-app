// src/routes/admin.js
const { AppDataSource } = require("../config/data-source");
const { Product } = require("../entities/Product");
const { User } = require("../entities/User");
const { Order } = require("../entities/Order");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// GET all products (admin view)
router.get("/products", async (req, res) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new product
router.post("/products", async (req, res) => {
  try {
    const { name, price, description, category, imageUrl, stock } = req.body;
    const productRepo = AppDataSource.getRepository(Product);
    
    const product = productRepo.create({
      name,
      price,
      description,
      category,
      imageUrl,
      stock
    });
    
    const saved = await productRepo.save(product);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put("/products/:id", async (req, res) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOneBy({ id: parseInt(req.params.id) });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    Object.assign(product, req.body);
    const updated = await productRepo.save(product);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete("/products/:id", async (req, res) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const result = await productRepo.delete(parseInt(req.params.id));
    
    if (result.affected === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get("/users", async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({
      select: ["id", "name", "email", "role", "createdAt"]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all orders
router.get("/orders", async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      order: { createdAt: "DESC" }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;