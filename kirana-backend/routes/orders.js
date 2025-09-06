const express = require('express');
const Order = require('../models/Order');
const Store = require('../models/Store');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { storeId, items, deliveryAddress, paymentMethod, notes } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = new Order({
      customer: req.user.id,
      store: storeId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      notes
    });

    await order.save();
    await order.populate('store', 'name address phone');
    await order.populate('items.product', 'name price');

    res.status(201).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer orders
router.get('/customer', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('store', 'name address phone')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor orders
router.get('/vendor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const store = await Store.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const orders = await Order.find({ store: store._id })
      .populate('customer', 'username email phone')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to update this order
    if (req.user.role === 'vendor') {
      const store = await Store.findOne({ owner: req.user.id });
      if (order.store.toString() !== store._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'customer') {
      if (order.customer.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 