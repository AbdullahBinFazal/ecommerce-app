// src/routes/users.js
const { AppDataSource } = require("../config/data-source");
const { User } = require("../entities/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = require("express").Router();
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key_2024";

// REGISTER - User Signup
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userRepo = AppDataSource.getRepository(User);
    
    // Check if email exists
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered!" });
    }
    
    // Password validation (at least 8 chars, one uppercase, one lowercase, one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters with uppercase, lowercase, and number!" 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ✅ FIX: Only first user becomes admin, all others become regular users
    const userCount = await userRepo.count();
    const role = userCount === 0 ? "admin" : "user";  // ← THIS IS THE KEY FIX!
    
    // Create user
    const user = userRepo.create({
      name,
      email,
      password: hashedPassword,
      role  // ← This will be "user" for everyone except the first person
    });
    
    const savedUser = await userRepo.save(user);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser.id, email: savedUser.email, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // Don't send password back
    const { password: _, ...safeUser } = savedUser;
    res.status(201).json({ 
      message: "User created successfully!", 
      user: safeUser,
      token 
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN - User Signin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    const { password: _, ...safeUser } = user;
    res.json({ 
      message: "Login successful!", 
      user: safeUser,
      token 
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET current user (protected)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: decoded.id });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;