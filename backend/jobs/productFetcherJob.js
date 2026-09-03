import cron from 'node-cron';
import Product from '../models/Product.js';
import { fetchTrendingProducts } from '../services/aggregatorService.js';
// import { generateEcoMetrics } from '../controllers/aiController.js'; // Future AI integration

/**
 * Syncs products from external APIs into the Eco-chain database.
 */
export const syncProducts = async () => {
  console.log('🔄 Starting product sync from aggregators...');
  try {
    const rawProducts = await fetchTrendingProducts();
    
    let syncedCount = 0;
    
    for (const item of rawProducts) {
      // Basic fallback for eco metrics if not hitting AI for every product initially
      // In production, you would batch process these through your AI service.
      const simulatedEcoMetrics = {
        ecoScore: Math.floor(Math.random() * 40) + 50, // 50-90
        carbonFootprint: Math.floor(Math.random() * 50) + 30, // 30-80kg
        repairabilityScore: Math.floor(Math.random() * 5) + 5, // 5-10
        lifespanYears: Math.floor(Math.random() * 4) + 2, // 2-6 years
        maintenanceCostYear: Math.floor(Math.random() * 2000) + 500,
        energyRating: ['A+', 'A', 'B'][Math.floor(Math.random() * 3)],
        warrantyMonths: 12,
        aiSummary: `This ${item.brand} product is built with modern materials. Its repairability score is decent, but always consider long-term usage to offset the manufacturing carbon footprint of ${item.category.toLowerCase()}.`,
        aiSustainabilityScore: Math.floor(Math.random() * 40) + 50
      };

      const productData = {
        name: item.name,
        brand: item.brand,
        category: item.category,
        price: item.basePrice,
        image: item.image,
        description: item.description,
        externalId: item.externalId,
        affiliateLinks: item.affiliateLinks,
        specs: item.specs,
        ...simulatedEcoMetrics
      };

      // Upsert: Update if externalId exists, otherwise insert
      await Product.findOneAndUpdate(
        { externalId: item.externalId },
        { $set: productData },
        { upsert: true, new: true }
      );
      
      syncedCount++;
    }
    
    console.log(`✅ Successfully synced ${syncedCount} products to the database.`);
    return { success: true, count: syncedCount };
  } catch (error) {
    console.error('❌ Error syncing products:', error);
    return { success: false, error: error.message };
  }
};

// Schedule job to run every 12 hours
export const initCronJobs = () => {
  cron.schedule('0 */12 * * *', () => {
    console.log('Running scheduled product sync job...');
    syncProducts();
  });
  console.log('⏰ Product fetcher cron job initialized.');
};
