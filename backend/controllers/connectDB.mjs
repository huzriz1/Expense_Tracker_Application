import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

// Use a global cache to avoid reconnecting across serverless invocations
const globalRef = globalThis;
if (!globalRef.__mongoose_cache) {
  globalRef.__mongoose_cache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('MongoDB connection error: MONGO_URI is missing. Add your Atlas SRV connection string to backend/.env');
    throw new Error('Missing MONGO_URI');
  }

  const cached = globalRef.__mongoose_cache;
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10,
    }).then(() => {
      return mongoose;
    }).catch(err => {
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  console.log('Database Connected (cached)');
  return cached.conn;
};

export default connectDB;
