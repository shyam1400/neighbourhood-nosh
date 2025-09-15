const express = require('express');
const router = express.Router();
const pricePredictor = require('../services/pricePredictor');

// Initialize the price predictor on startup
pricePredictor.loadDataset().catch(console.error);

// Price prediction endpoint
router.post('/predict-price', async (req, res) => {
  try {
    const { productName, category, brand, description, currentSalePrice, currentMRP } = req.body;

    // Validate required fields
    if (!productName || !category) {
      return res.status(400).json({
        error: 'Product name and category are required'
      });
    }

    // Ensure dataset is loaded
    if (!pricePredictor.loaded) {
      await pricePredictor.loadDataset();
    }

    // Get price prediction
    const prediction = pricePredictor.predictPrice(
      productName,
      category,
      brand,
      description
    );

    // Apply the specific pricing logic (₹2 reduction rule)
    const finalPrice = pricePredictor.applyPricingLogic(
      prediction.predictedSalePrice,
      prediction.predictedMRP
    );

    const response = {
      success: true,
      mrp: prediction.predictedMRP,
      sellingPrice: finalPrice
    };

    res.json(response);

  } catch (error) {
    console.error('Price prediction error:', error);
    res.status(500).json({
      error: 'Failed to predict price',
      message: error.message
    });
  }
});

// Get dataset information
router.get('/dataset-info', async (req, res) => {
  try {
    if (!pricePredictor.loaded) {
      await pricePredictor.loadDataset();
    }

    const info = pricePredictor.getDatasetInfo();
    res.json({
      success: true,
      dataset: info
    });
  } catch (error) {
    console.error('Dataset info error:', error);
    res.status(500).json({
      error: 'Failed to get dataset information',
      message: error.message
    });
  }
});

// Get category statistics
router.get('/category-stats', async (req, res) => {
  try {
    if (!pricePredictor.loaded) {
      await pricePredictor.loadDataset();
    }

    const stats = pricePredictor.getCategoryStats();
    res.json({
      success: true,
      categoryStats: stats
    });
  } catch (error) {
    console.error('Category stats error:', error);
    res.status(500).json({
      error: 'Failed to get category statistics',
      message: error.message
    });
  }
});

// Get brand statistics
router.get('/brand-stats', async (req, res) => {
  try {
    if (!pricePredictor.loaded) {
      await pricePredictor.loadDataset();
    }

    const stats = pricePredictor.getBrandStats();
    res.json({
      success: true,
      brandStats: stats
    });
  } catch (error) {
    console.error('Brand stats error:', error);
    res.status(500).json({
      error: 'Failed to get brand statistics',
      message: error.message
    });
  }
});

module.exports = router;
