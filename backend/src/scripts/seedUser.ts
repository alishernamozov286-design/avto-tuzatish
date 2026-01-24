import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const seedUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Check if users already exist
    const existingMaster = await User.findOne({ username: 'alisher' });
    const existingApprentice = await User.findOne({ username: 'shogird' });

    // Create master user if doesn't exist
    if (!existingMaster) {
      const masterUser = new User({
        name: 'Alisher Ustoz',
        email: 'alisher@example.com',
        username: 'alisher',
        password: '201120',
        role: 'master'
      });
      await masterUser.save();
      console.log('Master user created:');
      console.log('Username: alisher');
      console.log('Password: 201120');
      console.log('Role: master');
    } else {
      console.log('Master user "alisher" already exists');
    }

    // Create apprentice user if doesn't exist
    if (!existingApprentice) {
      const apprenticeUser = new User({
        name: 'Shogird Karim',
        email: 'shogird@example.com',
        username: 'shogird',
        password: '123456',
        role: 'apprentice'
      });
      await apprenticeUser.save();
      console.log('Apprentice user created:');
      console.log('Username: shogird');
      console.log('Password: 123456');
      console.log('Role: apprentice');
    } else {
      console.log('Apprentice user "shogird" already exists');
    }

  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedUser();