import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  
  // External Integration
  externalId: { type: String, unique: true, sparse: true }, // e.g. Amazon ASIN
  affiliateLinks: [{
    store: { type: String }, // e.g. 'Amazon', 'Flipkart'
    url: { type: String },
    price: { type: Number }
  }],

  // Comparison Specs (Dynamic Key-Value pairs)
  specs: { type: Map, of: String, default: {} },

  // Community & Ratings
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  // Sustainability Metrics
  ecoScore: { type: Number, required: true, min: 0, max: 100 },
  carbonFootprint: { type: Number, required: true }, // kg CO2
  repairabilityScore: { type: Number, required: true, min: 0, max: 10 },
  lifespanYears: { type: Number, required: true },
  maintenanceCostYear: { type: Number, required: true },
  energyRating: { type: String, default: 'A' }, // A++, A+, A, B, C, etc.
  warrantyMonths: { type: Number, default: 12 },
  
  // Lifecycle Info
  materials: [{ type: String }],
  sparePartsAvailable: { type: Boolean, default: true },
  repairHistory: [{ type: String }],
  recyclingInstructions: { type: String, default: '' },
  
  // AI Generated Insights
  aiSummary: { type: String, default: '' },
  aiSustainabilityScore: { type: Number, min: 0, max: 100 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
