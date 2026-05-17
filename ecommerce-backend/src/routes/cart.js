// src/routes/cart.js
const { AppDataSource } = require("../config/data-source");
const { Cart } = require("../entities/Cart");
const { Product } = require("../entities/Product");

const router = require("express").Router();

// Get cart by sessionId
router.get("/:sessionId", async (req, res) => {
  try {
    const cartRepo = AppDataSource.getRepository(Cart);
    const cartItems = await cartRepo.find({
      where: { sessionId: req.params.sessionId }
    });
    console.log(`Cart fetched for session: ${req.params.sessionId}`, cartItems.length, "items");
    res.json(cartItems);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add to cart
router.post("/", async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;
    
    console.log("Add to cart request:", { sessionId, productId, quantity });
    
    if (!sessionId || !productId) {
      return res.status(400).json({ error: "sessionId and productId are required" });
    }
    
    const cartRepo = AppDataSource.getRepository(Cart);
    const productRepo = AppDataSource.getRepository(Product);
    
    // Get product details
    const product = await productRepo.findOneBy({ id: parseInt(productId) });
    if (!product) {
      console.log("Product not found:", productId);
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log("Product found:", product.name, "Price:", product.price);
    
    // Check if item already in cart
    const existingItem = await cartRepo.findOne({
      where: { sessionId, productId: parseInt(productId) }
    });
    
    if (existingItem) {
      existingItem.quantity += quantity;
      await cartRepo.save(existingItem);
      console.log("Updated existing cart item:", existingItem.id, "new quantity:", existingItem.quantity);
      res.json(existingItem);
    } else {
      const cartItem = cartRepo.create({
        sessionId,
        productId: parseInt(productId),
        productName: product.name,
        price: parseFloat(product.price),
        quantity: quantity || 1,
        imageUrl: product.imageUrl
      });
      const saved = await cartRepo.save(cartItem);
      console.log("Created new cart item:", saved.id);
      res.status(201).json(saved);
    }
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update cart item quantity
router.put("/:id", async (req, res) => {
  try {
    const cartRepo = AppDataSource.getRepository(Cart);
    const cartItem = await cartRepo.findOneBy({ id: parseInt(req.params.id) });
    
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    
    cartItem.quantity = req.body.quantity;
    const updated = await cartRepo.save(cartItem);
    console.log("Updated cart item:", updated.id, "quantity:", updated.quantity);
    res.json(updated);
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Remove from cart
router.delete("/:id", async (req, res) => {
  try {
    const cartRepo = AppDataSource.getRepository(Cart);
    const result = await cartRepo.delete(parseInt(req.params.id));
    
    if (result.affected === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    console.log("Removed cart item:", req.params.id);
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Clear cart
router.delete("/clear/:sessionId", async (req, res) => {
  try {
    const cartRepo = AppDataSource.getRepository(Cart);
    await cartRepo.delete({ sessionId: req.params.sessionId });
    console.log("Cleared cart for session:", req.params.sessionId);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;