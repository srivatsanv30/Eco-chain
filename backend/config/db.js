import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecochain');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Ensure MongoDB is running locally at mongodb://127.0.0.1:27017/ecochain, or configure MONGO_URI in .env');
    // We won't exit the process so the front-end mockup features and API route responses can still serve static mock data if DB fails.
  }
};

export default connectDB;
