const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get vendor profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const User = require('../models/User');
    const Store = require('../models/Store');
    
    const user = await User.findById(req.user.id).select('-password');
    const store = await Store.findOne({ owner: req.user.id });
    
    res.json({ user, store });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vendor profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
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

// Get vendor dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const Store = require('../models/Store');
    const Product = require('../models/Product');
    const Order = require('../models/Order');
    
    const store = await Store.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const totalProducts = await Product.countDocuments({ store: store._id });
    const activeProducts = await Product.countDocuments({ store: store._id, isAvailable: true });
    const totalOrders = await Order.countDocuments({ store: store._id });
    const pendingOrders = await Order.countDocuments({ store: store._id, status: 'pending' });
    
    res.json({
      store,
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
