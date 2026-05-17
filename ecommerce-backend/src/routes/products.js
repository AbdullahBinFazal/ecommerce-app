// src/routes/products.js
const { AppDataSource } = require("../config/data-source");
const { Product } = require("../entities/Product");

const router = require("express").Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const { category, search } = req.query;
    
    let query = productRepo.createQueryBuilder("product");
    
    if (category) {
      query = query.where("product.category = :category", { category });
    }
    
    if (search) {
      query = query.where("product.name ILIKE :search", { search: `%${search}%` });
    }
    
    const products = await query.getMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOneBy({ id: parseInt(req.params.id) });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET categories
router.get("/categories/all", async (req, res) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const categories = await productRepo
      .createQueryBuilder("product")
      .select("DISTINCT product.category", "category")
      .getRawMany();
    
    res.json(categories.map(c => c.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;