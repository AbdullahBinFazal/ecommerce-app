// src/routes/orders.js
const { AppDataSource } = require("../config/data-source");
const { Order } = require("../entities/Order");
const { Cart } = require("../entities/Cart");

const router = require("express").Router();

// Create order from cart
router.post("/", async (req, res) => {
  try {
    const { sessionId, customerName, customerEmail, customerAddress, items, totalAmount } = req.body;
    
    console.log("📦 Order request received:", { sessionId, customerName, customerEmail, totalAmount });
    
    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }
    if (!customerName) {
      return res.status(400).json({ error: "customerName is required" });
    }
    if (!customerEmail) {
      return res.status(400).json({ error: "customerEmail is required" });
    }
    if (!customerAddress) {
      return res.status(400).json({ error: "customerAddress is required" });
    }
    if (!items || !items.length) {
      return res.status(400).json({ error: "items are required" });
    }
    
    const orderRepo = AppDataSource.getRepository(Order);
    const cartRepo = AppDataSource.getRepository(Cart);
    
    // Create order
    const order = orderRepo.create({
      sessionId,
      customerName,
      customerEmail,
      customerAddress,
      totalAmount: parseFloat(totalAmount),
      items: JSON.stringify(items),
      status: "pending"
    });
    
    const saved = await orderRepo.save(order);
    console.log("✅ Order saved:", saved.id);
    
    // Clear the cart after order placement
    await cartRepo.delete({ sessionId });
    console.log("🗑️ Cart cleared for session:", sessionId);
    
    res.status(201).json({ 
      success: true, 
      message: "Order placed successfully!",
      order: saved 
    });
    
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get orders by sessionId
router.get("/:sessionId", async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      where: { sessionId: req.params.sessionId },
      order: { createdAt: "DESC" }
    });
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin)
router.get("/admin/all", async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      order: { createdAt: "DESC" }
    });
    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;