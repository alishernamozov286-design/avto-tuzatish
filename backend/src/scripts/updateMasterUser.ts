import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const updateMasterUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    const masterData = {
      name: 'Sardor Safarov',
      username: 'Sardor Safarov',
      password: 'S@rdor93',
      role: 'master'
    };

    let master = await User.findOne({ role: 'master' });

    if (master) {
      master.name = masterData.name;
      master.username = masterData.username;
      master.password = masterData.password;
      await master.save();
      console.log('✅ Master user updated successfully');
    } else {
      master = new User(masterData);
      await master.save();
      console.log('✅ Master user created successfully');
    }

    console.log('\n📊 Master User Details:');
    console.log(`Name: ${master.name}`);
    console.log(`Username: ${master.username}`);
    console.log(`Password: ${masterData.password}`);
    console.log(`Role: ${master.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateMasterUser();
