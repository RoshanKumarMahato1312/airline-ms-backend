const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedAdmin() {
  try {
    const adminEmail = 'admin@airlinex.com';
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      // Ensure the existing user has admin role and reset password
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      existing.password = hashedPassword;
      existing.role = 'admin';
      await existing.save();
      console.log('[Seed] Admin user password reset and role confirmed.');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '+1234567890'
      });
      console.log('[Seed] Admin user created: admin@airlinex.com / Admin@123');
    }
  } catch (err) {
    console.error('[Seed] Failed to seed admin:', err.message);
  }
}

module.exports = seedAdmin;
