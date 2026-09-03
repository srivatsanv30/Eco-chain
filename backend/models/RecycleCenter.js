import mongoose from 'mongoose';

const recycleCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  acceptedMaterials: [{ type: String }],
  phone: { type: String },
  latitude: { type: Number },
  longitude: { type: Number }
}, { timestamps: true });

const RecycleCenter = mongoose.model('RecycleCenter', recycleCenterSchema);
export default RecycleCenter;
