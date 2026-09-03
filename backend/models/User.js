import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  carbonWallet: {
    balance: { type: Number, default: 450 }, // Initial green points/CO2 credits
    monthlyFootprint: { type: Number, default: 120 }, // kg CO2
    wasteGenerated: { type: Number, default: 12 }, // kg
    moneySaved: { type: Number, default: 85 }, // $
    purchasedCount: { type: Number, default: 4 },
    recycledCount: { type: Number, default: 1 },
    achievements: [
      {
        title: { type: String },
        description: { type: String },
        unlockedAt: { type: Date, default: Date.now }
      }
    ]
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
