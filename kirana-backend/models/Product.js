const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['groceries', 'fruits', 'vegetables', 'dairy', 'snacks', 'beverages', 'others']
  },
  image: {
    type: String,
    default: ""
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: "piece"
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
```

```javascript:kirana-backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'wallet'],
    default: 'cash'
  },
  deliveryTime: {
    type: String,
    default: "15-30 min"
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
```

## 6. Authentication Routes

```javascript:kirana-backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('address').notEmpty().withMessage('Address is required'),
  body('role').isIn(['customer', 'vendor']).withMessage('Role must be customer or vendor')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, phone, address, role, storeName, storeType, gstNumber } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({
      username,
      email,
      password,
      phone,
      address,
      role
    });

    await user.save();

    // If vendor, create store
    if (role === 'vendor' && storeName) {
      const Store = require('../models/Store');
      const store = new Store({
        owner: user._id,
        name: storeName,
        storeType: storeType || 'general',
        gstNumber: gstNumber || '',
        address: user.address,
        phone: user.phone,
        email: user.email
      });
      await store.save();
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

## 7. Middleware

```javascript:kirana-backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

## 8. Store Routes

```javascript:kirana-backend/routes/stores.js
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
```

## 9. Order Routes

```javascript:kirana-backend/routes/orders.js
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
```

## 10. Installation and Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

## 11. API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `GET /api/stores/:id/products` - Get store products
- `POST /api/stores` - Create store (vendor only)
- `PUT /api/stores/:id` - Update store

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/customer` - Get customer orders
- `GET /api/orders/vendor` - Get vendor orders
- `PUT /api/orders/:id/status` - Update order status

## 12. Frontend Integration

Update your frontend to use these APIs:

```javascript
// Example API call
const loginUser = async (username, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};
```

This backend provides:
- ✅ User authentication (login/register)
- ✅ Store management
- ✅ Product management
- ✅ Order management
- ✅ Role-based access control
- ✅ JWT authentication
- ✅ MongoDB integration
- ✅ Input validation
- ✅ Error handling

The backend is ready to use with your React frontend! 🚀 