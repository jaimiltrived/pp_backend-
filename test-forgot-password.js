const axios = require('axios');
const { OTP, User } = require('./config/db');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('--- Starting Forgot Password Test ---');

    // Setup: Ensure a test user exists
    const email = 'test_reset@example.com';
    const password = 'oldpassword123';
    
    console.log('\n0. Setup: Creating test user...');
    await User.destroy({ where: { email } });
    await axios.post(`${API_URL}/auth/signup`, {
      name: 'Reset Test User',
      email: email,
      password: password,
      confirm_password: password
    });
    // Manually activate user for login test
    await User.update({ status: 'active', account_status: 'active' }, { where: { email } });
    console.log('Test User Created and Activated');

    // Step 1: Request Password Reset
    console.log('\n1. Requesting Password Reset...');
    await axios.post(`${API_URL}/auth/forgot-password`, {
      email: email
    });
    console.log('Reset Request Sent');

    // Step 2: Fetch OTP from DB
    console.log('\n2. Fetching OTP from DB...');
    const otpRecord = await OTP.findOne({ where: { email } });
    if (!otpRecord) throw new Error('OTP not found in database');
    const otp = otpRecord.otp;
    console.log('Fetched OTP:', otp);

    // Step 3: Verify OTP
    console.log('\n3. Verifying OTP...');
    await axios.post(`${API_URL}/auth/verify-reset-otp`, {
      email: email,
      otp: otp
    });
    console.log('OTP Verified');

    // Step 4: Reset Password
    console.log('\n4. Resetting Password...');
    const newPassword = 'newpassword456';
    await axios.post(`${API_URL}/auth/reset-password`, {
      email: email,
      otp: otp,
      new_password: newPassword,
      confirm_password: newPassword
    });
    console.log('Password Reset Successful');

    // Step 5: Verify Login with New Password
    console.log('\n5. Verifying Login with New Password...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: email,
      password: newPassword
    });
    console.log('Login Successful with New Password:', loginRes.data.user.email);

    console.log('\n--- Forgot Password Test Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('\nTests Failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

runTests();
