import User from '../models/User.js';
import Product from '../models/Product.js';
import CarbonReport from '../models/CarbonReport.js';
import { GoogleGenAI } from '@google/genai';

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// AI Engine — deterministic mock, can be swapped with real ML endpoint
const predictLifespan = (product) => {
  const base = product.lifespanYears;
  const repairBonus = product.repairabilityScore * 0.3;
  const ecoBonus = product.ecoScore > 70 ? 0.5 : 0;
  return parseFloat((base + repairBonus + ecoBonus).toFixed(1));
};

const repairVsReplace = (product) => {
  const repairCost = product.maintenanceCostYear * 0.6;
  const replaceCost = product.price * 1.1;
  const carbonSaved = product.carbonFootprint * 0.4;
  const decision = repairCost < replaceCost * 0.5 ? 'Repair' : 'Replace';
  return { repairCost: repairCost.toFixed(0), replaceCost: replaceCost.toFixed(0), carbonSaved: carbonSaved.toFixed(1), decision };
};

const predictOwnershipCost = (product) => {
  const years = predictLifespan(product);
  const totalMaintenance = product.maintenanceCostYear * years;
  const total = product.price + totalMaintenance;
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
Repairability Score: ${product.repairabilityScore}/100
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
        // Fallback to mock logic if AI fails
      }
    }

    // Fallback logic if AI is not configured or fails
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

export const getCarbonWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const reports = await CarbonReport.find({ user: req.user._id }).sort({ year: -1, month: -1 }).limit(12);

    res.json({
      success: true,
      data: {
        wallet: user.carbonWallet,
        reports
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRepairCenters = async (req, res) => {
  try {
    // Return mock list of repair centers (in production, filter by user's geolocation)
    const centers = [
      { _id: '1', name: 'Chennai Tech Repair', address: 'Mount Road, Chennai, Tamil Nadu', rating: 4.8, services: ['Electronics', 'Phones', 'Laptops'], phone: '+91 44-555-0101' },
      { _id: '2', name: 'Kovai Appliance Care', address: 'RS Puram, Coimbatore, Tamil Nadu', rating: 4.5, services: ['Appliances', 'HVAC', 'Refrigerators'], phone: '+91 422-555-0202' },
      { _id: '3', name: 'Madurai FixIt Station', address: 'Anna Nagar, Madurai, Tamil Nadu', rating: 4.6, services: ['Electronics', 'Gaming', 'Tablets'], phone: '+91 452-555-0303' },
      { _id: '4', name: 'Trichy QuickFix Lab', address: 'Thillai Nagar, Trichy, Tamil Nadu', rating: 4.3, services: ['Phones', 'Cameras', 'Audio'], phone: '+91 431-555-0404' },
    ];
    res.json({ success: true, data: centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecycleCenters = async (req, res) => {
  try {
    const centers = [
      { _id: '1', name: 'Guindy EcoPoint Recyclers', address: 'Guindy Industrial Estate, Chennai, Tamil Nadu', acceptedMaterials: ['Electronics', 'Batteries', 'Plastics', 'Glass'], phone: '+91 44-555-0505' },
      { _id: '2', name: 'Peelamedu TerraLoop Center', address: 'Peelamedu, Coimbatore, Tamil Nadu', acceptedMaterials: ['Metals', 'Paper', 'Cardboard', 'E-Waste'], phone: '+91 422-555-0606' },
      { _id: '3', name: 'Salem GreenCycle Hub', address: 'Omalur Main Road, Salem, Tamil Nadu', acceptedMaterials: ['Appliances', 'Tires', 'Furniture', 'Electronics'], phone: '+91 427-555-0707' },
    ];
    res.json({ success: true, data: centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
