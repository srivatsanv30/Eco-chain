import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RecycleCenter from './models/RecycleCenter.js';
import RepairCenter from './models/RepairCenter.js';
import CarbonReport from './models/CarbonReport.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const repairCenters = [
  { name: 'Chennai Tech Repair', address: 'Mount Road, Chennai, Tamil Nadu', rating: 4.8, services: ['Electronics', 'Phones', 'Laptops'], phone: '+91 44-555-0101' },
  { name: 'Kovai Appliance Care', address: 'RS Puram, Coimbatore, Tamil Nadu', rating: 4.5, services: ['Appliances', 'HVAC', 'Refrigerators'], phone: '+91 422-555-0202' },
  { name: 'Madurai FixIt Station', address: 'Anna Nagar, Madurai, Tamil Nadu', rating: 4.6, services: ['Electronics', 'Gaming', 'Tablets'], phone: '+91 452-555-0303' },
  { name: 'Trichy QuickFix Lab', address: 'Thillai Nagar, Trichy, Tamil Nadu', rating: 4.3, services: ['Phones', 'Cameras', 'Audio'], phone: '+91 431-555-0404' },
];

const recycleCenters = [
  { name: 'Guindy EcoPoint Recyclers', address: 'Guindy Industrial Estate, Chennai, Tamil Nadu', acceptedMaterials: ['Electronics', 'Batteries', 'Plastics', 'Glass'], phone: '+91 44-555-0505' },
  { name: 'Peelamedu TerraLoop Center', address: 'Peelamedu, Coimbatore, Tamil Nadu', acceptedMaterials: ['Metals', 'Paper', 'Cardboard', 'E-Waste'], phone: '+91 422-555-0606' },
  { name: 'Salem GreenCycle Hub', address: 'Omalur Main Road, Salem, Tamil Nadu', acceptedMaterials: ['Appliances', 'Tires', 'Furniture', 'Electronics'], phone: '+91 427-555-0707' },
];

const seedData = async () => {
  try {
    await connectDB();

    await RecycleCenter.deleteMany();
    await RepairCenter.deleteMany();

    await RecycleCenter.insertMany(recycleCenters);
    await RepairCenter.insertMany(repairCenters);

    console.log('Eco Centers Seeded Successfully');

    // Attempt to seed carbon reports for any users found
    const users = await User.find();
    if (users.length > 0) {
      await CarbonReport.deleteMany();
      
      const reports = [];
      for (const user of users) {
        const mockReports = [
          { user: user._id, month: 'Jan', year: 2026, carbonFootprint: 145, wasteGeneratedKg: 15, moneySaved: 50, recommendations: [] },
          { user: user._id, month: 'Feb', year: 2026, carbonFootprint: 132, wasteGeneratedKg: 13, moneySaved: 65, recommendations: [] },
          { user: user._id, month: 'Mar', year: 2026, carbonFootprint: 118, wasteGeneratedKg: 12, moneySaved: 80, recommendations: [] },
          { user: user._id, month: 'Apr', year: 2026, carbonFootprint: 110, wasteGeneratedKg: 11, moneySaved: 95, recommendations: [] },
          { user: user._id, month: 'May', year: 2026, carbonFootprint: 108, wasteGeneratedKg: 10, moneySaved: 110, recommendations: [] },
          { user: user._id, month: 'Jun', year: 2026, carbonFootprint: 95, wasteGeneratedKg: 9, moneySaved: 130, recommendations: [] },
        ];
        reports.push(...mockReports);
      }
      await CarbonReport.insertMany(reports);
      console.log('Carbon Reports Seeded Successfully');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
