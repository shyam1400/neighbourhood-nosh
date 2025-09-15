const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get customer profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const User = require('../models/User');
    const { username, email, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, phone, address, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
