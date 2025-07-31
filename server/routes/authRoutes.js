// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });



const newUser = new User({ username, email, password });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login Route
// Login Route with Debug Logs
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: 'User not found' });
    }

    console.log("✅ Found user:", user.email);
    console.log("🔐 Hashed password in DB:", user.password);
    console.log("🔑 Password provided:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 bcrypt.compare result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { username: user.username, email: user.email }
    });

  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});


module.exports = router;
