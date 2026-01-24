import mongoose from 'mongoose';
import SparePart from '../models/SparePart';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleSpareParts = [
  {
    name: 'Tormoz kolodkasi',
    price: 150000,
    quantity: 20,
    supplier: 'Avtomag do\'koni'
  },
  {
    name: 'Moy filtri',
    price: 25000,
    quantity: 15,
    supplier: 'Toyota Center'
  },
  {
    name: 'Havo filtri',
    price: 35000,
    quantity: 12,
    supplier: 'Avtomag do\'koni'
  },
  {
    name: 'Benzin filtri',
    price: 45000,
    quantity: 8,
    supplier: 'Hyundai Service'
  },
  {
    name: 'Amortizator',
    price: 250000,
    quantity: 6,
    supplier: 'Avtomag do\'koni'
  },
  {
    name: 'Disk kolodkasi',
    price: 180000,
    quantity: 10,
    supplier: 'Toyota Center'
  },
  {
    name: 'Svecha',
    price: 15000,
    quantity: 25,
    supplier: 'Avtomag do\'koni'
  },
  {
    name: 'Akkumulyator',
    price: 800000,
    quantity: 5,
    supplier: 'Mutlu Battery'
  }
];

const seedSpareParts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auto-service');
    console.log('✅ MongoDB connected');

    // Clear existing spare parts
    await SparePart.deleteMany({});
    console.log('🗑️  Cleared existing spare parts');

    // Insert sample spare parts
    const result = await SparePart.insertMany(sampleSpareParts);
    console.log(`✅ Created ${result.length} spare parts`);

    // List created spare parts
    console.log('\n📦 Created spare parts:');
    result.forEach((part, index) => {
      console.log(`${index + 1}. ${part.name} - ${part.price.toLocaleString()} so'm (${part.quantity} dona)`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding spare parts:', error);
    process.exit(1);
  }
};

// Run the script
seedSpareParts();