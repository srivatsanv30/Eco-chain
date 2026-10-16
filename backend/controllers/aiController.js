import User from '../models/User.js';
import Product from '../models/Product.js';
import CarbonReport from '../models/CarbonReport.js';
import RepairCenter from '../models/RepairCenter.js';
import RecycleCenter from '../models/RecycleCenter.js';
import { GoogleGenAI } from '@google/genai';

const ai = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// AI Engine — deterministic lifecycle prediction
const predictLifespan = (product) => {
  const base = product.lifespanYears || 4;
  const repairBonus = (product.repairabilityScore || 5) * 0.3;
  const ecoBonus = (product.ecoScore || 60) > 70 ? 0.5 : 0;
  return parseFloat((base + repairBonus + ecoBonus).toFixed(1));
};

const repairVsReplace = (product) => {
  const maintenance = product.maintenanceCostYear || 2500;
  const price = product.price || 30000;
  const footprint = product.carbonFootprint || 60;

  const repairCost = maintenance * 0.6;
  const replaceCost = price * 1.1;
  const carbonSaved = footprint * 0.4;
  const decision = repairCost < replaceCost * 0.5 ? 'Repair' : 'Replace';
  return { repairCost: repairCost.toFixed(0), replaceCost: replaceCost.toFixed(0), carbonSaved: carbonSaved.toFixed(1), decision };
};

const predictOwnershipCost = (product) => {
  const years = predictLifespan(product);
  const maintenance = product.maintenanceCostYear || 2500;
  const price = product.price || 30000;
  const totalMaintenance = maintenance * years;
  const total = price + totalMaintenance;
  return { years, totalMaintenance: totalMaintenance.toFixed(0), total: total.toFixed(0) };
};

