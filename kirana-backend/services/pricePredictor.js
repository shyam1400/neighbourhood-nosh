const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class PricePredictor {
  constructor() {
    this.dataset = [];
    this.categoryStats = {};
    this.brandStats = {};
    this.loaded = false;
  }

  async loadDataset() {
    if (this.loaded) return;

    return new Promise((resolve, reject) => {
      const csvPath = path.join(__dirname, '../BigBasket Products.csv');
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Clean and parse the data
          const product = {
            index: parseInt(row.index),
            product: row.product?.trim(),
            category: row.category?.trim(),
            sub_category: row.sub_category?.trim(),
            brand: row.brand?.trim(),
            sale_price: parseFloat(row.sale_price) || 0,
            market_price: parseFloat(row.market_price) || 0,
            type: row.type?.trim(),
            rating: parseFloat(row.rating) || 0,
            description: row.description?.trim()
          };
          
          if (product.sale_price > 0 && product.market_price > 0) {
            this.dataset.push(product);
          }
        })
        .on('end', () => {
          this.calculateStats();
          this.loaded = true;
          console.log(`Loaded ${this.dataset.length} products from dataset`);
          resolve();
        })
        .on('error', reject);
    });
  }

  calculateStats() {
    // Calculate category-wise statistics
    this.dataset.forEach(product => {
      // Category stats
      if (!this.categoryStats[product.category]) {
        this.categoryStats[product.category] = {
          count: 0,
          avgSalePrice: 0,
          avgMarketPrice: 0,
          avgDiscount: 0,
          products: []
        };
      }
      this.categoryStats[product.category].products.push(product);
      this.categoryStats[product.category].count++;

      // Brand stats
      if (product.brand && !this.brandStats[product.brand]) {
        this.brandStats[product.brand] = {
          count: 0,
          avgSalePrice: 0,
          avgMarketPrice: 0,
          avgDiscount: 0,
          products: []
        };
      }
      if (product.brand) {
        this.brandStats[product.brand].products.push(product);
        this.brandStats[product.brand].count++;
      }
    });

    // Calculate averages
    Object.keys(this.categoryStats).forEach(category => {
      const stats = this.categoryStats[category];
      stats.avgSalePrice = stats.products.reduce((sum, p) => sum + p.sale_price, 0) / stats.count;
      stats.avgMarketPrice = stats.products.reduce((sum, p) => sum + p.market_price, 0) / stats.count;
      stats.avgDiscount = stats.avgMarketPrice - stats.avgSalePrice;
    });

    Object.keys(this.brandStats).forEach(brand => {
      const stats = this.brandStats[brand];
      stats.avgSalePrice = stats.products.reduce((sum, p) => sum + p.sale_price, 0) / stats.count;
      stats.avgMarketPrice = stats.products.reduce((sum, p) => sum + p.market_price, 0) / stats.count;
      stats.avgDiscount = stats.avgMarketPrice - stats.avgSalePrice;
    });
  }

  predictPrice(productName, category, brand = null, description = null) {
    if (!this.loaded) {
      throw new Error('Dataset not loaded. Call loadDataset() first.');
    }

    // Find similar products
    const similarProducts = this.findSimilarProducts(productName, category, brand, description);
    
    if (similarProducts.length === 0) {
      // Fallback to category averages
      const categoryStats = this.categoryStats[category];
      if (categoryStats) {
        return {
          predictedSalePrice: Math.round(categoryStats.avgSalePrice),
          predictedMRP: Math.round(categoryStats.avgMarketPrice),
          confidence: 0.3,
          method: 'category_average',
          similarProductsCount: 0
        };
      }
      
      // Ultimate fallback
      return {
        predictedSalePrice: 100,
        predictedMRP: 120,
        confidence: 0.1,
        method: 'default',
        similarProductsCount: 0
      };
    }

    // Calculate weighted average based on similarity
    let totalWeight = 0;
    let weightedSalePrice = 0;
    let weightedMRP = 0;

    similarProducts.forEach(({ product, similarity }) => {
      const weight = similarity;
      totalWeight += weight;
      weightedSalePrice += product.sale_price * weight;
      weightedMRP += product.market_price * weight;
    });

    const predictedSalePrice = Math.round(weightedSalePrice / totalWeight);
    const predictedMRP = Math.round(weightedMRP / totalWeight);

    return {
      predictedSalePrice,
      predictedMRP,
      confidence: Math.min(0.9, 0.5 + (similarProducts.length * 0.1)),
      method: 'similarity_based',
      similarProductsCount: similarProducts.length,
      similarProducts: similarProducts.slice(0, 3).map(sp => ({
        name: sp.product.product,
        salePrice: sp.product.sale_price,
        mrp: sp.product.market_price,
        similarity: sp.similarity
      }))
    };
  }

  findSimilarProducts(productName, category, brand, description, limit = 10) {
    const similarities = [];
    
    this.dataset.forEach(product => {
      let similarity = 0;
      
      // Category match (high weight)
      if (product.category === category) {
        similarity += 0.4;
      }
      
      // Brand match (medium weight)
      if (brand && product.brand === brand) {
        similarity += 0.3;
      }
      
      // Name similarity (medium weight)
      const nameSimilarity = this.calculateTextSimilarity(productName.toLowerCase(), product.product.toLowerCase());
      similarity += nameSimilarity * 0.2;
      
      // Description similarity (low weight)
      if (description && product.description) {
        const descSimilarity = this.calculateTextSimilarity(description.toLowerCase(), product.description.toLowerCase());
        similarity += descSimilarity * 0.1;
      }
      
      if (similarity > 0.3) { // Only include products with reasonable similarity
        similarities.push({ product, similarity });
      }
    });
    
    // Sort by similarity and return top matches
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  calculateTextSimilarity(text1, text2) {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    let commonWords = 0;
    words1.forEach(word => {
      if (words2.includes(word) && word.length > 2) {
        commonWords++;
      }
    });
    
    return commonWords / Math.max(words1.length, words2.length);
  }

  applyPricingLogic(salePrice, mrp) {
    const priceDifference = mrp - salePrice;
    
    if (priceDifference >= 5) {
      return salePrice - 2;
    } else {
      return salePrice;
    }
  }

  getCategoryStats() {
    return this.categoryStats;
  }

  getBrandStats() {
    return this.brandStats;
  }

  getDatasetInfo() {
    return {
      totalProducts: this.dataset.length,
      categories: Object.keys(this.categoryStats).length,
      brands: Object.keys(this.brandStats).length,
      loaded: this.loaded
    };
  }
}

module.exports = new PricePredictor();
