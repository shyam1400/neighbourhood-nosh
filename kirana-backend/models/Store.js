const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  address: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  storeType: {
    type: String,
    enum: ['kirana', 'grocery', 'vegetables', 'dairy', 'general'],
    required: true
  },
  gstNumber: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  deliveryTime: {
    type: String,
    default: "15-30 min"
  },
  deliveryRadius: {
    type: Number,
    default: 5 // in km
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openingHours: {
    open: { type: String, default: "08:00" },
    close: { type: String, default: "22:00" }
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  image: {
    type: String,
    default: ""
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

module.exports = mongoose.model('Store', storeSchema);
```

```
