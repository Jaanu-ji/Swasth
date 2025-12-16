// ✅ Auth Routes
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ user: { id: user._id, name: user.name, email: user.email, age: user.age, gender: user.gender, height: user.height, weight: user.weight, goal: user.goal } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, gender, height, weight, goal } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({ name, email, password, age, gender, height, weight, goal });
    await user.save();
    
    res.json({ user: { id: user._id, name: user.name, email: user.email, age: user.age, gender: user.gender, height: user.height, weight: user.weight, goal: user.goal } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

