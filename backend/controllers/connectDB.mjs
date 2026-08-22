import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('MongoDB connection error: MONGO_URI is missing. Add your Atlas SRV connection string to backend/.env');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10,
    });
    console.log('Database Connected ! 🔥');
  } catch (error) {
    console.error('MongoDB connection error:', error.message || error);
  }
};

export default connectDB;
