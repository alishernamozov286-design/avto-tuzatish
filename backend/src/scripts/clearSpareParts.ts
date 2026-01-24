import mongoose from 'mongoose';
import SparePart from '../models/SparePart';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const clearSpareParts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auto-service');
    console.log('✅ MongoDB connected');

    // Delete all spare parts
    const result = await SparePart.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} spare parts`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing spare parts:', error);
    process.exit(1);
  }
};

// Run the script
clearSpareParts();