export const getAIInsights = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alternatives = await Product.find({
      category: product.category,
      ecoScore: { $gt: product.ecoScore },
      _id: { $ne: product._id }
    }).limit(3).sort({ ecoScore: -1 });

    let aiData = null;

    if (ai) {
      const prompt = `Analyze this product and provide lifecycle insights in JSON format.
Product: ${product.name} (Brand: ${product.brand}, Category: ${product.category})
Price: $${product.price}
Eco Score: ${product.ecoScore}/100
Repairability Score: ${product.repairabilityScore}/10
Carbon Footprint: ${product.carbonFootprint} kg
Lifespan (Base): ${product.lifespanYears} years
Maintenance Cost/Year: $${product.maintenanceCostYear}

Return exactly this JSON structure, nothing else:
{
  "predictedLifespan": <number calculated based on base lifespan, repairability, and eco score>,
  "repairVsReplace": {
    "repairCost": <estimated total repair cost over lifetime>,
    "replaceCost": <estimated replacement cost>,
    "carbonSaved": <estimated carbon saved if repaired>,
    "decision": "Repair" or "Replace"
  },
  "ownershipCost": {
    "years": <predicted lifespan>,
    "totalMaintenance": <total maintenance cost over lifespan>,
    "total": <price + total maintenance>
  },
  "sustainabilityScore": <0-100 score based on eco score and repairability>,
  "aiSummary": "<A 2-sentence summary of the product's environmental impact and longevity>"
}`;
      
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
        
        aiData = JSON.parse(response.text);
      } catch (aiError) {
        console.error('Gemini API Error:', aiError);
      }
    }

    if (!aiData) {
      const lifespan = predictLifespan(product);
      aiData = {
        predictedLifespan: lifespan,
        repairVsReplace: repairVsReplace(product),
        ownershipCost: predictOwnershipCost(product),
        sustainabilityScore: product.aiSustainabilityScore || Math.round(product.ecoScore * 0.9 + product.repairabilityScore * 2),
        aiSummary: product.aiSummary || `This ${product.name} by ${product.brand} has an eco score of ${product.ecoScore}/100 with a predicted lifespan of ${lifespan} years under normal usage.`
      };
    }

    res.json({
      success: true,
      data: {
        ...aiData,
        greenAlternatives: alternatives
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeProductQuery = async (req, res) => {
  try {
    const { productName } = req.body;
    if (!productName || !productName.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    // Try finding an existing product in MongoDB
    let product = await Product.findOne({
      $or: [
        { name: { $regex: productName.trim(), $options: 'i' } },
        { productName: { $regex: productName.trim(), $options: 'i' } },
        { brand: { $regex: productName.trim(), $options: 'i' } }
      ]
    });

    if (!product) {
      // Find top rated products in DB as basis and alternatives
      const dbSample = await Product.findOne({}).sort({ ecoScore: -1 });
      product = {
        name: productName,
        brand: 'Generic / Custom',
        category: dbSample?.category || 'Electronics',
        price: dbSample?.price || 49999,
        ecoScore: 75,
        carbonFootprint: 62,
        repairabilityScore: 6.0,
        lifespanYears: 5,
        maintenanceCostYear: 3000,
        materials: ['Recycled Aluminum', 'Modular PCB', 'Bioplastic Casing']
      };
    }

    // Retrieve database green alternatives
    const alternatives = await Product.find({
      category: product.category,
      ...(product._id ? { _id: { $ne: product._id } } : {})
    }).sort({ ecoScore: -1 }).limit(3);

    const lifespan = predictLifespan(product);
    const rvReplace = repairVsReplace(product);
    const ownCost = predictOwnershipCost(product);

    const materialsAnalysis = (product.materials && product.materials.length > 0)
      ? product.materials.map((m, idx) => ({
          name: m,
          percentage: idx === 0 ? 45 : Math.round(55 / (product.materials.length - 1)),
          impact: idx === 0 ? 'Low' : 'Medium'
        }))
      : [
          { name: 'Post-Consumer Recycled Plastics', percentage: 40, impact: 'Low' },
          { name: 'Aluminum Framework', percentage: 35, impact: 'Medium' },
          { name: 'Copper & Rare Earths', percentage: 15, impact: 'High' },
          { name: 'Display Glass & Adhesive', percentage: 10, impact: 'Low' }
        ];

    const advices = [
      { type: 'maintenance', text: `Maintain regular cleaning and keep operating temperatures low to extend this device's ${lifespan}-year lifespan.` },
      { type: 'repair', text: `Repairability score is ${product.repairabilityScore}/10. Priority modular spare parts are ${product.sparePartsAvailable !== false ? 'available' : 'restricted'}.` },
      { type: 'recycling', text: product.recyclingInstructions || 'Take-back programmes exist at certified municipal e-waste recycling centres.' }
    ];

    res.json({
      success: true,
      data: {
        name: product.productName || product.name,
        brand: product.brand,
        category: product.category,
        ecoScore: product.ecoScore,
        carbonFootprint: product.carbonFootprint,
        repairabilityScore: product.repairabilityScore,
        lifespanYears: lifespan,
        materialsAnalysis,
        advices,
        repairVsReplace: rvReplace,
        ownershipCost: ownCost,
        alternatives: alternatives.map(a => ({
          _id: a._id,
          name: a.productName || a.name,
          brand: a.brand,
          ecoScore: a.ecoScore,
          price: `₹${a.price?.toLocaleString('en-IN')}`
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCarbonWallet = async (req, res) => {
  try {
    const userId = req.user?._id;
    let user = userId ? await User.findById(userId) : null;
    let reports = [];

    if (user) {
      reports = await CarbonReport.find({ user: user._id }).sort({ createdAt: 1 });
    }

    // If user has no reports yet or guest, get existing reports stored in the database
    if (!reports || reports.length === 0) {
      reports = await CarbonReport.find({}).sort({ createdAt: 1 }).limit(6);
    }

    const latestReport = reports[reports.length - 1];

    const wallet = user?.carbonWallet || {
      balance: 450,
      monthlyFootprint: latestReport?.carbonFootprint || 108,
      wasteGenerated: latestReport?.wasteGeneratedKg || 10,
      moneySaved: latestReport?.moneySaved || 110,
      purchasedCount: 4,
      recycledCount: 1,
      achievements: []
    };

    res.json({
      success: true,
      data: {
        wallet,
        reports
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRepairCenters = async (req, res) => {
  try {
    const centers = await RepairCenter.find({}).sort({ rating: -1 });
    res.json({ success: true, data: centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecycleCenters = async (req, res) => {
  try {
    const centers = await RecycleCenter.find({}).sort({ name: 1 });
    res.json({ success: true, data: centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
