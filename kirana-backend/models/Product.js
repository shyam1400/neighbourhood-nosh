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
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    required: true,
    min: 0
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
  subCategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
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

// Pre-save middleware to apply pricing logic
productSchema.pre('save', function(next) {
  // Apply pricing logic: only reduce 2 rupees if MRP - sale price >= 5
  const priceDifference = this.mrp - this.salePrice;
  
  if (priceDifference >= 5) {
    this.price = this.salePrice - 2;
  } else {
    this.price = this.salePrice;
  }
  
  // Ensure price doesn't go below 0
  if (this.price < 0) {
    this.price = this.salePrice;
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);