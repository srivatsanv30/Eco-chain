import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RecycleCenter from './models/RecycleCenter.js';
import RepairCenter from './models/RepairCenter.js';
import CarbonReport from './models/CarbonReport.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

import { repairCenters, recycleCenters } from './data/ecoCentersData.js';


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
