// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  try {
    // Create new user
    user = new User({ name, email, password });
    await user.save();
    
    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({ token }); // Send token to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  // Compare the entered password with the stored hashed password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = user.generateAuthToken();

  res.json({ token });
});

module.exports = router;
