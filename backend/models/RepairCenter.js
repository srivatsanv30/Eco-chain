import mongoose from 'mongoose';

const repairCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  services: [{ type: String }],
  estimatedCostRange: { type: String, default: '$$' }, // $, $$, $$$
  phone: { type: String },
  latitude: { type: Number },
  longitude: { type: Number }
}, { timestamps: true });

const RepairCenter = mongoose.model('RepairCenter', repairCenterSchema);
export default RepairCenter;
