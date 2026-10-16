import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RecycleCenter from './models/RecycleCenter.js';
import RepairCenter from './models/RepairCenter.js';
import CarbonReport from './models/CarbonReport.js';
import ForumThread from './models/ForumThread.js';
import Notification from './models/Notification.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const INITIAL_REPAIR_CENTERS = [
  { name: 'Chennai Tech Repair', address: 'Mount Road, Anna Salai, Chennai, Tamil Nadu', rating: 4.8, services: ['Electronics', 'Phones', 'Laptops'], estimatedCostRange: '$$', phone: '+91 44-2852-0101', latitude: 13.0604, longitude: 80.2496 },
  { name: 'T. Nagar QuickFix & Apple Care', address: 'Usman Road, T. Nagar, Chennai, Tamil Nadu', rating: 4.7, services: ['Phones', 'Tablets', 'Smartwatches', 'Laptops'], estimatedCostRange: '$$$', phone: '+91 44-2434-1122', latitude: 13.0418, longitude: 80.2341 },
  { name: 'OMR Digital Circuit Lab', address: 'Rajiv Gandhi Salai, Thoraipakkam, Chennai, Tamil Nadu', rating: 4.9, services: ['Laptops', 'Motherboard Repair', 'Gaming', 'Electronics'], estimatedCostRange: '$$', phone: '+91 44-6625-3344', latitude: 12.9348, longitude: 80.2312 },
  { name: 'Velachery Home Tech Solutions', address: '100 Feet Bypass Road, Velachery, Chennai, Tamil Nadu', rating: 4.6, services: ['Appliances', 'TVs & Displays', 'Audio', 'Air Conditioners'], estimatedCostRange: '$$', phone: '+91 44-2244-5566', latitude: 12.9785, longitude: 80.2217 },
  { name: 'Anna Nagar Master Electronics', address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu', rating: 4.5, services: ['Phones', 'Audio', 'Cameras', 'Smartwatches'], estimatedCostRange: '$$', phone: '+91 44-2621-7788', latitude: 13.0850, longitude: 80.2101 },
  { name: 'Kovai Appliance Care', address: 'DB Road, RS Puram, Coimbatore, Tamil Nadu', rating: 4.5, services: ['Appliances', 'HVAC', 'Refrigerators', 'Washing Machines'], estimatedCostRange: '$$', phone: '+91 422-255-0202', latitude: 11.0117, longitude: 76.9482 },
  { name: 'Gandhipuram Smart Device Clinic', address: 'Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu', rating: 4.8, services: ['Phones', 'Laptops', 'Tablets', 'Gaming'], estimatedCostRange: '$', phone: '+91 422-223-3445', latitude: 11.0183, longitude: 76.9654 },
  { name: 'Peelamedu Tech Restore', address: 'Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu', rating: 4.6, services: ['Electronics', 'Laptops', 'Printers', 'Audio'], estimatedCostRange: '$$', phone: '+91 422-259-8800', latitude: 11.0310, longitude: 77.0028 },
  { name: 'Madurai FixIt Station', address: '80 Feet Road, Anna Nagar, Madurai, Tamil Nadu', rating: 4.6, services: ['Electronics', 'Gaming', 'Tablets', 'Phones'], estimatedCostRange: '$$', phone: '+91 452-252-0303', latitude: 9.9252, longitude: 78.1408 },
  { name: 'Temple City Cooling & Appliance Hub', address: 'West Veli Street, Periyar, Madurai, Tamil Nadu', rating: 4.4, services: ['Air Conditioners', 'Refrigerators', 'Washing Machines', 'Appliances'], estimatedCostRange: '$', phone: '+91 452-234-9876', latitude: 9.9195, longitude: 78.1193 },
  { name: 'Trichy QuickFix Lab', address: 'Salai Road, Thillai Nagar, Trichy, Tamil Nadu', rating: 4.5, services: ['Phones', 'Cameras', 'Audio', 'Laptops'], estimatedCostRange: '$$', phone: '+91 431-274-0404', latitude: 10.8285, longitude: 78.6854 },
  { name: 'Cantonment Gadget Specialist', address: 'Collector Office Road, Cantonment, Trichy, Tamil Nadu', rating: 4.7, services: ['Laptops', 'Tablets', 'Phones', 'Electronics'], estimatedCostRange: '$$', phone: '+91 431-241-5588', latitude: 10.8050, longitude: 78.6860 },
  { name: 'Salem Precision Audio & Vision', address: 'Meyyanur Bypass, Salem, Tamil Nadu', rating: 4.6, services: ['TVs & Displays', 'Audio', 'Appliances'], estimatedCostRange: '$$', phone: '+91 427-244-1234', latitude: 11.6643, longitude: 78.1460 },
  { name: 'Tirunelveli Solar & Electronic Rehab', address: 'South Bypass Road, Vannarpettai, Tirunelveli, Tamil Nadu', rating: 4.7, services: ['Electronics', 'Solar & Inverters', 'Power Banks', 'Appliances'], estimatedCostRange: '$', phone: '+91 462-250-1199', latitude: 8.7139, longitude: 77.7567 },
  { name: 'Vellore Tech Aid Hub', address: 'Katpadi Main Road, Suthanthira Ponvizha Nagar, Vellore, Tamil Nadu', rating: 4.5, services: ['Laptops', 'Phones', 'Printers', 'Electronics'], estimatedCostRange: '$', phone: '+91 416-222-7788', latitude: 12.9692, longitude: 79.1559 },
  { name: 'Bengaluru Koramangala Micro Lab', address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka', rating: 4.9, services: ['Laptops', 'Phones', 'Gaming', 'Motherboard Repair'], estimatedCostRange: '$$$', phone: '+91 80-4123-5566', latitude: 12.9352, longitude: 77.6245 },
  { name: 'Indiranagar Gadget Doctors', address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka', rating: 4.8, services: ['Phones', 'Smartwatches', 'Tablets', 'Audio'], estimatedCostRange: '$$$', phone: '+91 80-2520-9988', latitude: 12.9784, longitude: 77.6408 },
  { name: 'HSR GreenFix Appliance Workshop', address: '27th Main Road, Sector 1, HSR Layout, Bengaluru, Karnataka', rating: 4.7, services: ['Washing Machines', 'Refrigerators', 'Air Conditioners', 'Appliances'], estimatedCostRange: '$$', phone: '+91 80-2572-4411', latitude: 12.9121, longitude: 77.6446 },
  { name: 'Hyderabad Hitec Hardware Restore', address: 'Madhapur Main Road, Hitec City, Hyderabad, Telangana', rating: 4.8, services: ['Laptops', 'Electronics', 'TVs & Displays', 'Gaming'], estimatedCostRange: '$$', phone: '+91 40-6712-3400', latitude: 17.4483, longitude: 78.3915 },
  { name: 'Kochi Marine Drive Gadget Hospital', address: 'Shanmugham Road, Marine Drive, Kochi, Kerala', rating: 4.7, services: ['Phones', 'Cameras', 'Audio', 'Laptops'], estimatedCostRange: '$$', phone: '+91 484-236-8899', latitude: 9.9816, longitude: 76.2753 },
  { name: 'Mumbai Bandra Revive Tech Studio', address: 'Hill Road, Bandra West, Mumbai, Maharashtra', rating: 4.9, services: ['Phones', 'Laptops', 'Audio', 'Smartwatches'], estimatedCostRange: '$$$', phone: '+91 22-2640-1234', latitude: 19.0596, longitude: 72.8295 },
  { name: 'Pune Kothrud Circular Repair Zone', address: 'Paud Road, Kothrud, Pune, Maharashtra', rating: 4.6, services: ['Appliances', 'Electronics', 'TVs & Displays', 'Refrigerators'], estimatedCostRange: '$$', phone: '+91 20-2544-7766', latitude: 18.5074, longitude: 73.8077 }
];

const INITIAL_RECYCLE_CENTERS = [
  { name: 'Guindy EcoPoint Recyclers', address: 'Guindy Industrial Estate, Chennai, Tamil Nadu', acceptedMaterials: ['Electronics', 'Batteries', 'Plastics', 'Glass', 'E-Waste'], phone: '+91 44-2250-0505', latitude: 13.0067, longitude: 80.2025 },
  { name: 'Ambattur GreenMetals & E-Waste Facility', address: 'Ambattur Industrial Estate, Chennai, Tamil Nadu', acceptedMaterials: ['Metals', 'E-Waste', 'Cardboard', 'Appliances'], phone: '+91 44-2625-8822', latitude: 13.0983, longitude: 80.1623 },
  { name: 'Sholinganallur TerraLoop Clean Tech Hub', address: 'IT Corridor, Sholinganallur, Chennai, Tamil Nadu', acceptedMaterials: ['Electronics', 'Batteries', 'Plastics', 'E-Waste'], phone: '+91 44-6744-1290', latitude: 12.8996, longitude: 80.2279 },
  { name: 'Tambaram Sustainable Resource Recovery', address: 'GST Road, Tambaram Sanatorium, Chennai, Tamil Nadu', acceptedMaterials: ['Plastics', 'Paper', 'Cardboard', 'Metals'], phone: '+91 44-2226-4477', latitude: 12.9360, longitude: 80.1250 },
  { name: 'Peelamedu TerraLoop Center', address: 'Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu', acceptedMaterials: ['Metals', 'Paper', 'Cardboard', 'E-Waste', 'Plastics'], phone: '+91 422-257-0606', latitude: 11.0267, longitude: 77.0125 },
  { name: 'Sidco Circular Materials Depot', address: 'SIDCO Industrial Estate, Kurichi, Coimbatore, Tamil Nadu', acceptedMaterials: ['Appliances', 'Tires', 'Metals', 'Batteries'], phone: '+91 422-267-3344', latitude: 10.9412, longitude: 76.9698 },
  { name: 'Salem GreenCycle Hub', address: 'Omalur Main Road, Salem, Tamil Nadu', acceptedMaterials: ['Appliances', 'Tires', 'Furniture', 'Electronics', 'Metals'], phone: '+91 427-234-0707', latitude: 11.6854, longitude: 78.1344 },
  { name: 'Madurai Vaigai Eco Reclamation Center', address: 'Kappalur Industrial Estate, Madurai, Tamil Nadu', acceptedMaterials: ['E-Waste', 'Plastics', 'Batteries', 'Paper'], phone: '+91 452-248-6611', latitude: 9.8722, longitude: 78.0465 },
  { name: 'Trichy Cauvery CleanCycle Station', address: 'Thuvakudi Industrial Area, Trichy, Tamil Nadu', acceptedMaterials: ['Electronics', 'Metals', 'Glass', 'Cardboard'], phone: '+91 431-250-9933', latitude: 10.7584, longitude: 78.8021 },
  { name: 'Tirunelveli RenewEarth Center', address: 'Gangaikondan SIPCOT, Tirunelveli, Tamil Nadu', acceptedMaterials: ['Plastics', 'Tires', 'Batteries', 'Metals'], phone: '+91 462-270-4455', latitude: 8.8522, longitude: 77.7812 },
  { name: 'Vellore Ranipet Green Waste Recovery', address: 'SIPCOT Industrial Complex, Ranipet, Vellore Region, Tamil Nadu', acceptedMaterials: ['Metals', 'E-Waste', 'Plastics', 'Batteries'], phone: '+91 4172-244-100', latitude: 12.9272, longitude: 79.3324 },
  { name: 'Bengaluru Peenya ZeroWaste Mega Plant', address: '4th Phase, Peenya Industrial Area, Bengaluru, Karnataka', acceptedMaterials: ['E-Waste', 'Electronics', 'Metals', 'Batteries', 'Appliances'], phone: '+91 80-2839-4400', latitude: 13.0285, longitude: 77.5197 },
  { name: 'Whitefield Urban Mining Recyclers', address: 'EPIP Zone, Whitefield, Bengaluru, Karnataka', acceptedMaterials: ['Electronics', 'Batteries', 'Plastics', 'Paper', 'Cardboard'], phone: '+91 80-4166-7788', latitude: 12.9815, longitude: 77.7289 },
  { name: 'Electronics City Circular EcoHub', address: 'Phase 1, Hosur Road, Electronics City, Bengaluru, Karnataka', acceptedMaterials: ['E-Waste', 'Electronics', 'Batteries', 'Glass'], phone: '+91 80-2852-3322', latitude: 12.8452, longitude: 77.6602 },
  { name: 'Hyderabad Cherlapally GreenLoop Recyclers', address: 'IDA Cherlapally, Phase II, Hyderabad, Telangana', acceptedMaterials: ['Metals', 'E-Waste', 'Plastics', 'Appliances'], phone: '+91 40-2712-8877', latitude: 17.4699, longitude: 78.6012 },
  { name: 'Gachibowli EcoSafe Tech Disposal', address: 'Financial District, Nanakramguda, Hyderabad, Telangana', acceptedMaterials: ['Electronics', 'Batteries', 'Paper', 'Cardboard', 'E-Waste'], phone: '+91 40-4950-1122', latitude: 17.4156, longitude: 78.3478 },
  { name: 'Kochi Eloor CleanEarth E-Facility', address: 'Industrial Development Area, Eloor, Kochi, Kerala', acceptedMaterials: ['E-Waste', 'Batteries', 'Plastics', 'Glass'], phone: '+91 484-254-6633', latitude: 10.0768, longitude: 76.3015 },
  { name: 'Mumbai Navi Mumbai EcoRecycle Park', address: 'MIDC Industrial Area, Turbhe, Navi Mumbai, Maharashtra', acceptedMaterials: ['Appliances', 'E-Waste', 'Metals', 'Plastics', 'Electronics'], phone: '+91 22-2763-9900', latitude: 19.0688, longitude: 73.0238 },
  { name: 'Pune Bhosari Industrial GreenLoop', address: 'MIDC Bhosari, Pimpri-Chinchwad, Pune, Maharashtra', acceptedMaterials: ['Metals', 'Tires', 'Appliances', 'E-Waste', 'Batteries'], phone: '+91 20-2712-5500', latitude: 18.6298, longitude: 73.8488 },
  { name: 'Delhi Okhla EcoMatrix Recycling Depot', address: 'Okhla Industrial Area Phase-III, New Delhi', acceptedMaterials: ['Electronics', 'Batteries', 'Metals', 'Plastics', 'E-Waste'], phone: '+91 11-2681-3311', latitude: 28.5355, longitude: 77.2732 }
];

const seedData = async () => {
  try {
    await connectDB();

    // Check & Seed Repair Centers
    const repairCount = await RepairCenter.countDocuments();
    if (repairCount === 0) {
      await RepairCenter.insertMany(INITIAL_REPAIR_CENTERS);
      console.log('Seeded Repair Centers into MongoDB');
    }

    // Check & Seed Recycle Centers
    const recycleCount = await RecycleCenter.countDocuments();
    if (recycleCount === 0) {
      await RecycleCenter.insertMany(INITIAL_RECYCLE_CENTERS);
      console.log('Seeded Recycle Centers into MongoDB');
    }

    // Seed Carbon Reports for registered users if not present
    const users = await User.find();
    if (users.length > 0) {
      const existingReports = await CarbonReport.countDocuments();
      if (existingReports === 0) {
        const reports = [];
        for (const user of users) {
          const mockReports = [
            { user: user._id, month: 'Jan', year: 2026, carbonFootprint: 145, wasteGeneratedKg: 15, moneySaved: 50, recommendations: ['Switch to high repairability devices'] },
            { user: user._id, month: 'Feb', year: 2026, carbonFootprint: 132, wasteGeneratedKg: 13, moneySaved: 65, recommendations: ['Enable standby power off on monitors'] },
            { user: user._id, month: 'Mar', year: 2026, carbonFootprint: 118, wasteGeneratedKg: 12, moneySaved: 80, recommendations: ['Repair rather than replace household audio'] },
            { user: user._id, month: 'Apr', year: 2026, carbonFootprint: 110, wasteGeneratedKg: 11, moneySaved: 95, recommendations: ['Drop old lithium cells at authorized recycling centers'] },
            { user: user._id, month: 'May', year: 2026, carbonFootprint: 108, wasteGeneratedKg: 10, moneySaved: 110, recommendations: ['Opt for Energy Star A+ rated products'] },
            { user: user._id, month: 'Jun', year: 2026, carbonFootprint: 95, wasteGeneratedKg: 9, moneySaved: 130, recommendations: ['Great job maintaining low personal footprint!'] },
          ];
          reports.push(...mockReports);
        }
        await CarbonReport.insertMany(reports);
        console.log('Carbon Reports Seeded into MongoDB');
      }
    }

    console.log('All MongoDB database collections verified and ready.');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
