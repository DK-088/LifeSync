const axios = require('axios');
const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');

const BASE_URL = 'http://localhost:5000';
const TEST_EMAIL = `forgot_test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'oldPassword123';
const NEW_PASSWORD = 'newPassword123!';
const TEST_OTP = '999999';

const runTest = async () => {
  console.log('[TEST] Starting Forgot Password API Flow Test...');

  try {
    // 1. Connect to MongoDB
    console.log('[TEST] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[TEST] Connected to MongoDB.');

    // 2. Register a new user
    console.log(`[TEST] Registering new user: ${TEST_EMAIL}`);
    const regRes = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Forgot Pass Tester',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      phone: '9876543212',
    });
    console.log('[TEST] Registration status:', regRes.status, regRes.data.message);

    // 3. Request Forgot Password OTP
    console.log('[TEST] Posting forgot-password request...');
    const forgotRes = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
      email: TEST_EMAIL,
    });
    console.log('[TEST] Forgot Password response:', forgotRes.status, forgotRes.data.message);

    // 4. Inspect DB and retrieve/overwrite OTP for testing
    console.log('[TEST] Verifying OTP and Expiry fields in Database...');
    let user = await User.findOne({ email: TEST_EMAIL });
    if (!user) throw new Error('User not found in DB after registration!');

    console.log('[TEST] DB resetPasswordOTP (Hashed):', user.resetPasswordOTP);
    console.log('[TEST] DB resetPasswordExpires:', user.resetPasswordExpires);

    if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
      throw new Error('OTP and/or Expiry were not saved in database!');
    }

    // Set DB to a known hashed OTP ('999999') to test the endpoints
    console.log(`[TEST] Injecting mock OTP: ${TEST_OTP} in Database...`);
    const hashedOtp = crypto.createHash('sha256').update(TEST_OTP).digest('hex');
    user.resetPasswordOTP = hashedOtp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();
    console.log('[TEST] Mock OTP injected.');

    // 5. Verify the OTP via API
    console.log(`[TEST] Sending verify-otp request with code: ${TEST_OTP}`);
    const verifyRes = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
      email: TEST_EMAIL,
      otp: TEST_OTP,
    });
    console.log('[TEST] Verify OTP response:', verifyRes.status, verifyRes.data.message);

    // 6. Reset Password via API
    console.log(`[TEST] Sending reset-password request with new password: ${NEW_PASSWORD}`);
    const resetRes = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
      email: TEST_EMAIL,
      otp: TEST_OTP,
      password: NEW_PASSWORD,
    });
    console.log('[TEST] Reset Password response:', resetRes.status, resetRes.data.message);

    // 7. Verify fields cleared in Database
    user = await User.findOne({ email: TEST_EMAIL });
    console.log('[TEST] Post-reset DB resetPasswordOTP:', user.resetPasswordOTP);
    console.log('[TEST] Post-reset DB resetPasswordExpires:', user.resetPasswordExpires);
    if (user.resetPasswordOTP !== null || user.resetPasswordExpires !== null) {
      throw new Error('OTP fields were not cleared after reset!');
    }

    // 8. Attempt login with old password (should fail)
    console.log('[TEST] Attempting login with OLD password (should fail)...');
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
      throw new Error('Login with old password succeeded, but should have failed!');
    } catch (loginErr) {
      if (loginErr.response && loginErr.response.status === 401) {
        console.log('[TEST] Correctly rejected login with old password.');
      } else {
        throw loginErr;
      }
    }

    // 9. Attempt login with NEW password (should succeed)
    console.log('[TEST] Attempting login with NEW password (should succeed)...');
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: NEW_PASSWORD,
    });
    console.log('[TEST] Login with new password response:', loginRes.status, loginRes.data.message);
    console.log('[TEST] Access token received:', loginRes.data.data.accessToken.substring(0, 15) + '...');

    // 10. Clean up test user
    console.log('[TEST] Cleaning up test user from database...');
    await User.deleteOne({ email: TEST_EMAIL });
    console.log('[TEST] Cleaned up.');

    console.log('\n\x1b[32m%s\x1b[0m', '---------------------------------------------------------');
    console.log('\x1b[32m%s\x1b[0m', '[TEST] SUCCESS: Forgot Password OTP Flow verified successfully!');
    console.log('\x1b[32m%s\x1b[0m', '---------------------------------------------------------');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n\x1b[31m%s\x1b[0m', '---------------------------------------------------------');
    console.error('\x1b[31m%s\x1b[0m', '[TEST] FAILED: Encountered error:');
    console.error('\x1b[31m%s\x1b[0m', error.response ? error.response.data : error.message);
    console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------------');

    // Attempt clean up
    try {
      await User.deleteOne({ email: TEST_EMAIL });
      await mongoose.connection.close();
    } catch (e) {}
    process.exit(1);
  }
};

runTest();
