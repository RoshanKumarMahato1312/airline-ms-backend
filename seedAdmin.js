const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function seedAdmin() {
  try {
    console.log('Connecting to:', MONGO_URI ? MONGO_URI.substring(0, 30) + '...' : 'NO URI FOUND!');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@airlinex.com';
    const adminPassword = 'Admin@123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists with id:', existingAdmin._id);
      console.log('Role:', existingAdmin.role);
      // Update the password and role to make sure it's correct
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin password and role have been reset/updated.');
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '+1234567890'
      });
      console.log('Admin user created successfully with id:', admin._id);
    }

    // Verify login works
    const verifyUser = await User.findOne({ email: adminEmail }).select('+password');
    if (verifyUser) {
      const isMatch = await bcrypt.compare(adminPassword, verifyUser.password);
      console.log('\n--- Verification ---');
      console.log('User found:', verifyUser.email);
      console.log('Role:', verifyUser.role);
      console.log('Password match:', isMatch);
      console.log('-------------------\n');
      if (isMatch) {
        console.log('SUCCESS! You can now login with:');
        console.log('  Email:    admin@airlinex.com');
        console.log('  Password: Admin@123');
      } else {
        console.log('ERROR: Password verification failed!');
      }
    } else {
      console.log('ERROR: Could not find the admin user after creation!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seedAdmin();
