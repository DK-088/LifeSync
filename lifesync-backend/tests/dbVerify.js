const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');
require('dotenv').config();

const verifyDB = async () => {
  try {
    await connectDB();
    console.log('[VERIFY] Successfully connected to database.');

    const email = `test_encrypt_${Date.now()}@example.com`;
    const mockUser = new User({
      name: 'Test Security User',
      email,
      password: 'password123',
      phone: '9876543210',
    });

    await mockUser.save();
    console.log('[VERIFY] Saved mock user successfully.');

    // Fetch user using mongoose model (should be automatically decrypted)
    const fetchedUser = await User.findOne({ email });
    console.log('[VERIFY] Mongoose model phone (decrypted):', fetchedUser.phone);
    
    // Fetch raw user from MongoDB collection (should be encrypted string)
    const rawUser = await mongoose.connection.db.collection('users').findOne({ email });
    console.log('[VERIFY] Raw MongoDB phone (encrypted):', rawUser.phone);

    if (fetchedUser.phone === '9876543210' && rawUser.phone && rawUser.phone !== '9876543210') {
      console.log('\x1b[32m%s\x1b[0m', '[VERIFY] SUCCESS: Phone field is encrypted in database and correctly decrypted by Mongoose!');
    } else {
      console.error('\x1b[31m%s\x1b[0m', '[VERIFY] FAILED: Phone encryption/decryption validation failed.');
    }

    // Clean up
    await User.deleteOne({ email });
    console.log('[VERIFY] Cleaned up test user.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[VERIFY] Verification script failed:', err);
    process.exit(1);
  }
};

verifyDB();
