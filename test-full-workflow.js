const axios = require('axios');
const db = require('./config/db');
const { User, OTP, IndustryCode } = db;

const API_URL = 'http://localhost:5000/api';

async function onboardUser(role, suffix) {
  console.log(`\n==========================================`);
  console.log(`  Onboarding ${role.toUpperCase()} User (${suffix})`);
  console.log(`==========================================`);
  
  // 0. Signup
  const email = `${role}_${suffix}@example.com`;
  const password = 'password123';
  const signupRes = await axios.post(`${API_URL}/auth/signup`, {
    name: `${role} ${suffix}`,
    email,
    password,
    confirm_password: password
  });
  const userId = signupRes.data.user.id;
  console.log(`✔️ Signup successful. ID: ${userId}`);
  
  // 0.5 Role Selection
  await axios.post(`${API_URL}/auth/select-role`, {
    user_id: userId,
    role: role === 'admin' ? 'buyer' : role // Admin starts as buyer in UI flow, we'll override later
  });
  console.log(`✔️ Role selected`);
  
  // 1. Organization Data
  await axios.post(`${API_URL}/onboarding/organization`, {
    user_id: userId,
    organization_type: 'Private Company',
    department: 'Engineering',
    country: 'USA',
    state: 'CA',
    city: 'San Francisco',
    post_code: '94105'
  });
  console.log(`✔️ Organization Data saved`);
  
  // 2A. Send OTP
  await axios.post(`${API_URL}/onboarding/send-otp`, { user_id: userId });
  console.log(`✔️ OTP sent`);
  
  // 2B. Verify OTP
  const otpRecord = await OTP.findOne({ where: { email } });
  await axios.post(`${API_URL}/onboarding/verify-otp`, {
    user_id: userId,
    otp: otpRecord.otp
  });
  console.log(`✔️ OTP verified`);
  
  // 3. Create User ID & Password
  await axios.post(`${API_URL}/onboarding/create-user`, {
    user_id: userId,
    username: `${role}_user_${suffix}`,
    password: 'newpassword123',
    confirm_password: 'newpassword123'
  });
  console.log(`✔️ User ID created`);
  
  // 4. Organization Info
  await axios.post(`${API_URL}/onboarding/organization-info`, {
    user_id: userId,
    full_address: '123 Test St',
    website: 'https://test.com',
    authorized_contact: 'Test Contact',
    contact_phone: '1234567890',
    tax_number: `TX${suffix}`,
    tax_registered: true
  });
  console.log(`✔️ Organization Info saved`);
  
  // 5. Personal Info
  await axios.post(`${API_URL}/onboarding/personal-info`, {
    user_id: userId,
    full_name: 'Test',
    last_name: 'User',
    designation: 'Manager',
    national_id: `ID${suffix}`,
    tax_id: `TAX${suffix}`
  });
  console.log(`✔️ Personal Info saved`);
  
  // 6. Select Industry
  const industriesRes = await axios.get(`${API_URL}/onboarding/industry-codes`);
  const industryIds = industriesRes.data.industries.slice(0, 2).map(i => i.id);
  await axios.post(`${API_URL}/onboarding/select-industry`, {
    user_id: userId,
    industry_codes: industryIds.length ? industryIds : [1] // fallback just in case
  });
  console.log(`✔️ Industry selected`);
  
  // 7. Payment Method
  await axios.post(`${API_URL}/onboarding/payment-method`, {
    user_id: userId,
    method_type: 'paypal',
    payment_identifier: email
  });
  console.log(`✔️ Payment method saved`);
  
  console.log(`>>> ${role.toUpperCase()} Onboarded Successfully!`);
  return { userId, email, password: 'newpassword123' };
}

async function loginUser(email, password) {
  const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
  return loginRes.data.token;
}

async function runTests() {
  try {
    console.log('🚀 STARTING FULL SYSTEM WORKFLOW TEST 🚀\n');
    const suffix = Date.now();
    
    // 1. Onboard 3 users
    const adminUser = await onboardUser('admin', suffix);
    const buyerUser = await onboardUser('buyer', suffix);
    const sellerUser = await onboardUser('seller', suffix);
    
    // 2. Hack Database to create Admin
    console.log('\n--- Elevating First User to Admin via DB ---');
    const adminDbUser = await db.User.findByPk(adminUser.userId);
    adminDbUser.role = 'admin';
    adminDbUser.status = 'active'; // Bypass approval
    adminDbUser.account_status = 'active';
    await adminDbUser.save();
    console.log('✔️ Admin setup completed!');
    
    // 3. Admin Approves the Buyer and Seller
    console.log('\n--- Admin Approves Users ---');
    const adminToken = await loginUser(adminUser.email, adminUser.password);
    await axios.put(`${API_URL}/admin/user/${buyerUser.userId}/approve`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✔️ Buyer Approved!');
    await axios.put(`${API_URL}/admin/user/${sellerUser.userId}/approve`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✔️ Seller Approved!');
    
    // 4. Buyer Logs In and Operates Dashboard
    console.log('\n--- Buyer creates RFQ ---');
    const buyerToken = await loginUser(buyerUser.email, buyerUser.password);
    const rfqRes = await axios.post(`${API_URL}/procurement/rfq`, {
      title: `RFQ for Laptops ${suffix}`,
      items: [
        { name: 'MacBook Pro', quantity: 10 },
        { name: 'Dell XPS', quantity: 20 }
      ]
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    const rfqId = rfqRes.data.rfq?.id || rfqRes.data.id;
    console.log(`✔️ RFQ Created! ID: ${rfqId}`);
    
    console.log('\n--- Buyer assigns Seller to RFQ ---');
    await axios.post(`${API_URL}/procurement/rfq/assign-suppliers`, {
      rfq_id: rfqId,
      suppliers: [sellerUser.userId]
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✔️ Seller assigned to RFQ!');
    
    // 5. Seller Logs In and Submits Quote
    console.log('\n--- Seller Submits Quotation ---');
    const sellerToken = await loginUser(sellerUser.email, sellerUser.password);
    const quoteRes = await axios.post(`${API_URL}/supplier/rfq/${rfqId}/quote`, {
      unit_price: 1500,
      delivery_days: 14,
      terms: '50% advance, balance on delivery'
    }, {
      headers: { Authorization: `Bearer ${sellerToken}` }
    });
    const quotationId = quoteRes.data.quotation?.id;
    console.log('✔️ Quotation Submitted!');
    
    // 6. Buyer Selects the Seller's Quote
    console.log('\n--- Buyer Selects Seller Quotation ---');
    await axios.put(`${API_URL}/procurement/rfq/${rfqId}/select-supplier`, {
      quotation_id: quotationId
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✔️ Seller Quotation Selected & Approved!');
    
    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! FULL WORKFLOW IS WORKING! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST FAILED!');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

// Start tests
setTimeout(runTests, 1000); // Small wait to make sure DB is initialized
