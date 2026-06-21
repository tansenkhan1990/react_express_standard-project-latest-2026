import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from './config/index.js';
import User from './models/userModel.js';

async function seed() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✓ Connected to MongoDB');

    const existing = await User.findOne({ email: 'demo@example.com' });
    if (existing) {
      console.log('→ Demo user already exists, skipping seed');
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    });

    console.log('✓ Demo user seeded (demo@example.com / password123)');
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
