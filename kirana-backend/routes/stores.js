const express = require('express');
const Store = require('../models/Store');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find({ isOpen: true }).populate('owner', 'username email phone');
    res.json(stores);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get store by ID
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'username email phone');
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get store products
router.get('/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ 
      store: req.params.id, 
      isAvailable: true 
    });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create store (vendor only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const store = new Store({
      ...req.body,
      owner: req.user.id
    });

    await store.save();
    res.status(201).json(store);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update store
router.put('/:id', auth, async (req, res) => {
  try {
    let store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(store);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 