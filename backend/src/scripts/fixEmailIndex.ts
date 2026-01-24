import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const fixEmailIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ MongoDB connected');

    // Barcha null email larni undefined ga o'zgartirish
    const result = await User.updateMany(
      { email: null },
      { $unset: { email: 1 } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} users with null email`);

    // Email index ni qayta yaratish
    try {
      await User.collection.dropIndex('email_1');
      console.log('✅ Dropped old email index');
    } catch (error) {
      console.log('ℹ️ Email index not found or already dropped');
    }

    // Yangi sparse index yaratish
    await User.collection.createIndex(
      { email: 1 }, 
      { unique: true, sparse: true }
    );
    console.log('✅ Created new sparse email index');

    console.log('✅ Email index fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing email index:', error);
    process.exit(1);
  }
};

fixEmailIndex();