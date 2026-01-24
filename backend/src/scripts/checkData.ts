import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car';
import Task from '../models/Task';
import Service from '../models/Service';
import User from '../models/User';

dotenv.config();

const checkData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-repair-workshop';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    // Check all collections
    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log('\n📦 Collections in database:');
    collections?.forEach(col => console.log(`  - ${col.name}`));

    // Count documents in each model
    const carCount = await Car.countDocuments();
    const taskCount = await Task.countDocuments();
    const serviceCount = await Service.countDocuments();
    const userCount = await User.countDocuments();

    console.log('\n📊 Document counts:');
    console.log(`  Cars: ${carCount}`);
    console.log(`  Tasks: ${taskCount}`);
    console.log(`  Services: ${serviceCount}`);
    console.log(`  Users: ${userCount}`);

    // Show sample data
    if (carCount > 0) {
      console.log('\n🚗 Sample Cars:');
      const cars = await Car.find().limit(3);
      cars.forEach(car => {
        console.log(`  - ${car.make} ${car.carModel} (${car.licensePlate})`);
      });
    }

    if (taskCount > 0) {
      console.log('\n📋 All Tasks with details:');
      const tasks = await Task.find()
        .populate('assignedTo', 'name email role')
        .populate('assignedBy', 'name email')
        .populate('car', 'make carModel licensePlate');
      tasks.forEach((task: any) => {
        console.log(`\n  Task: ${task.title}`);
        console.log(`    Status: ${task.status}`);
        console.log(`    Priority: ${task.priority}`);
        console.log(`    Due Date: ${task.dueDate}`);
        console.log(`    Assigned To: ${task.assignedTo?.name} (${task.assignedTo?.role})`);
        console.log(`    Car: ${task.car?.make} ${task.car?.carModel}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Check complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkData();
