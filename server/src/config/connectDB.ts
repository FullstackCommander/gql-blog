import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    if (!dbURI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully. May the force be with you! 🚀');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;