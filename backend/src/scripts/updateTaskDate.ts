import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task';
import User from '../models/User';
import Car from '../models/Car';

dotenv.config();

const updateTaskDate = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-repair-workshop';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    // Bugungi sana
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('\n📅 Bugungi sana:', today);

    // Barcha vazifalarni bugunga o'zgartirish
    const result = await Task.updateMany(
      {},
      { $set: { dueDate: today } }
    );
    
    console.log(`\n✅ ${result.modifiedCount} ta vazifa sanasi yangilandi`);

    // Yangilangan vazifalarni ko'rsatish
    const tasks = await Task.find();
    
    console.log('\n📋 Yangilangan vazifalar:');
    tasks.forEach((task: any) => {
      console.log(`  - ${task.title} - ${task.dueDate}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Update complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateTaskDate();
