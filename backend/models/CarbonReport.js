import mongoose from 'mongoose';

const carbonReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  carbonFootprint: { type: Number, required: true }, // kg CO2
  wasteGeneratedKg: { type: Number, required: true },
  moneySaved: { type: Number, required: true },
  recommendations: [{ type: String }]
}, { timestamps: true });

const CarbonReport = mongoose.model('CarbonReport', carbonReportSchema);
export default CarbonReport;
