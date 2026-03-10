const axios = require('axios');
const { OTP, User, IndustryCode } = require('./config/db');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('--- Starting Full Onboarding Test ---');

    // Step 0: Initial Signup
    console.log('\n0. Signup...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      name: 'Jane Doe',
      email: `jane${Date.now()}@example.com`,
      password: 'password123',
      confirm_password: 'password123'
    });
    const userId = signupRes.data.user.id;
    const email = signupRes.data.user.email;
    console.log('Signup Successful. User ID:', userId);

    // Step 0.5: Role Selection
    console.log('\n0.5 Role Selection...');
    await axios.post(`${API_URL}/auth/select-role`, {
      user_id: userId,
      role: 'buyer'
    });
    console.log('Role Selected: buyer');

    // Step 1: Organization Data
    console.log('\n1. Organization Data...');
    await axios.post(`${API_URL}/onboarding/organization`, {
      user_id: userId,
      organization_type: 'Private Company',
      department: 'Engineering',
      country: 'USA',
      state: 'California',
      city: 'San Francisco',
      post_code: '94105'
    });
    console.log('Organization Data Saved');

    // Step 2A: Send OTP
    console.log('\n2A. Send OTP...');
    await axios.post(`${API_URL}/onboarding/send-otp`, {
      user_id: userId
    });
    console.log('OTP Sent');

    // Step 2B: Fetch and Verify OTP
    console.log('\n2B. Fetch and Verify OTP...');
    const otpRecord = await OTP.findOne({ where: { email } });
    if (!otpRecord) throw new Error('OTP not found in database');
    console.log('Fetched OTP from DB:', otpRecord.otp);

    await axios.post(`${API_URL}/onboarding/verify-otp`, {
      user_id: userId,
      otp: otpRecord.otp
    });
    console.log('Email Verified');

    // Step 3: Create User ID and Password
    console.log('\n3. Create User ID and Password...');
    await axios.post(`${API_URL}/onboarding/create-user`, {
      user_id: userId,
      username: `jane_doe_${Date.now()}`,
      password: 'newpassword123',
      confirm_password: 'newpassword123'
    });
    console.log('User ID Created');

    // Step 4: Store Organization Info
    console.log('\n4. Organization Info...');
    await axios.post(`${API_URL}/onboarding/organization-info`, {
      user_id: userId,
      full_address: '123 Tech Lane, Silicon Valley, CA 94025',
      website: 'https://example.com',
      authorized_contact: 'Jane Doe',
      contact_phone: '+1 555-0123',
      tax_number: 'TX12345678',
      tax_registered: true
    });
    console.log('Organization Info Saved');

    // Step 5: Store Personal Info
    console.log('\n5. Personal Info...');
    await axios.post(`${API_URL}/onboarding/personal-info`, {
      user_id: userId,
      full_name: 'Jane Doe',
      last_name: 'Doe',
      designation: 'Senior Engineer',
      national_id: 'ID98765432',
      tax_id: 'TAX-PERSONAL-123'
    });
    console.log('Personal Info Saved');

    // Step 6: Get Industry Codes and Select
    console.log('\n6. Industry Selection...');
    const industriesRes = await axios.get(`${API_URL}/onboarding/industry-codes`);
    const industryIds = industriesRes.data.industries.slice(0, 2).map(i => i.id);
    console.log('Selected Industry IDs:', industryIds);

    await axios.post(`${API_URL}/onboarding/select-industry`, {
      user_id: userId,
      industry_codes: industryIds
    });
    console.log('Industry Selection Saved');

    // Step 7: Store Payment Method
    console.log('\n7. Payment Method...');
    await axios.post(`${API_URL}/onboarding/payment-method`, {
      user_id: userId,
      method_type: 'paypal',
      payment_identifier: 'jane.doe@example.com'
    });
    console.log('Payment Method Saved');

    console.log('\n--- Full Onboarding Test Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('\nTests Failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

runTests();
